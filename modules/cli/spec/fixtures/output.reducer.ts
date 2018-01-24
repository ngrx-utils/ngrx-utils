import {
  GetTruckItems,
  GetTruckItemsSuccess,
  GetTruckItemsFail,
  RefreshTruckItems,
  GetTruckData,
  GetTruckDataSuccess,
  GetTruckDataFail,
  RefreshTruckData
} from './sample.action';

export type TruckActions =
  | GetTruckItems
  | GetTruckItemsSuccess
  | GetTruckItemsFail
  | RefreshTruckItems
  | GetTruckData
  | GetTruckDataSuccess
  | GetTruckDataFail
  | RefreshTruckData;

export function truckReducer(state: any, action: TruckActions): any {
  switch (action.type) {
    case '[Truck] Get Truck Items':
      return {
        ...state
      };
    case '[Truck] Get Truck Items Success':
      return {
        ...state
      };
    case '[Truck] Get Truck Items Fail':
      return {
        ...state
      };
    case '[Truck] Refresh Truck Items':
      return {
        ...state
      };
    case '[Truck] Get Truck Data':
      return {
        ...state
      };
    case '[Truck] Get Truck Data Success':
      return {
        ...state
      };
    case '[Truck] Get Truck Data Fail':
      return {
        ...state
      };
    case '[Truck] Refresh Truck Data':
      return {
        ...state
      };
    default:
      return state;
  }
}
