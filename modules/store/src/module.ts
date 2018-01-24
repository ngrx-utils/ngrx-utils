import { NgModule, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

@Injectable()
export class NgrxSelect {
  /**
   * @internal
   */
  static store: Store<any> | undefined = undefined;

  connect(store: Store<any>) {
    NgrxSelect.store = store;
  }
}

@NgModule({
  providers: [NgrxSelect]
})
export class NgrxUtilsModule {}
