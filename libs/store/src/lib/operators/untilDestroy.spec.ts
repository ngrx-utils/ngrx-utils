import { Component, NgModule, OnDestroy, NgZone } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  NgLetModule,
  untilDestroy,
  ɵdestroy$ as destroy$,
} from '@ngrx-utils/store';
import { Subject, Subscription } from 'rxjs';

@Component({
  template: '',
  selector: 'sand-test',
})
class TestComponent implements OnDestroy {
  test$ = new Subject<number>();
  test = 10;
  sub: Subscription;

  constructor() {
    this.sub = this.test$
      .pipe(untilDestroy(this))
      .subscribe((a) => (this.test = a));
  }

  ngOnDestroy() {}
}

@Component({
  template: '',
  selector: 'error-comp',
})
class ErrorComponent {
  test$ = new Subject<number>();
  test = 10;
  sub: Subscription;

  constructor() {
    this.sub = this.test$
      .pipe(untilDestroy(this))
      .subscribe((a) => (this.test = a));
  }
}

@NgModule({
  declarations: [TestComponent, ErrorComponent],
  imports: [NgLetModule],
})
class TestModule {}

describe('untilDestroy', () => {
  let fixture: ComponentFixture<TestComponent>;
  let instance: TestComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, ErrorComponent],
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

  it('should throw error when component does not implement OnDestroy', async () => {
    expect(() => TestBed.createComponent(ErrorComponent)).toThrowError(
      'untilDestroy operator needs the component to have an ngOnDestroy method'
    );
  });

  it('should ensure symbol $destroy on component', () => {
    class Test2Component implements OnDestroy {
      test$ = new Subject<number>();
      constructor() {
        this.test$.pipe(untilDestroy(this)).subscribe();
      }
      ngOnDestroy() {}
    }

    const testComp = new Test2Component();
    const symbols = Object.getOwnPropertySymbols(testComp);
    expect(symbols).toContain(destroy$);
  });
});
