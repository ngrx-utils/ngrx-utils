import { Action } from '@ngrx/store';

export class MyAction implements Action {
  readonly type = '[Feature.HomePage] Do My Action';
  constructor(public payload: any) {}
}

export class MyAction2 implements Action {
  readonly type = '[Feature.HomePage] Do My Action 2';
  constructor(public payload: any) {}
}
export class MyAction3 implements Action {
  readonly type = '[Feature] Do My Action 3';
  constructor(public payload: any) {}
}
