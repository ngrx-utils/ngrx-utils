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
