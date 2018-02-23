import { Component, NgModule, OnDestroy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createFeatureSelector, createSelector, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { NgLetModule, NgrxUtilsModule, Pluck, pluck, Select, untilDestroy } from '../src';
import { NgrxSelect } from '../src/decorators/module';
import { addDestroyObservableToComponent, destroy$ } from '../src/operators/untilDestroy';

@Component({
  template: '',
  selector: 'sand-test'
})
export class TestComponent implements OnDestroy {
  test$ = new Subject<number>();
  test = 10;
  sub: Subscription;

  constructor() {
    this.sub = this.test$.pipe(untilDestroy(this)).subscribe(a => (this.test = a));
  }

  ngOnDestroy() {}
}

@NgModule({
  declarations: [TestComponent],
  imports: [NgLetModule]
})
export class TestModule {}

describe('@ngrx-utils/store', () => {
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

  afterEach(() => {
    NgrxSelect.store = undefined;
  });

  describe('modules', () => {
    it('should create module', () => {
      const ngrxSelect = new NgrxSelect();
      spyOn(ngrxSelect, 'connect').and.callThrough();
      expect(ngrxSelect).toBeTruthy();
      expect(new NgrxUtilsModule(ngrxSelect, store)).toBeTruthy();
      expect(ngrxSelect.connect).toHaveBeenCalled();
      expect(NgrxSelect.store).toEqual(store);
    });
  });

  describe('select', () => {
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
  });

  describe('pluck', () => {
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
  });

  describe('untilDestroy', () => {
    let fixture: ComponentFixture<TestComponent>;
    let instance: TestComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent]
      });
    });

    it('should unsubscribe when component is destroyed', () => {
      fixture = TestBed.createComponent(TestComponent);
      instance = fixture.componentInstance;
      fixture.detectChanges();
      instance.test$.next(2);
      fixture.detectChanges();

      expect(instance.test).toBe(2);

      instance.ngOnDestroy();
      fixture.detectChanges();
      instance.test$.next(3);

      expect(instance.test).toBe(2);
      expect(instance.sub.closed).toBe(true);
    });

    it('should throw error when component does not implement OnDestroy', () => {
      class ErrorComponent {
        test$ = new Subject<number>();
        test = 10;
        sub: Subscription;

        constructor() {
          this.sub = this.test$.pipe(untilDestroy(this)).subscribe(a => (this.test = a));
        }
      }
      expect(() => new ErrorComponent()).toThrowError(
        'untilDestroy operator needs the component to have an ngOnDestroy method'
      );
    });

    it('should ensure symbol $destroy on component', () => {
      class Test2Component {
        ngOnDestroy() {}
      }

      const testComp = new Test2Component();
      let symbols = Object.getOwnPropertySymbols(testComp);
      expect(symbols).not.toContain(destroy$);
      expect((testComp as any)[destroy$]).toBeUndefined();

      const spy = jasmine
        .createSpy('addObservableOnDestroy', addDestroyObservableToComponent)
        .and.callThrough();
      spy(testComp);
      expect(spy).toHaveBeenCalled();
      symbols = Object.getOwnPropertySymbols(testComp);
      expect(symbols).toContain(destroy$);
    });
  });

  describe('pluck', () => {
    const obj = { a: { b: true, c: { d: false, e: { f: 5 } } }, g: 5, h: 'hello', i: { j: [2] } };

    it('should pluck prop from plain object', () => {
      of({ a: { b: { c: true } } })
        .pipe(pluck('a', 'b', 'c'))
        .subscribe(c => {
          expect(c).toBe(true);
        });

      of(obj)
        .pipe(pluck('a'))
        .subscribe(a => {
          expect(a).toEqual(obj.a);
        });

      of(obj)
        .pipe(pluck('i', 'j'))
        .subscribe(j => {
          expect(j).toContain(2);
        });
    });

    it('should pluck prop from object with multi type prop', () => {
      of(obj)
        .pipe(pluck('a', 'b'))
        .subscribe(b => {
          expect(b).toBe(true);
        });

      of(obj)
        .pipe(pluck('a', 'c', 'd'))
        .subscribe(d => {
          expect(d).toBe(false);
        });
    });

    it('should allow maximum 4 props to pluck', () => {
      of(obj)
        .pipe(pluck('a', 'c', 'e', 'f'))
        .subscribe(f => {
          expect(f).toBe(5);
        });
    });

    it('should work with multi pluck', () => {
      of(obj)
        .pipe(pluck('a'), pluck('c'), pluck('d'))
        .subscribe(d => {
          expect(d).toBe(false);
        });
    });
  });
});
