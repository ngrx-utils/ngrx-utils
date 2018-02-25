import { NgrxSelectModule, NgrxUtilsModule } from '@ngrx-utils/store';
import { NgrxSelect } from '@ngrx-utils/store/src/decorators/ngrx-select.module';
import { Store } from '@ngrx/store';
import { of } from 'rxjs/observable/of';

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
      expect(new NgrxUtilsModule(undefined as any)).toBeTruthy();
      expect(() => new NgrxSelectModule(ngrxSelect, store, {})).toThrowError();
      expect(() => new NgrxUtilsModule({})).toThrowError();
    });
  });
});
