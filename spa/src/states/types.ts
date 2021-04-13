import { NormalizedCategoryType } from "domain/product/types";
import { AuthType, RequestTrackerType, FetchStatusEnum } from "src/app/";
import { CartItemType } from "domain/cart/types";

//import { NormalizedBlogType } from "domain/blog";
//import { NormalizedCategoryType } from "domain/category";
//import { NormalizedTagType } from "domain/tag";

export declare type UiStateType = {
  leftNavMenu?: boolean
  rightNavMenu?: boolean
  searchModal?: boolean
}

export declare type AppStateType = {
  auth: AuthType 
  searchKeyword: string
  requestTracker: RequestTrackerType
  categoryFetchStatus: FetchStatusEnum
  fetchStatus: {
    cartItems: {
      get: FetchStatusEnum
      post: FetchStatusEnum
      put: FetchStatusEnum
      deleteSingle: FetchStatusEnum
      delete: FetchStatusEnum
    }
  }
}

export declare type DomainPaginationType = {
  limit: number
  offset: number
  total: number
}

export declare type DomainStateSubType<D extends Record<string, any>> = {
  data: D
  pagination: DomainPaginationType
  curItems: string[]
}

export declare type DomainStateType = {
  categories: NormalizedCategoryType 
  cartItems: CartItemType[] // don't need to normalized
}

export declare type StateType = {
  ui?: UiStateType
  app?: AppStateType
  domain?: DomainStateType
}
