import { Select, NgrxSelect } from '../index';
import { createFeatureSelector, createSelector, Store as NgRxStore } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

describe('ngrx-utils', () => {
  interface FooState {
    foo: boolean | null;
    bar?: {
      a?: {
        b?: any;
      };
    };
  }

  it('selects sub state', () => {
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

    class MyStateSelector {
      @Select('myFeature.bar.a.b.c.d') hello$: Observable<string>; // deeply nested props
      @Select() myFeature: Observable<FooState>; // implied by name
      @Select(msBar) bar$: Observable<any>; // using MemoizedSelector
    }

    const store = new NgRxStore(of(globalState), undefined, undefined);

    try {
      NgrxSelect.store = store;

      const mss = new MyStateSelector();

      mss.hello$.subscribe(n => {
        expect(n).toBe('world');
      });

      mss.myFeature.subscribe(n => {
        expect(n).toBe(globalState.myFeature);
      });

      mss.bar$.subscribe(n => {
        expect(n).toBe(globalState.myFeature.bar);
      });
    } finally {
      NgrxSelect.store = undefined;
    }
  });
});
