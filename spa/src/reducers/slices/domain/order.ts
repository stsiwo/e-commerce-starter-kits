import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import merge from "lodash/merge";
import remove from 'lodash/remove';
import { OrderType, OrderEventType } from "domain/order/types";

/**
 * redux-sage actions (side effects)
 *
 *  - use this in index.tsx at watchers
 *
 **/

// for GET request
export const fetchOrderActionCreator = createAction("saga/domain/order/fetch")
export const fetchOrderActionTypeName = fetchOrderActionCreator().type

// for GET by Id request
export const fetchSingleOrderActionCreator = createAction<{ orderId: string }>("saga/domain/order/fetchSingle")
export const fetchSingleOrderActionTypeName = fetchSingleOrderActionCreator().type

// for POST (add a new cart item) request
export const postOrderActionCreator = createAction<OrderType>("saga/domain/order/post")
export const postOrderActionTypeName = postOrderActionCreator().type

// for PUT (replace) request
export const putOrderActionCreator = createAction<OrderType>("saga/domain/order/put")
export const putOrderActionTypeName = putOrderActionCreator().type

// for DELETE (delete single cart item) request
export const deleteSingleOrderActionCreator = createAction<OrderType>("saga/domain/order/deleteSingle")
export const deleteSingleOrderActionTypeName = deleteSingleOrderActionCreator().type

// for DELETE (delete all of cart items) request
export const deleteOrderActionCreator = createAction<OrderType>("saga/domain/order/delete")
export const deleteOrderActionTypeName = deleteOrderActionCreator().type

/**
 *
 * domain.orders state Slice (no side effects)
 *
 **/
// action type             
export type OrderActionType = PayloadAction<OrderType[]> 

export const orderSlice = createSlice({ 
  name: "domain/order", // a name used in action type
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

    /**
     * be careful that duplicate might exist.
     *
     * - not unique.
     *
     **/
    concat: (state: OrderType[], action: OrderActionType) => {
      return state.concat(action.payload); 
    },

    // use when update existing one (only apply for array: don't use for object)
    updateOne: (state: OrderType[], action: PayloadAction<OrderType>) => {
      return state.map((domain: OrderType) => {
        if (domain.orderId === action.payload.orderId) {
          return action.payload
        }
        return domain
      })
    },


    // use when you want to replace
    update: (state: OrderType[], action: OrderActionType) => action.payload,

    // use when you want to remove a single entity
    delete: (state: OrderType[], action: PayloadAction<OrderType>) => {
      remove(state, (order: OrderType) => order.orderId == action.payload.orderId)
      return state;
    },

    appendEvent: (state: OrderType[], action: PayloadAction<{ orderId: string, event: OrderEventType }>) => {

      for (let i = 0; i < state.length; i++) {
        if (state[i].orderId == action.payload.orderId) {
          state[i].orderEvents.push(action.payload.event)
        }
      }

      return state
    },

    deleteEvent: (state: OrderType[], action: PayloadAction<{ orderId: string, eventId: string }>) => {

      for (let i = 0; i < state.length; i++) {
        if (state[i].orderId == action.payload.orderId) {
          state[i].orderEvents = state[i].orderEvents.filter((orderEvent: OrderEventType) => orderEvent.orderId != action.payload.eventId) 
        }
      }

      return state
    },

    updateEvent: (state: OrderType[], action: PayloadAction<{ orderId: string, event: OrderEventType }>) => {

      for (let i = 0; i < state.length; i++) {
        if (state[i].orderId == action.payload.orderId) {
          state[i].orderEvents = state[i].orderEvents.map((orderEvent: OrderEventType) => {
            if (orderEvent.orderId == action.payload.event.orderEventId) {
              return action.payload.event 
            }
            return orderEvent
          })
        }
      }

      return state
    },

    clear: (state: OrderType[]) => [],
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const orderSliceReducer = orderSlice.reducer
export const orderActions = orderSlice.actions

/**
 *
 * domain.orders.pagination.page state Slice (no side effects)
 *
 **/
// action type             
export type OrderPaginationPageActionType = PayloadAction<number> 

export const orderPaginationPageSlice = createSlice({ 
  name: "domain/orders/pagination/page", // a name used in action type
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

    // use when you want to replace
    update: (state: string, action: OrderPaginationPageActionType) => action.payload,
    clear: (state: string) => 0, // start from 0, (not 1)
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const orderPaginationPageSliceReducer = orderPaginationPageSlice.reducer
export const orderPaginationPageActions = orderPaginationPageSlice.actions


/**
 *
 * domain.orders.pagination.limit state Slice (no side effects)
 *
 **/
// action type             
export type OrderPaginationLimitActionType = PayloadAction<number> 

export const orderPaginationLimitSlice = createSlice({ 
  name: "domain/orders/pagination/limit", // a name used in action type
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

    // use when you want to replace
    update: (state: string, action: OrderPaginationLimitActionType) => action.payload,
    clear: (state: string) => 20,
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const orderPaginationLimitSliceReducer = orderPaginationLimitSlice.reducer
export const orderPaginationLimitActions = orderPaginationLimitSlice.actions


/**
 *
 * domain.orders.pagination.totalPages state Slice (no side effects)
 *
 **/
// action type             
export type OrderPaginationTotalPagesActionType = PayloadAction<number> 

export const orderPaginationTotalPagesSlice = createSlice({ 
  name: "domain/orders/pagination/totalPages", // a name used in action type
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

    // use when you want to replace
    update: (state: string, action: OrderPaginationTotalPagesActionType) => action.payload,
    clear: (state: string) => 1,
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const orderPaginationTotalPagesSliceReducer = orderPaginationTotalPagesSlice.reducer
export const orderPaginationTotalPagesActions = orderPaginationTotalPagesSlice.actions

/**
 *
 * domain.orders.pagination.totalElements state Slice (no side effects)
 *
 **/
// action type             
export type OrderPaginationTotalElementsActionType = PayloadAction<number> 

export const orderPaginationTotalElementsSlice = createSlice({ 
  name: "domain/orders/pagination/totalElements", // a name used in action type
  initialState: 0,        
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

    // use when you want to replace
    update: (state: number, action: OrderPaginationTotalElementsActionType) => action.payload,
    clear: (state: number) => 0,
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const orderPaginationTotalElementsSliceReducer = orderPaginationTotalElementsSlice.reducer
export const orderPaginationTotalElementsActions = orderPaginationTotalElementsSlice.actions

