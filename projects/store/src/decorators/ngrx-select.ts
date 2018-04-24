import { Injectable, NgModule } from '@angular/core';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class NgrxSelect {
  static store: Store<any> | null = null;

  connect(store: Store<any>) {
    NgrxSelect.store = store;
  }
}

@NgModule()
export class NgrxSelectModule {
  constructor(ngrxSelect: NgrxSelect, store: Store<any>) {
    if (NgrxSelect.store === null) {
      ngrxSelect.connect(store);
    }
  }
}
