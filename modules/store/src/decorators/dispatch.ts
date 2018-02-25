import { NgrxSelect } from './ngrx-select.module';

export function Dispatch() {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    if (typeof originalMethod !== 'function') {
      throw new TypeError(
        `Unexpected type ${typeof originalMethod} of property ${propertyKey}, expected 'function'`
      );
    }

    // editing the descriptor/value parameter
    descriptor.value = function(...args: any[]) {
      const source$ = NgrxSelect.store;
      if (!source$) {
        throw new Error('NgrxSelect not connected to store!');
      }
      // note usage of originalMethod here
      const action = originalMethod.apply(this, args);
      if (typeof action !== 'object' || (typeof action === 'object' && !('type' in action))) {
        throw new TypeError(
          `Unexpected action in method return type, expected object of type 'Action'`
        );
      }
      source$.dispatch(action);
      return action;
    };

    // return edited descriptor as opposed to overwriting the descriptor
    return descriptor;
  };
}
