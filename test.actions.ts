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

export class MyAction4 implements Action {
  readonly type = '[Other Feature] Do My Action 4';
}

export class MyAction5 implements Action {
  readonly type = '[Other Feature] Do My Action 5';
}

export class MyAction6 implements Action {
  readonly type = '[Other Feature] Do My Action 6';
}

export class MyAction7 implements Action {
  readonly type = '[Other 2 Feature] Do My Action 7';
}

export class MyAction8 implements Action {
  readonly type = '[Other 2 Feature] Do My Action 8';
}

export enum FeatureActionType {
  HomePageDoMyAction = '[Feature.HomePage] Do My Action',
  HomePageDoMyAction2 = '[Feature.HomePage] Do My Action 2',
  DoMyAction3 = '[Feature] Do My Action 3'
}

export type FeatureActionUnion = MyAction | MyAction2 | MyAction3;

export enum OtherFeatureActionType {
  DoMyAction4 = '[Other Feature] Do My Action 4',
  DoMyAction5 = '[Other Feature] Do My Action 5',
  DoMyAction6 = '[Other Feature] Do My Action 6'
}

export type OtherFeatureActionUnion = MyAction4 | MyAction5 | MyAction6;

export enum Other2FeatureActionType {
  DoMyAction7 = '[Other 2 Feature] Do My Action 7',
  DoMyAction8 = '[Other 2 Feature] Do My Action 8'
}

export type Other2FeatureActionUnion = MyAction7 | MyAction8;
