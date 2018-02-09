import { Component, OnDestroy } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { createFeatureSelector, createSelector, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { NgrxSelect, Pluck, Select, untilDestroy, pluck } from '../src';

@Component({
  template: `<div></div>`,
  selector: 'sand-test'
})
export class TestComponent implements OnDestroy {
  test$ = new Subject<number>();
  test: number;
  sub: Subscription;

  constructor() {
    this.sub = this.test$.pipe(untilDestroy(this)).subscribe(a => (this.test = a));
  }

  ngOnDestroy() {}
}

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

  const store = new Store(of(globalState), undefined, undefined);

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

  describe('untilDestroy', () => {
    let fixture: ComponentFixture<TestComponent>;
    let instance: TestComponent;

    beforeEach(
      async(() => {
        TestBed.configureTestingModule({
          declarations: [TestComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(TestComponent);
        instance = fixture.componentInstance;
        fixture.detectChanges();
      })
    );

    it('should unsubscribe when component destroyed', () => {
      instance.test$.next(2);
      fixture.detectChanges();

      expect(instance.test).toBe(2);

      instance.ngOnDestroy();
      fixture.detectChanges();
      instance.test$.next(3);

      expect(instance.test).toBe(2);
      expect(instance.sub.closed).toBe(true);
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
