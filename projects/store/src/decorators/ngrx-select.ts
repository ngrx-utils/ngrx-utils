import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class NgrxSelect {
  static store: Store<any> | null = null;

  connect(store: Store<any>) {
    NgrxSelect.store = store;
  }

  constructor(store: Store<any>) {
    this.connect(store);
  }
}
