import { Component, NgModule, OnDestroy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  NgLetModule,
  untilDestroy,
  ɵdestroy$ as destroy$,
  addDestroyObservableToComponent
} from '@ngrx-utils/ng';
import { Subject, Subscription } from 'rxjs';

@Component({
  template: '',
  selector: 'sand-test'
})
class TestComponent implements OnDestroy {
  test$ = new Subject<number>();
  test = 10;
  sub: Subscription;

  constructor() {
    this.sub = this.test$
      .pipe(untilDestroy(this))
      .subscribe(a => (this.test = a));
  }

  ngOnDestroy() {}
}

@Component({
  template: '',
  selector: 'sand-test2'
})
class Test2Component {
  test$ = new Subject<number>();
  constructor() {
    this.test$.pipe(untilDestroy(this)).subscribe();
  }
}

const TEST_COMPONENTS = [TestComponent, Test2Component];

@NgModule({
  declarations: TEST_COMPONENTS,
  exports: TEST_COMPONENTS,
  imports: [NgLetModule]
})
class TestModule {}

describe('untilDestroy', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule]
    });
  });

  it('should unsubscribe when component is destroyed', () => {
    const fixture = TestBed.createComponent(TestComponent);
    const instance = fixture.componentInstance;
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
    class ErrComponent {}
    const errComp = new ErrComponent();
    expect(() => untilDestroy(errComp)).toThrowError(
      'untilDestroy operator needs the component to have an ngOnDestroy method'
    );
  });

  it('should ensure symbol $destroy on component', () => {
    const testComp = new TestComponent();
    const symbols = Object.getOwnPropertySymbols(testComp);
    expect(symbols).toContain(destroy$);
  });
});
