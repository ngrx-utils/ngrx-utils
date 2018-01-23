import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect } from '@ngrx/effects';
import { ofAction } from '@ngrx-utils/effects';
import { of } from 'rxjs/observable/of';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';

import { Login, LoginFailure, LoginSuccess, LoginRedirect, Logout } from '../actions/auth';
import { Authenticate } from '../models/user';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthEffects {
  @Effect()
  login$ = this.actions$.pipe(
    ofAction(Login),
    map(action => action.payload),
    exhaustMap((auth: Authenticate) =>
      this.authService
        .login(auth)
        .pipe(map(user => new LoginSuccess({ user })), catchError(error => of(new LoginFailure(error))))
    )
  );

  @Effect({ dispatch: false })
  loginSuccess$ = this.actions$.pipe(ofAction(LoginSuccess), tap(() => this.router.navigate(['/'])));

  @Effect({ dispatch: false })
  loginRedirect$ = this.actions$.pipe(
    ofAction(LoginRedirect, Logout),
    tap(() => {
      this.router.navigate(['/login']);
    })
  );

  constructor(private actions$: Actions, private authService: AuthService, private router: Router) {}
}
