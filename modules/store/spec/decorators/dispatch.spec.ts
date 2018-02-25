import { Dispatch } from '@ngrx-utils/store';
import { NgrxSelect } from '@ngrx-utils/store/src/decorators/ngrx-select.module';
import { Store, ActionsSubject } from '@ngrx/store';
import { of } from 'rxjs/observable/of';

describe('Dispatch', () => {
  const store = new Store(of({}), new ActionsSubject(), undefined as any);
  const action = { type: 'test-action' };

  it('should dispatch action', () => {
    spyOn(store, 'dispatch').and.callThrough();
    NgrxSelect.store = store;
    class TestComponent {
      @Dispatch()
      onAction() {
        return action;
      }
    }

    const testComp = new TestComponent();
    testComp.onAction();
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should throw error when decorator is on accessor property', () => {
    expect(() => {
      class TestComponent {
        @Dispatch()
        get action() {
          return action;
        }
      }
    }).toThrowError();

    expect(() => {
      class TestComponent {
        private _test: any;
        @Dispatch()
        set test(value: any) {
          if (!this._test) {
            this._test = value;
          }
        }
      }
    }).toThrowError();
  });

  it('should throw error when NgrxSelectModule is not imported', () => {
    NgrxSelect.store = undefined;
    class TestComponent {
      @Dispatch()
      onAction() {
        return action;
      }
    }

    const testComp = new TestComponent();
    expect(() => testComp.onAction()).toThrowError();
  });

  it('should throw error when method return result is not an Action', () => {
    NgrxSelect.store = store;
    class TestComponent {
      @Dispatch()
      onAction() {
        return true;
      }
    }

    const testComp = new TestComponent();
    expect(() => testComp.onAction()).toThrowError();
  });
});
