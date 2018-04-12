import { NgModule, Injectable, SkipSelf, Optional } from '@angular/core';
import { Store } from '@ngrx/store';

@Injectable()
export class NgrxSelect {
  static store: Store<any> | undefined = undefined;

  connect(store: Store<any>) {
    NgrxSelect.store = store;
  }
}

@NgModule({
  providers: [NgrxSelect]
})
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
