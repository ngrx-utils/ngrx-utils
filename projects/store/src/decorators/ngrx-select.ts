import { Injectable, NgModule } from '@angular/core';
import { Store } from '@ngrx/store';

@Injectable()
export class NgrxSelect {
  static store: Store<any> | null = null;

  connect(store: Store<any>) {
    NgrxSelect.store = store;
  }
}

@NgModule({ providers: [NgrxSelect] })
export class NgrxSelectModule {
  constructor(ngrxSelect: NgrxSelect, store: Store<any>) {
    ngrxSelect.connect(store);
  }
}
