import { NgrxSelectModule, Pluck, Select } from '@ngrx-utils/store';
import { NgrxSelect } from '@ngrx-utils/store/src/decorators/ngrx-select.module';
import { createFeatureSelector, createSelector, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators';

describe('Pluck', () => {
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

  const store = new Store(of(globalState), undefined as any, undefined as any);
  it('should select sub state with Pluck decorator', () => {
    NgrxSelect.store = store;
    class MyStateSelector {
      @Pluck('myFeature', 'bar', 'a', 'b', 'c', 'd')
      hello$: Observable<string>;
      @Pluck() myFeature: Observable<FooState>; // implied by name
      @Pluck('myFeature.bar.a.b.c.d') hi$: Observable<string>;
    }

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
  });
  it('should throw error when user not import NgrxSelectModule', () => {
    NgrxSelect.store = undefined;
    class MyStateSelector {
      @Pluck('bar$') bar$: Observable<any>; // using MemoizedSelector
    }

    const mss = new MyStateSelector();

    expect(() => mss.bar$).toThrowError();
  });

  it('should throw TypeError when input is not a function', () => {
    NgrxSelect.store = store;

    expect(() => {
      class MyStateSelector {
        @Pluck((() => {}) as any)
        bar$: Observable<any>; // using MemoizedSelector
      }
    }).toThrowError();
  });

  it('should throw error when property is non-configurable', () => {
    function seal(target: any, name: string) {
      Object.seal(target);
    }
    NgrxSelect.store = store;
    expect(() => {
      class MyStateSelector {
        @Pluck('bar$')
        @seal
        bar$: Observable<any>; // using MemoizedSelector
      }
    }).toThrowError();
  });
});
