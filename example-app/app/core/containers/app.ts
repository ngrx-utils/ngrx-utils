import { Observable } from 'rxjs/Observable';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Select, Pluck, Dispatch } from '@ngrx-utils/store';

import * as fromAuth from '../../auth/reducers';
import * as layout from '../actions/layout';
import * as Auth from '../../auth/actions/auth';

@Component({
  selector: 'bc-app',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-layout>
      <bc-sidenav [open]="showSidenav$ | async">
        <bc-nav-item (navigate)="closeSidenav()" *ngIf="loggedIn$ | async" routerLink="/" icon="book" hint="View your book collection">
          My Collection
        </bc-nav-item>
        <bc-nav-item (navigate)="closeSidenav()" *ngIf="loggedIn$ | async" routerLink="/books/find" icon="search" hint="Find your next book!">
          Browse Books
        </bc-nav-item>
        <bc-nav-item (navigate)="closeSidenav()" *ngIf="!(loggedIn$ | async)">
          Sign In
        </bc-nav-item>
        <bc-nav-item (navigate)="logout()" *ngIf="loggedIn$ | async">
          Sign Out
        </bc-nav-item>
      </bc-sidenav>
      <bc-toolbar (openMenu)="openSidenav()">
        Book Collection
      </bc-toolbar>

      <router-outlet></router-outlet>
    </bc-layout>
  `
})
export class AppComponent {
  /**
   * Selectors can be applied with the `select` operator which passes the state
   * tree to the provided selector
   *
   * this.showSidenav$ = this.store.pipe(select(fromRoot.getShowSidenav));
   * this.loggedIn$ = this.store.pipe(select(fromAuth.getLoggedIn));
   */
  @Pluck('layout.showSidenav') showSidenav$: Observable<boolean>;
  @Select(fromAuth.getLoggedIn) loggedIn$: Observable<boolean>;

  /**
   * All state updates are handled through dispatched actions in 'container'
   * components. This provides a clear, reproducible history of state
   * updates and user interaction through the life of our
   * application.
   */
  @Dispatch()
  closeSidenav() {
    return new layout.CloseSidenav();
  }

  @Dispatch()
  openSidenav() {
    return new layout.OpenSidenav();
  }

  @Dispatch()
  logout() {
    this.closeSidenav();

    return new Auth.Logout();
  }
}
