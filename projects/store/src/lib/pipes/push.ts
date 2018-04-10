import {
  ChangeDetectorRef,
  EventEmitter,
  NgModule,
  OnDestroy,
  Pipe,
  PipeTransform,
  WrappedValue
} from '@angular/core';
import { Observable, SubscriptionLike } from 'rxjs';

export interface SubscriptionStrategy {
  createSubscription(async: Observable<any>, updateLatestValue: any): SubscriptionLike;
  dispose(subscription: SubscriptionLike): void;
  onDestroy(subscription: SubscriptionLike): void;
}

export class ObservableStrategy implements SubscriptionStrategy {
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

export const _observableStrategy = new ObservableStrategy();

@Pipe({ name: 'push', pure: false })
export class PushPipe implements PipeTransform, OnDestroy {
  private _latestValue: any = null;
  private _latestReturnedValue: any = null;

  private _subscription: SubscriptionLike | null = null;
  private _obj: Observable<any> | EventEmitter<any> | null = null;
  private _strategy: SubscriptionStrategy = _observableStrategy;

  constructor(private _ref: ChangeDetectorRef) {}

  transform<T>(obj: null): null;
  transform<T>(obj: undefined): undefined;
  transform<T>(obj: Observable<T> | null | undefined): T | null;
  transform(obj: Observable<any> | null | undefined): any {
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

  private _subscribe(obj: Observable<any> | EventEmitter<any>): void {
    this._obj = obj;
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

  private _updateLatestValue(async: any, value: Object): void {
    if (async === this._obj) {
      this._latestValue = value;
      this._ref.detectChanges();
    }
  }
}

@NgModule({
  exports: [PushPipe],
  declarations: [PushPipe]
})
export class PushPipeModule {}
