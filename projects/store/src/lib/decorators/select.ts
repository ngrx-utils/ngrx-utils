import { Selector } from '@ngrx/store';
import { OperatorFunction } from 'rxjs';

import { NgrxSelect } from './ngrx-select.module';

export function Select<A, B>(mapFn: Selector<A, B>): (target: any, name: string) => void;
export function Select<A, B, C>(
  mapFn: Selector<A, B>,
  op1: OperatorFunction<B, C>
): (target: any, name: string) => void;
export function Select<A, B, C, D>(
  mapFn: Selector<A, B>,
  op1: OperatorFunction<B, C>,
  op2: OperatorFunction<C, D>
): (target: any, name: string) => void;
export function Select<A, B, C, D, E>(
  mapFn: (state: A) => B,
  op1: OperatorFunction<B, C>,
  op2: OperatorFunction<C, D>,
  op3: OperatorFunction<D, E>
): (target: any, name: string) => void;
export function Select<A, B, C, D, E, F>(
  mapFn: Selector<A, B>,
  op1: OperatorFunction<B, C>,
  op2: OperatorFunction<C, D>,
  op3: OperatorFunction<D, E>,
  op4: OperatorFunction<E, F>
): (target: any, name: string) => void;
export function Select<A, B, C, D, E, F, G>(
  mapFn: Selector<A, B>,
  op1: OperatorFunction<B, C>,
  op2: OperatorFunction<C, D>,
  op3: OperatorFunction<D, E>,
  op4: OperatorFunction<E, F>,
  op5: OperatorFunction<F, G>
): (target: any, name: string) => void;
export function Select<A, B, C, D, E, F, G, H>(
  mapFn: Selector<A, B>,
  op1: OperatorFunction<B, C>,
  op2: OperatorFunction<C, D>,
  op3: OperatorFunction<D, E>,
  op4: OperatorFunction<E, F>,
  op5: OperatorFunction<F, G>,
  op6: OperatorFunction<G, H>
): (target: any, name: string) => void;
export function Select<A, B, C, D, E, F, G, H, I>(
  mapFn: Selector<A, B>,
  op1: OperatorFunction<B, C>,
  op2: OperatorFunction<C, D>,
  op3: OperatorFunction<D, E>,
  op4: OperatorFunction<E, F>,
  op5: OperatorFunction<F, G>,
  op6: OperatorFunction<G, H>,
  op7: OperatorFunction<H, I>
): (target: any, name: string) => void;
export function Select<A, B, C, D, E, F, G, H, I, J>(
  mapFn: Selector<A, B>,
  op1: OperatorFunction<B, C>,
  op2: OperatorFunction<C, D>,
  op3: OperatorFunction<D, E>,
  op4: OperatorFunction<E, F>,
  op5: OperatorFunction<F, G>,
  op6: OperatorFunction<G, H>,
  op7: OperatorFunction<H, I>,
  op8: OperatorFunction<I, J>
): (target: any, name: string) => void;
export function Select<A, B, C>(
  mapFn: Selector<A, B>,
  ...ops: OperatorFunction<B, C>[]
): (target: any, name: string) => void;

/**
 * Select decorator act like pipe operator of Observable
 * except the first parameter is a selector to select a piece
 * of state from @ngrx/store and you won't be able to subscribe to it
 * @example
 * export class MyComponent {
 *   @Select(fromStore.getAuth, take(1))
 *   isAuth: Observable<boolean>
 * }
 */
export function Select<A, B>(
  mapFn: ((state: A) => B),
  ...operations: OperatorFunction<any, any>[]
) {
  return function(target: any, propertyKey: string): void {
    if (typeof mapFn !== 'function') {
      throw new TypeError(
        `Unexpected type '${typeof mapFn}' in select operator, expected 'function'`
      );
    }

    /**
     * Get property descriptor for more precise define object property
     */
    const descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);

    if (delete target[propertyKey]) {
      Object.defineProperty(target, propertyKey, {
        ...descriptor,
        get() {
          const store = NgrxSelect.store;

          if (!store) {
            throw new Error('NgrxSelect not connected to store!');
          }

          const source$ = store.select(mapFn);

          return source$.pipe(...operations);
        }
      });
    }
  };
}
