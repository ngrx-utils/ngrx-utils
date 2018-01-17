import { Injectable } from '@angular/core';
import { Store, Selector, createFeatureSelector, createSelector } from '@ngrx/store';

@Injectable()
export class NgrxSelect {
  static store: Store<any> | undefined = undefined;
  static selectorMap: { [key: string]: Selector<any, any> } = {};

  connect(store: Store<any>) {
    NgrxSelect.store = store;
  }
}

export function Select<TState = any, TValue = any>(
  selector: Selector<TState, TValue>
): (target: any, name: string) => void;
export function Select(selectorOrFeature?: string, ...paths: string[]): (target: any, name: string) => void;
export function Select(selectorOrFeature?: string | Selector<any, any>, ...paths: string[]) {
  return function(target: any, name: string): void {
    let fn: Selector<any, any>;
    // Nothing here? Use propery name as selector
    if (!selectorOrFeature) {
      selectorOrFeature = name;
    }
    // Handle string vs Selector<any, any>
    if (typeof selectorOrFeature === 'string') {
      const propsArray = paths.length ? [selectorOrFeature, ...paths] : selectorOrFeature.split('.');
      fn = getSelector(propsArray);
    } else {
      fn = selectorOrFeature;
    }
    // Redefine property
    if (delete target[name]) {
      Object.defineProperty(target, name, {
        get: () => {
          // get connected store
          const store = NgrxSelect.store;
          if (!store) {
            throw new Error('NgrxSelect not connected to store!');
          }
          return store.select(fn);
        },
        enumerable: true,
        configurable: true
      });
    }
  };
}

function getSelector(paths: string[]): Selector<any, any> {
  const selectorMap = NgrxSelect.selectorMap;
  const key = paths.join('.');
  const cachedSelector = selectorMap[key];

  if (cachedSelector) return cachedSelector;

  const [featureName, ...propNames] = paths;
  const getFeature = createFeatureSelector(featureName);
  return (selectorMap[key] = propNames.reduce(
    (selected, prop) => createSelector(selected, (state: { [prop: string]: any }) => state[prop]),
    getFeature
  ));
}
