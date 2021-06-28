import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { FetchStatusEnum } from "src/app";

/**
 * app.fetchStatus.company.get state Slice
 **/
export type getCompanyFetchStatusActionType = PayloadAction<FetchStatusEnum>

export const getCompanyFetchStatusSlice = createSlice({
  name: "app/fetchStatus/company/get", // a name used in action type
  initialState: {},
  reducers: {
    /**
     *
     *  a property name gonna be the name of action
     *  its value is the reduce
     *
     *  If you need to define the param of the action, use PayloadAction<X> to define its type.
     *  In this use case, I need to an string param, so I define 'payloadAction<string' like below
     *
     **/
    update: (state: FetchStatusEnum, action: getCompanyFetchStatusActionType) => action.payload,
    clear: (state: FetchStatusEnum) => FetchStatusEnum.INITIAL
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated.
   **/
})

export const getCompanyFetchStatusSliceReducer = getCompanyFetchStatusSlice.reducer
export const getCompanyFetchStatusActions = getCompanyFetchStatusSlice.actions
