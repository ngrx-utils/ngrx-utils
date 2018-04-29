import { CommonModule } from '@angular/common';
import { Component, DebugElement, NgModule } from '@angular/core';
import { ComponentFixture, inject, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgrxSelectModule, Pluck, ɵNgrxSelect as NgrxSelect } from '@ngrx-utils/store';
import { Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

@Component({
  selector: 'test',
  template: `
    <div>Test {{ (root | async)?.test }}</div>
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
  describe('Unit', () => {
    const store = new Store<any>(of({}), undefined as any, undefined as any);

    it('should create module', () => {
      const ngrxSelect = new NgrxSelect();
      spyOn(ngrxSelect, 'connect').and.callThrough();
      expect(ngrxSelect).toBeTruthy();

      NgrxSelect.store = null as any;
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

    it('should work fine when using in Component', async(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(debugEl.queryAll(By.css('div')).length).toEqual(1);
        expect(debugEl.query(By.css('div')).nativeElement.textContent).toBe('Test a');
      });
    }));

    it('should change template binding when action dispatched', async(
      inject([Store], async (store: Store<any>) => {
        let action = { type: 'TEST' };
        store.dispatch(action);

        await fixture.whenStable();
        fixture.detectChanges();
        expect(debugEl.query(By.css('div')).nativeElement.textContent).toBe('Test b');

        action = { type: 'TEST 2' };
        store.dispatch(action);

        await fixture.whenStable();
        fixture.detectChanges();
        expect(debugEl.query(By.css('div')).nativeElement.textContent).toBe('Test a');
      })
    ));
  });
});
