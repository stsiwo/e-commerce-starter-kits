import { NormalizedCategoryType, NormalizedProductType } from "domain/product/types";
import { AuthType, RequestTrackerType, FetchStatusEnum } from "src/app/";
import { CartItemType } from "domain/cart/types";
import { WishlistItemType } from "domain/wishlist/types";
import { UserType } from "domain/user/types";
import { OrderType } from "domain/order/types";

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
  fetchStatus: {
    stripeClientSecret: FetchStatusEnum,
    products: {
      get: FetchStatusEnum
      getSingle: FetchStatusEnum
      post: FetchStatusEnum
      put: FetchStatusEnum
      deleteSingle: FetchStatusEnum
    },
    orders: {
      get: FetchStatusEnum
      getSingle: FetchStatusEnum
      post: FetchStatusEnum
      put: FetchStatusEnum
      deleteSingle: FetchStatusEnum
    },
    users: {
      get: FetchStatusEnum
      getSingle: FetchStatusEnum
      post: FetchStatusEnum
      put: FetchStatusEnum
      patch: FetchStatusEnum
      deleteSingle: FetchStatusEnum
    },
    categories: {
      get: FetchStatusEnum
      post: FetchStatusEnum
      put: FetchStatusEnum
      deleteSingle: FetchStatusEnum
    },
    cartItems: {
      get: FetchStatusEnum
      post: FetchStatusEnum
      put: FetchStatusEnum
      deleteSingle: FetchStatusEnum
      delete: FetchStatusEnum
    },
    wishlistItems: {
      get: FetchStatusEnum
      post: FetchStatusEnum
      deleteSingle: FetchStatusEnum
      delete: FetchStatusEnum
    }
  },
  // NEVER EVER STORE THIS ON LOCAL STORAGE/SESSION STORAGE. just for only in-memory
  private: {
    stripeClientSecret: string
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
  wishlistItems: WishlistItemType[] // don't need to normalized
  users: UserType[] // don't need to normalized
  orders: OrderType[] // don't need to normalized 
  products: NormalizedProductType 
}

export declare type StateType = {
  ui?: UiStateType
  app?: AppStateType
  domain?: DomainStateType
}
