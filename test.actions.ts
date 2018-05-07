import { Action } from '@ngrx/store';

export default class implements Action {
  readonly type = '[Feature.HomePage] Do My Action';
  constructor(public payload: any) {}
}

export class MyAction2 implements Action {
  readonly type = '[Feature.HomePage] Do My Action 2';
  constructor(public payload: any) {}
}
