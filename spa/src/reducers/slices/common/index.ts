import { createAction } from "@reduxjs/toolkit";

/**
 * common actions.
 *
 * - it is shared by mutliple case reducer.
 * - to used to change mutiple state at once.
 * - implement with 'extraReducers' at each case reducer setting.
 **/


// for GET request
export const resetCheckoutStateActionCreator = createAction("common/checkout/reset")
export const resetCheckoutStateActionTypeName = resetCheckoutStateActionCreator().type

