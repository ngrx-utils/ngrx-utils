import { pluck as pluckOperator } from 'rxjs/operators';

import { NgrxSelect } from './ngrx-select';

/**
 * @whatItDoes Provide an utility for select a piece of state from Root State.
 * @howToUse `@Pluck('state') state: Observable<any>`
 * @description Support shorthand syntax with 'dot' split property name and
 * leave it empty will use the component property name.
 * @example
 * ```typescript
 * export class MyComponent {
 *   @Pluck() prop1: Observable<any>
 *   @Pluck('feature.prop2') prop2: Observable<any>
 *   @Pluck('feature', 'prop3') prop3: Observable<any>
 * }
 * ```
 */
export function Pluck(path?: string, ...paths: string[]) {
  return function(target: any, propertyKey: string) {
    let props: string[];

    if (path === undefined || path === '') {
      path = propertyKey;
    }

    if (typeof path !== 'string') {
      throw new TypeError(`Unexpected type '${typeof path}' in pluck operator, expected 'string'`);
    }

    props = paths.length ? [path, ...paths] : path.split('.');

    /**
     * Get property descriptor for more precise define object property
     */
    const descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);

    if (delete target[propertyKey]) {
      Object.defineProperty(target, propertyKey, {
        ...descriptor,
        get() {
          const source$ = NgrxSelect.store;

          if (source$ === null) {
            throw new Error('NgrxSelect not connected to store!');
          }

          return source$.pipe(pluckOperator(...props));
        }
      });
    }
  };
}
