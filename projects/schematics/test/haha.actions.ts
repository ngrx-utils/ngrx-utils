import { Action } from '@ngrx/store';

export enum FeatureActionTypes {
  HomePageDoMyAction = '[Feature.HomePage] Do My Action',
  HomePageDoMyAction2 = '[Feature.HomePage] Do My Action 2',
  DoMyAction3 = '[Feature] Do My Action 3',
  DoMyAction4 = '[Feature] Do My Action 4'
}

export enum OtherFeatureActionTypes {
  DoMyAction4 = '[Other Feature] Do My Action 4',
  DoMyAction5 = '[Other Feature] Do My Action 5',
  DoMyAction6 = '[Other Feature] Do My Action 6'
}

export enum Other2FeatureActionTypes {
  DoMyAction7 = '[Other 2 Feature] Do My Action 7',
  DoMyAction8 = '[Other 2 Feature] Do My Action 8'
}
export class HomePageDoMyAction implements Action {
  readonly type = FeatureActionTypes.HomePageDoMyAction;
}

export class HomePageDoMyAction2 implements Action {
  readonly type = FeatureActionTypes.HomePageDoMyAction2;
}

export class DoMyAction3 implements Action {
  readonly type = FeatureActionTypes.DoMyAction3;
}

export type FeatureActions = HomePageDoMyAction | HomePageDoMyAction2 | DoMyAction3;

export class DoMyAction4 implements Action {
  readonly type = OtherFeatureActionTypes.DoMyAction4;
}

export class DoMyAction5 implements Action {
  readonly type = OtherFeatureActionTypes.DoMyAction5;
}

export class DoMyAction6 implements Action {
  readonly type = OtherFeatureActionTypes.DoMyAction6;
}

export type OtherFeatureActions = DoMyAction4 | DoMyAction5 | DoMyAction6;

export class DoMyAction7 implements Action {
  readonly type = Other2FeatureActionTypes.DoMyAction7;
}

export class DoMyAction8 implements Action {
  readonly type = Other2FeatureActionTypes.DoMyAction8;
}

export type Other2FeatureActions = DoMyAction7 | DoMyAction8;
