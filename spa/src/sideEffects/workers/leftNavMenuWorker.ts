import { PayloadAction } from "@reduxjs/toolkit";
import { leftNavMenuActions } from "reducers/slices/ui";
import { put } from "redux-saga/effects";

/**
 * a worker (generator)    
 *  
 **/
export function* leftNavMenuWorkerWorker(action: PayloadAction<{}>) {

  yield put(
    leftNavMenuActions.toggle()
  )
}
