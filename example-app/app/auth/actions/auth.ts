import { Action } from '@ngrx/store';
import { User, Authenticate } from '../models/user';

export class Login implements Action {
  readonly type = '[Auth] Login';

  constructor(public payload: Authenticate) {}
}

export class LoginSuccess implements Action {
  readonly type = '[Auth] Login Success';

  constructor(public payload: { user: User }) {}
}

export class LoginFailure implements Action {
  readonly type = '[Auth] Login Failure';

  constructor(public payload: any) {}
}

export class LoginRedirect implements Action {
  readonly type = '[Auth] Login Redirect';
}

export class Logout implements Action {
  readonly type = '[Auth] Logout';
}

export type AuthActions = Login | LoginSuccess | LoginFailure | LoginRedirect | Logout;
