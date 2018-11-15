import { Dispatch, ɵNgrxSelect as NgrxSelect } from '@ngrx-utils/store';
import { ActionsSubject, Store } from '@ngrx/store';
import { of } from 'rxjs';

describe('Dispatch', () => {
  const store = new Store(of({}), new ActionsSubject(), undefined as any);
  const action1 = { type: 'test-action1' };
  const action2 = { type: 'test-action2' };

  it('should dispatch action', () => {
    spyOn(store, 'dispatch').and.callThrough();
    NgrxSelect.store = store;
    class TestComponent {
      @Dispatch()
      onAction() {
        return action1;
      }
    }

    const testComp = new TestComponent();
    testComp.onAction();
    expect(store.dispatch).toHaveBeenCalledWith(action1);
  });

  it('should throw error when decorator is on accessor property', () => {
    expect(() => {
      class TestComponent {
        @Dispatch()
        get action() {
          return action1;
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

  it('should throw error when NgrxSelect.store === null', () => {
    NgrxSelect.store = null;
    class TestComponent {
      @Dispatch()
      onAction() {
        return action1;
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

  it('should dispatch array of actions', () => {
    spyOn(store, 'dispatch').and.callThrough();
    NgrxSelect.store = store;
    class TestComponent {
      @Dispatch()
      onAction() {
        return [action1, action2];
      }
    }

    const testComp = new TestComponent();
    testComp.onAction();
    expect(store.dispatch).toHaveBeenCalledWith(action1);
    expect(store.dispatch).toHaveBeenCalledWith(action2);
  });
});
