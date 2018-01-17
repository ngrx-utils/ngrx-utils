import { Action } from '@ngrx/store';

export class GetTruckItems implements Action {
  readonly type = '[Truck] Get Truck Items';
  constructor(public payload: { from: number; to: number }) {}
}

export class GetTruckItemsSuccess implements Action {
  readonly type = '[Truck] Get Truck Items Success';
  constructor(public payload: any[]) {}
}

export class GetTruckItemsFail implements Action {
  readonly type = '[Truck] Get Truck Items Fail';
  constructor(public payload: string) {}
}

export class RefreshTruckItems implements Action {
  readonly type = '[Truck] Refresh Truck Items';
  constructor(public payload: { from: number; to: number }) {}
}

export class GetTruckData implements Action {
  readonly type = '[Truck] Get Truck Data';
  constructor(public payload: { from: number; to: number }) {}
}

export class GetTruckDataSuccess implements Action {
  readonly type = '[Truck] Get Truck Data Success';
  constructor(public payload: any[]) {}
}

export class GetTruckDataFail implements Action {
  readonly type = '[Truck] Get Truck Data Fail';
  constructor(public payload: string) {}
}

export class RefreshTruckData implements Action {
  readonly type = '[Truck] Refresh Truck Data';
  constructor(public payload: { from: number; to: number }) {}
}
