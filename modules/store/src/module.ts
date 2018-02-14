import { NgModule, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { NgLetDirective } from './ngLet';
import { WebWorkerService } from './web-worker.service';

@Injectable()
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

@NgModule({
  providers: [WebWorkerService, NgrxSelect]
})
export class NgrxUtilsModule {
  /**
   * @internal
   */
  constructor(ngrxSelect: NgrxSelect, store: Store<any>) {
    ngrxSelect.connect(store);
  }
}

@NgModule({
  declarations: [NgLetDirective],
  exports: [NgLetDirective]
})
export class NgUtilsModule {}
