import { CommonModule } from '@angular/common';
import { Component, DebugElement, NgModule } from '@angular/core';
import { ComponentFixture, inject, TestBed, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgrxSelectModule, Pluck, ɵNgrxSelect as NgrxSelect } from '@ngrx-utils/store';
import { Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

@Component({
  selector: 'test',
  template: `
    <div>Test {{ (root | async).test }}</div>
  `
})
export class TestComponent {
  @Pluck() root: any;
}

export function reducer(state: any, action: any) {
  switch (action.type) {
    case 'TEST':
      return { test: 'b' };
    default:
      return { test: 'a' };
  }
}

@NgModule({
  imports: [
    StoreModule.forRoot({
      root: reducer
    }),
    NgrxSelectModule,
    CommonModule
  ],
  declarations: [TestComponent],
  exports: [TestComponent]
})
export class TestModule {}

describe('NgrxSelectModule', () => {
  afterEach(() => {
    NgrxSelect.store = null;
  });
  describe('Create', () => {
    const store = new Store(of({}), undefined as any, undefined as any);

    it('should create module', () => {
      const ngrxSelect = new NgrxSelect();
      spyOn(ngrxSelect, 'connect').and.callThrough();
      expect(ngrxSelect).toBeTruthy();

      const ngrxSelectModule = new NgrxSelectModule(ngrxSelect, store);
      expect(ngrxSelectModule).toBeTruthy();
      expect(NgrxSelect.store).toEqual(store);
      expect(ngrxSelect.connect).toHaveBeenCalled();
    });
  });

  describe('Interaction', () => {
    let fixture: ComponentFixture<TestComponent>;
    let instance: TestComponent;
    let debugEl: DebugElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestModule]
      });

      fixture = TestBed.createComponent(TestComponent);
      instance = fixture.componentInstance;
      debugEl = fixture.debugElement;

      fixture.detectChanges();
    });

    it(
      'should create NgrxSelect service',
      inject([NgrxSelect], (ngrxSelect: NgrxSelect) => {
        expect(ngrxSelect).toBeTruthy();
        expect(NgrxSelect.store).toBeTruthy();
      })
    );

    it(
      'should work on Component',
      fakeAsync(() => {
        expect(debugEl.queryAll(By.css('div')).length).toEqual(1);
        expect(debugEl.query(By.css('div')).nativeElement.textContent).toBe('Test a');
      })
    );

    it(
      'should change template binding when action dispatched',
      fakeAsync(
        inject([Store], (store: Store<any>) => {
          const action = { type: 'TEST' };
          store.dispatch(action);

          fixture.detectChanges();

          expect(debugEl.query(By.css('div')).nativeElement.textContent).toBe('Test b');
        })
      )
    );
  });
});
