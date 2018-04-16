import { NgrxSelectModule, ɵNgrxSelect as NgrxSelect } from '@ngrx-utils/store';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

describe('NgrxSelectModule', () => {
  const store = new Store(of({}), undefined as any, undefined as any);

  afterEach(() => {
    NgrxSelect.store = undefined;
  });

  describe('modules', () => {
    it('should create module', () => {
      const ngrxSelect = new NgrxSelect();
      spyOn(ngrxSelect, 'connect').and.callThrough();
      expect(ngrxSelect).toBeTruthy();
      const module = new NgrxSelectModule(ngrxSelect, store, undefined as any);
      expect(module).toBeTruthy();
      expect(ngrxSelect.connect).toHaveBeenCalled();
      expect(NgrxSelect.store).toEqual(store);
      expect(() => new NgrxSelectModule(ngrxSelect, store, {})).toThrowError();
    });
  });
});
