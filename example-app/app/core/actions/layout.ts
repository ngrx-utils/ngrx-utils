import { Action } from '@ngrx/store';

export class OpenSidenav implements Action {
  readonly type = '[Layout] Open Sidenav';
}

export class CloseSidenav implements Action {
  readonly type = '[Layout] Close Sidenav';
}

export type LayoutActions = OpenSidenav | CloseSidenav;
