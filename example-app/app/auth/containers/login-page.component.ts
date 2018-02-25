import { Component } from '@angular/core';
import { Select, Dispatch } from '@ngrx-utils/store';
import { Authenticate } from '../models/user';
import * as fromAuth from '../reducers';
import * as Auth from '../actions/auth';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'bc-login-page',
  template: `
  <ng-container *ngLet="pending$ | async as pending">
    <bc-login-form
      (submitted)="onSubmit($event)"
      [pending]="pending"
      [errorMessage]="error$ | async">
    </bc-login-form>
  </ng-container>
  `,
  styles: []
})
export class LoginPageComponent {
  @Select(fromAuth.getLoginPagePending) pending$: Observable<boolean>;
  @Select(fromAuth.getLoginPageError) error$: Observable<string | null>;

  @Dispatch()
  onSubmit($event: Authenticate) {
    return new Auth.Login($event);
  }
}
