import { OperatorFunction } from 'rxjs/interfaces';
import { pluck as pluckOperator } from 'rxjs/operators';

import { NgrxSelect } from './module';

/**
 * Strong typed pluck function to replace
 * rxjs/operators/pluck
 *
 * Accept max 4 properties name
 */
export function pluck<A, B extends keyof A>(s1: B): OperatorFunction<A, A[B]>;
export function pluck<A, B extends keyof A, C extends keyof A[B]>(
  s1: B,
  s2: C
): OperatorFunction<A, A[B][C]>;
export function pluck<A, B extends keyof A, C extends keyof A[B], D extends keyof A[B][C]>(
  s1: B,
  s2: C,
  s3: D
): OperatorFunction<A, A[B][C][D]>;
export function pluck<
  A,
  B extends keyof A,
  C extends keyof A[B],
  D extends keyof A[B][C],
  E extends keyof A[B][C][D]
>(s1: B, s2: C, s3: D, s4: E): OperatorFunction<A, A[B][C][D][E]>;
export function pluck<
  A,
  B extends keyof A,
  C extends keyof A[B],
  D extends keyof A[B][C],
  E extends keyof A[B][C][D],
  F extends keyof A[B][C][D][E]
>(s1: B, s2: C, s3: D, s4: E, s5: F): OperatorFunction<A, A[B][C][D][E][F]>;
export function pluck<
  A,
  B extends keyof A,
  C extends keyof A[B],
  D extends keyof A[B][C],
  E extends keyof A[B][C][D],
  F extends keyof A[B][C][D][E],
  G extends keyof A[B][C][D][E][F]
>(s1: B, s2: C, s3: D, s4: E, s5: F, s6: G): OperatorFunction<A, A[B][C][D][E][F][G]>;
export function pluck<T, V>(...props: string[]): OperatorFunction<T, V> {
  return pluckOperator<T, V>(...props);
}

/**
 * Provide an utility for select a piece of state from Root State.
 * Support shorthand syntax with 'dot' split property name and leave it empty
 * will use the component property name.
 * @example
 * export class MyComponent {
 *   @Pluck() prop1: Observable<any>
 *   @Pluck('feature.prop2') prop2: Observable<any>
 *   @Pluck('feature', 'prop3') prop3: Observable<any>
 * }
 */
export function Pluck(path?: string, ...paths: string[]) {
  return function(target: any, name: string) {
    let props: string[];

    if (!path) {
      path = name;
    }

    if (typeof path !== 'string') {
      throw new TypeError(
        `Unexpected type '${typeof path}' in select operator,` + ` expected 'string'`
      );
    }

    props = paths.length ? [path, ...paths] : path.split('.');

    /**
     * Get property descriptor for more precise define object property
     */
    const descriptor = Object.getOwnPropertyDescriptor(target, name);

    if (delete target[name]) {
      Object.defineProperty(target, name, {
        get() {
          const source$ = NgrxSelect.store;

          if (!source$) {
            throw new Error('NgrxSelect not connected to store!');
          }

          return source$.pipe(pluckOperator(...props));
        },
        ...descriptor
      });
    }
  };
}
