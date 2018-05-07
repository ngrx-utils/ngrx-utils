import { Select, ɵNgrxSelect as NgrxSelect } from '@ngrx-utils/store';
import { createFeatureSelector, createSelector, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

describe('Select', () => {
  interface FooState {
    foo: boolean | null;
    bar?: { a?: { b?: any } };
  }

  const globalState: { myFeature: FooState } = {
    myFeature: { foo: true, bar: { a: { b: { c: { d: 'world' } } } } }
  };

  const msFeature = createFeatureSelector<FooState>('myFeature');
  const msBar = createSelector(msFeature, state => state.bar);

  const store = new Store(of(globalState), undefined as any, undefined as any);

  it('selects sub state with Select decorator', () => {
    NgrxSelect.store = store;
    class MyStateSelector {
      @Select(msBar) bar$: Observable<any>; // using MemoizedSelector
    }

    const mss = new MyStateSelector();

    mss.bar$.subscribe(n => {
      expect(n).toBe(globalState.myFeature.bar);
    });
  });

  it('should apply pipeable operator when provided', () => {
    NgrxSelect.store = store;
    class MyStateSelector {
      @Select(
        msBar,
        map(a => {
          return !!a;
        })
      )
      bar$: Observable<any>; // using MemoizedSelector
    }

    const mss = new MyStateSelector();

    mss.bar$.subscribe(n => {
      expect(n).toBe(true);
    });
  });

  it('should throw error when user not import NgrxSelectModule', () => {
    NgrxSelect.store = null;
    class MyStateSelector {
      @Select(msBar) bar$: Observable<any>; // using MemoizedSelector
    }

    const mss = new MyStateSelector();

    expect(() => mss.bar$).toThrowError();
  });

  it('should throw TypeError when input is not a function', () => {
    NgrxSelect.store = store;

    expect(() => {
      class MyStateSelector {
        @Select('msBar' as any)
        bar$: Observable<any>; // using MemoizedSelector
      }
    }).toThrowError();
  });
});
