import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Select } from '@ngrx-utils/store';
import { Authenticate } from '../models/user';
import * as fromAuth from '../reducers';
import * as Auth from '../actions/auth';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'bc-login-page',
  template: `
    <bc-login-form
      (submitted)="onSubmit($event)"
      [pending]="pending$ | async"
      [errorMessage]="error$ | async">
    </bc-login-form>
  `,
  styles: []
})
export class LoginPageComponent implements OnInit {
  @Select(fromAuth.getLoginPagePending) pending$: Observable<boolean>;
  @Select(fromAuth.getLoginPageError) error$: Observable<string | null>;

  constructor(private store: Store<fromAuth.State>) {}

  ngOnInit() {}

  onSubmit($event: Authenticate) {
    this.store.dispatch(new Auth.Login($event));
  }
}
