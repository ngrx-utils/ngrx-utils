import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operator/map';
import { pluck } from 'rxjs/operator/pluck';
import { distinctUntilChanged } from 'rxjs/operator/distinctUntilChanged';

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
export function Select(key?: string, ...paths: string[]): (target: any, name: string) => void;
export function Select<T, K>(pathOrMapFn?: ((state: T) => K) | string, ...paths: string[]) {
  return function(target: any, name: string): void {
    let mapped$: Store<any>;
    const source$ = NgrxSelect.store;

    if (!source$) {
      throw new Error('NgrxSelect not connected to store!');
    }

    if (!pathOrMapFn) {
      pathOrMapFn = name;
    }

    if (typeof pathOrMapFn === 'string') {
      mapped$ = pluck.call(source$, pathOrMapFn, ...paths);
    } else if (typeof pathOrMapFn === 'function') {
      mapped$ = map.call(source$, pathOrMapFn);
    } else {
      throw new TypeError(
        `Unexpected type '${typeof pathOrMapFn}' in select operator,` + ` expected 'string' or 'function'`
      );
    }
    if (delete target[name]) {
      Object.defineProperty(target, name, {
        get: () => {
          return distinctUntilChanged.call(mapped$);
        },
        enumerable: true,
        configurable: true
      });
    }
  };
}
