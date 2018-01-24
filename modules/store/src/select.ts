import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { OperatorFunction } from 'rxjs/interfaces';

@Injectable()
export class NgrxSelect {
  /**
   * @internal
   */
  static store: Store<any> | undefined = undefined;

  connect(store: Store<any>) {
    NgrxSelect.store = store;
  }
}

export function Select<T, K>(mapFn: (state: T) => K): (target: any, name: string) => void;
export function Select<A, B, C>(
  mapFn: (state: A) => B,
  op1: OperatorFunction<B, C>
): (target: any, name: string) => void;
export function Select<T, K, R>(pathOrMapFn: ((state: T) => K), ...operations: OperatorFunction<K, R>[]) {
  return function(target: any, name: string): void {
    let fn: ((state: T) => K);

    if (!pathOrMapFn) {
      pathOrMapFn = name;
    }

    if (typeof pathOrMapFn === 'string') {
      fn = getPropFactory([pathOrMapFn, ...(operations as string[])]);
    } else if (typeof pathOrMapFn === 'function') {
      fn = pathOrMapFn;
    } else {
      throw new TypeError(
        `Unexpected type '${typeof pathOrMapFn}' in select operator,` + ` expected 'string' or 'function'`
      );
    }

    if (delete target[name]) {
      Object.defineProperty(target, name, {
        get: () => {
          const source$ = NgrxSelect.store;

          if (!source$) {
            throw new Error('NgrxSelect not connected to store!');
          }

          return source$.pipe(select(fn));
        },
        enumerable: true,
        configurable: true
      });
    }
  };
}

function getPropFactory(paths: string[]) {
  return (state: { [prop: string]: any }) =>
    paths.reduce((prev, cur) => {
      if (typeof cur === 'function') {
        throw new TypeError(
          'You must specify the first argument to have type function, or change this argument to App State object property name'
        );
      }
      return prev && prev[cur];
    }, state);
}
