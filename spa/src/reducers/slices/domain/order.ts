import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import merge from "lodash/merge";
import remove from 'lodash/remove';
import { OrderType, OrderEventType, OrderSortEnum, OrderEventCriteria, OrderCriteria, SessionTimeoutOrderEventCriteria } from "domain/order/types";

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

// for POST (add order with clientSecret) request
export declare type PostOrderActionType = OrderCriteria  
export const postOrderActionCreator = createAction<PostOrderActionType>("saga/domain/order/post")
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

// for POST (add a new order event) request
export declare type PostOrderEventActionType = OrderEventCriteria  & { orderId: string }
export const postOrderEventActionCreator = createAction<PostOrderEventActionType>("saga/domain/order/event/post")
export const postOrderEventActionTypeName = postOrderEventActionCreator().type

// for PUT (replace a order event) request
export declare type PutOrderEventActionType = OrderEventCriteria & { orderId: string } 
export const putOrderEventActionCreator = createAction<PutOrderEventActionType>("saga/domain/order/event/put")
export const putOrderEventActionTypeName = putOrderEventActionCreator().type

// for DELETE (delete single order event) request
export declare type DeleteSingleOrderEventActionType = { orderEventId: string, orderId: string } 
export const deleteSingleOrderEventActionCreator = createAction<DeleteSingleOrderEventActionType>("saga/domain/order/event/deleteSingle")
export const deleteSingleOrderEventActionTypeName = deleteSingleOrderEventActionCreator().type

// for POST (add a new session timeout order event) request
export declare type PostSessionTimeoutOrderEventActionType = SessionTimeoutOrderEventCriteria & { orderId: string } 
export const postSessionTimeoutOrderEventActionCreator = createAction<PostSessionTimeoutOrderEventActionType>("saga/domain/order/event/session-timeout/post")
export const postSessionTimeoutOrderEventActionTypeName = postSessionTimeoutOrderEventActionCreator().type
/**
 *
 * domain.orders state Slice (no side effects)
 *
 **/
// action type             
export type OrderActionType = PayloadAction<OrderType[]> 

export const orderSlice = createSlice({ 
  name: "domain/order", // a name used in action type
  initialState: [],        
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

    /**
     * replace the whole order. this is because deleting an order event affects the other properties of the order.
     **/
    replace: (state: OrderType[], action: PayloadAction<{ orderId: string, order: OrderType }>) => {
      for (let i = 0; i < state.length; i++) {
        if (state[i].orderId == action.payload.orderId) {
          state[i] = action.payload.order;
        }
      }
      return state
    },

    deleteEvent: (state: OrderType[], action: PayloadAction<{ orderId: string, eventId: string }>) => {
      for (let i = 0; i < state.length; i++) {
        if (state[i].orderId == action.payload.orderId) {
          state[i].orderEvents = state[i].orderEvents.filter((orderEvent: OrderEventType) => orderEvent.orderEventId != action.payload.eventId) 
        }
      }
      return state
    },

    updateEvent: (state: OrderType[], action: PayloadAction<{ orderId: string, event: OrderEventType }>) => {
      for (let i = 0; i < state.length; i++) {
        if (state[i].orderId == action.payload.orderId) {
          state[i].orderEvents = state[i].orderEvents.map((orderEvent: OrderEventType) => {
            if (orderEvent.orderEventId == action.payload.event.orderEventId) {
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
    update: (state: number, action: OrderPaginationPageActionType) => action.payload,
    clear: (state: number) => 0, // start from 0, (not 1)
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
  initialState: 20,        
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
    update: (state: number, action: OrderPaginationLimitActionType) => action.payload,
    clear: (state: number) => 20,
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
  initialState: 1,        
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
    update: (state: number, action: OrderPaginationTotalPagesActionType) => action.payload,
    clear: (state: number) => 1,
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



/**
 *
 * domain.orders.query.searchQuery state Slice (no side effects)
 *
 **/
// action type             
export type OrderQuerySearchQueryActionType = PayloadAction<string> 

export const orderQuerySearchQuerySlice = createSlice({ 
  name: "domain/orders/query/searchQuery", // a name used in action type
  initialState: "",        
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
    update: (state: string, action: OrderQuerySearchQueryActionType) => action.payload,
    clear: (state: string) => "",
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const orderQuerySearchQuerySliceReducer = orderQuerySearchQuerySlice.reducer
export const orderQuerySearchQueryActions = orderQuerySearchQuerySlice.actions


/**
 *
 * domain.orders.query.orderStatus state Slice (no side effects)
 *
 **/
// action type             
export type OrderQueryOrderStatusActionType = PayloadAction<string> 

export const orderQueryOrderStatusSlice = createSlice({ 
  name: "domain/orders/query/orderStatus", // a name used in action type
  initialState: "",        
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
    update: (state: string, action: OrderQueryOrderStatusActionType) => action.payload,
    clear: (state: string) => "",
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const orderQueryOrderStatusSliceReducer = orderQueryOrderStatusSlice.reducer
export const orderQueryOrderStatusActions = orderQueryOrderStatusSlice.actions


/**
 *
 * domain.orders.query.startDate state Slice (no side effects)
 *
 **/
// action type             
export type OrderQueryStartDateActionType = PayloadAction<Date> 

export const orderQueryStartDateSlice = createSlice({ 
  name: "domain/orders/query/startDate", // a name used in action type
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

    // use when you want to replace
    update: (state: string, action: OrderQueryStartDateActionType) => action.payload,
    clear: (state: string) => null,
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const orderQueryStartDateSliceReducer = orderQueryStartDateSlice.reducer
export const orderQueryStartDateActions = orderQueryStartDateSlice.actions


/**
 *
 * domain.orders.query.endDate state Slice (no side effects)
 *
 **/
// action type             
export type OrderQueryEndDateActionType = PayloadAction<Date> 

export const orderQueryEndDateSlice = createSlice({ 
  name: "domain/orders/query/endDate", // a name used in action type
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

    // use when you want to replace
    update: (state: string, action: OrderQueryEndDateActionType) => action.payload,
    clear: (state: string) => null,
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const orderQueryEndDateSliceReducer = orderQueryEndDateSlice.reducer
export const orderQueryEndDateActions = orderQueryEndDateSlice.actions


/**
 *
 * domain.orders.query.sort state Slice (no side effects)
 *
 **/
// action type             
export type OrderQuerySortActionType = PayloadAction<OrderSortEnum> 

export const orderQuerySortSlice = createSlice({ 
  name: "domain/orders/query/sort", // a name used in action type
  initialState: OrderSortEnum.DATE_DESC,        
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
    update: (state: OrderSortEnum, action: OrderQuerySortActionType) => action.payload,
    clear: (state: OrderSortEnum) => OrderSortEnum.DATE_DESC,
  },
  /**
   * extraReducers property
   *
   * You can respond to other action types besides the types it has generated. 
   *
   **/
}) 

export const orderQuerySortSliceReducer = orderQuerySortSlice.reducer
export const orderQuerySortActions = orderQuerySortSlice.actions


