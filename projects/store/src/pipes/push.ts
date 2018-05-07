import {
  ChangeDetectorRef,
  EventEmitter,
  NgModule,
  OnDestroy,
  Pipe,
  PipeTransform,
  WrappedValue,
  ɵisPromise as isPromise
} from '@angular/core';
import { Type, ɵstringify as stringify } from '@angular/core';
import { Observable, SubscriptionLike, isObservable } from 'rxjs';

export function invalidPipeArgumentError(type: Type<any>, value: Object) {
  return Error(`InvalidPipeArgument: '${value}' for pipe '${stringify(type)}'`);
}

interface SubscriptionStrategy {
  createSubscription(
    async: Observable<any> | Promise<any>,
    updateLatestValue: any
  ): SubscriptionLike | Promise<any>;
  dispose(subscription: SubscriptionLike | Promise<any>): void;
  onDestroy(subscription: SubscriptionLike | Promise<any>): void;
}

class ObservableStrategy implements SubscriptionStrategy {
  createSubscription(async: Observable<any>, updateLatestValue: any): SubscriptionLike {
    return async.subscribe({
      next: updateLatestValue,
      error: (e: any) => {
        throw e;
      }
    });
  }

  dispose(subscription: SubscriptionLike): void {
    subscription.unsubscribe();
  }

  onDestroy(subscription: SubscriptionLike): void {
    subscription.unsubscribe();
  }
}

class PromiseStrategy implements SubscriptionStrategy {
  createSubscription(async: Promise<any>, updateLatestValue: (v: any) => any): Promise<any> {
    return async.then(updateLatestValue, e => {
      throw e;
    });
  }

  dispose(subscription: Promise<any>): void {}

  onDestroy(subscription: Promise<any>): void {}
}

const _promiseStrategy = new PromiseStrategy();
const _observableStrategy = new ObservableStrategy();

/**
 * @ngModule PushPipeModule
 * @description
 *
 * Unwraps a value from an asynchronous primitive.
 *
 * The `push` pipe subscribes to an `Observable` or `Promise` and returns the
 * latest value it has emitted. When a new value is emitted, the `push` pipe
 * will run change detection and it works even when `zone` has been disabled.
 * When the component gets destroyed, the `push` pipe unsubscribes automatically
 * to avoid potential memory leaks.
 *
 */
@Pipe({ name: 'push', pure: false })
export class PushPipe implements PipeTransform, OnDestroy {
  private _latestValue: any = null;
  private _latestReturnedValue: any = null;

  private _subscription: SubscriptionLike | Promise<any> | null = null;
  private _obj: Observable<any> | Promise<any> | EventEmitter<any> | null = null;
  private _strategy: SubscriptionStrategy = null!;

  constructor(private _ref: ChangeDetectorRef) {}

  transform<T>(obj: null): null;
  transform<T>(obj: undefined): undefined;
  transform<T>(obj: Observable<T> | Promise<T> | null | undefined): T | null;
  transform(obj: Observable<any> | Promise<any> | null | undefined): any {
    if (this._obj === null) {
      if (obj != null) {
        this._subscribe(obj);
      }
      this._latestReturnedValue = this._latestValue;
      return this._latestValue;
    }

    if (obj !== this._obj) {
      this._dispose();
      return this.transform(obj as any);
    }

    if (this._latestValue === this._latestReturnedValue) {
      return this._latestReturnedValue;
    }

    this._latestReturnedValue = this._latestValue;
    return WrappedValue.wrap(this._latestValue);
  }

  ngOnDestroy() {
    if (this._subscription !== null) {
      this._dispose();
    }
  }

  private _subscribe(obj: Observable<any> | Promise<any> | EventEmitter<any>): void {
    this._obj = obj;
    this._strategy = this._selectStrategy(obj);
    this._subscription = this._strategy.createSubscription(obj, (value: Object) =>
      this._updateLatestValue(obj, value)
    );
  }

  private _dispose(): void {
    this._strategy.dispose(this._subscription!);
    this._latestValue = null;
    this._latestReturnedValue = null;
    this._subscription = null;
    this._obj = null;
  }

  private _selectStrategy(obj: Observable<any> | Promise<any> | EventEmitter<any>): any {
    if (isPromise(obj)) {
      return _promiseStrategy;
    }

    if (isObservable(obj)) {
      return _observableStrategy;
    }

    throw invalidPipeArgumentError(PushPipe, obj);
  }

  private _updateLatestValue(async: any, value: Object): void {
    if (async === this._obj) {
      this._latestValue = value;
      this._ref.detectChanges();
    }
  }
}

@NgModule({ exports: [PushPipe], declarations: [PushPipe] })
export class PushPipeModule {}
