import { createFeatureSelector, createSelector, Store as NgRxStore } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { NgrxSelect, Pluck, Select } from '../src';
import { map } from 'rxjs/operators';

describe('ngrx-utils', () => {
  interface FooState {
    foo: boolean | null;
    bar?: {
      a?: {
        b?: any;
      };
    };
  }

  const globalState: {
    myFeature: FooState;
  } = {
    myFeature: {
      foo: true,
      bar: {
        a: {
          b: {
            c: {
              d: 'world'
            }
          }
        }
      }
    }
  };

  const msFeature = createFeatureSelector<FooState>('myFeature');
  const msBar = createSelector(msFeature, state => state.bar);

  const store = new NgRxStore(of(globalState), undefined, undefined);

  beforeEach(() => {
    NgrxSelect.store = store;
  });

  describe('select', () => {
    it('selects sub state with Select decorator', () => {
      class MyStateSelector {
        @Select(msBar) bar$: Observable<any>; // using MemoizedSelector
      }

      try {
        const mss = new MyStateSelector();

        mss.bar$.subscribe(n => {
          expect(n).toBe(globalState.myFeature.bar);
        });
      } finally {
        NgrxSelect.store = undefined;
      }
    });

    it('should apply pipeable operator when provided', () => {
      class MyStateSelector {
        @Select(
          msBar,
          map(a => {
            return !!a;
          })
        )
        bar$: Observable<any>; // using MemoizedSelector
      }

      try {
        const mss = new MyStateSelector();

        mss.bar$.subscribe(n => {
          expect(n).toBe(true);
        });
      } finally {
        NgrxSelect.store = undefined;
      }
    });
  });

  describe('pluck', () => {
    it('should select sub state with Pluck decorator', () => {
      class MyStateSelector {
        @Pluck('myFeature', 'bar', 'a', 'b', 'c', 'd')
        hello$: Observable<string>;
        @Pluck() myFeature: Observable<FooState>; // implied by name
        @Pluck('myFeature.bar.a.b.c.d') hi$: Observable<string>;
      }

      try {
        const mss = new MyStateSelector();

        mss.hello$.subscribe(n => {
          expect(n).toBe('world');
        });

        mss.myFeature.subscribe(n => {
          expect(n).toBe(globalState.myFeature);
        });
        mss.hi$.subscribe(n => {
          expect(n).toBe('world');
        });
      } finally {
        NgrxSelect.store = undefined;
      }
    });
  });
});
