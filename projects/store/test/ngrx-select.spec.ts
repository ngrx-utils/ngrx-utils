import { ɵNgrxSelect as NgrxSelect } from '@ngrx-utils/store';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

describe('NgrxSelect', () => {
  const store = new Store(of({}), undefined as any, undefined as any);

  afterEach(() => {
    NgrxSelect.store = null;
  });

  describe('modules', () => {
    it('should create module', () => {
      const ngrxSelect = new NgrxSelect(store);
      expect(ngrxSelect).toBeTruthy();
      expect(NgrxSelect.store).toEqual(store);
    });
  });
});
