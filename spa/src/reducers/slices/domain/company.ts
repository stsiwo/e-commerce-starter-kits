import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AdminCompanyType } from "domain/user/types";

/**
 * redux-sage actions (side effects)
 *
 *  - use this in index.tsx at watchers
 *
 **/

// for GET request with cache
export declare type FetchCompanyActionType = { type: string } // 'replace'/'concat' 
export const fetchCompanyActionCreator = createAction<FetchCompanyActionType>("saga/domain/company/fetch")
export const fetchCompanyActionTypeName = fetchCompanyActionCreator().type

/**
 *
 * domain.companys.data state Slice (no side effects)
 *
 **/
// action type             
export type CompanyActionType = PayloadAction<AdminCompanyType> 

export const companySlice = createSlice({ 
  name: "domain/company/data", // a name used in action type
  initialState: null,        
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

    // replace
    update: (state: AdminCompanyType, action: CompanyActionType) => action.payload,

    // update a single domain
    clear: (state: AdminCompanyType) => null,
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const companySliceReducer = companySlice.reducer
export const companyActions = companySlice.actions


