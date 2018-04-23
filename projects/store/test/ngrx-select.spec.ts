import { TestBed, inject } from '@angular/core/testing';
import { NgrxSelectModule, ɵNgrxSelect as NgrxSelect } from '@ngrx-utils/store';
import { Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

describe('NgrxSelectModule', () => {
  const store = new Store(of({}), undefined as any, undefined as any);

  afterEach(() => {
    NgrxSelect.store = null;
  });

  describe('Create', () => {
    it('should create module', () => {
      const ngrxSelect = new NgrxSelect();
      spyOn(ngrxSelect, 'connect').and.callThrough();
      expect(ngrxSelect).toBeTruthy();

      const module = new NgrxSelectModule(ngrxSelect, store);
      expect(module).toBeTruthy();
      expect(NgrxSelect.store).toEqual(store);
      expect(ngrxSelect.connect).toHaveBeenCalled();
    });
  });

  describe('Interaction', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [NgrxSelectModule, StoreModule.forRoot({})]
      });
    });

    it(
      'should create NgrxSelect service',
      inject([NgrxSelect], (ngrxSelect: NgrxSelect) => {
        expect(ngrxSelect).toBeTruthy();
        expect(NgrxSelect.store).toBeTruthy();
      })
    );
  });
});
