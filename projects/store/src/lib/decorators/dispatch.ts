import { Action, Store } from '@ngrx/store';

import { NgrxSelect } from './ngrx-select.module';

/**
 * @whatItDoes Dispatch method returned action.
 * @howToUse `@Dispatch() componentMethod() { return new Action() }`
 */
export function Dispatch() {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value as Function;

    if (typeof originalMethod !== 'function') {
      throw new TypeError(
        `Unexpected type ${typeof originalMethod} of property ${propertyKey}, ` +
          `expected 'function'`
      );
    }

    // editing the descriptor/value parameter
    descriptor.value = function(...args: any[]) {
      const source$ = NgrxSelect.store;
      if (!source$) {
        throw new Error('NgrxSelect not connected to store!');
      }
      // note usage of originalMethod here
      const actions = originalMethod.apply(this, args);

      if (Array.isArray(actions)) {
        dispatch(source$, actions);
      } else {
        dispatch(source$, [actions]);
      }
      return actions;
    };

    // return edited descriptor as opposed to overwriting the descriptor
    return descriptor;
  };
}

export function dispatch<T extends Action = Action>(source$: Store<any>, actions: T[]) {
  actions.forEach(action => {
    if (typeof action !== 'object' || (typeof action === 'object' && !('type' in action))) {
      throw new TypeError(
        `Unexpected action in method return type, expected object of type 'Action'`
      );
    }
    source$.dispatch(action);
  });
}
