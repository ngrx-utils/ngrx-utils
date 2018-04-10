import { NgModule, Injectable, SkipSelf, Optional } from '@angular/core';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class NgrxSelect {
  /**
   * @internal
   */
  static store: Store<any> | undefined = undefined;

  /**
   * @internal
   */
  connect(store: Store<any>) {
    NgrxSelect.store = store;
  }
}

@NgModule()
export class NgrxSelectModule {
  constructor(
    ngrxSelect: NgrxSelect,
    store: Store<any>,
    @SkipSelf()
    @Optional()
    module: NgrxSelectModule
  ) {
    if (module) {
      throw new Error('Only import NgrxSelectModule to top level module like AppModule');
    }
    ngrxSelect.connect(store);
  }
}
