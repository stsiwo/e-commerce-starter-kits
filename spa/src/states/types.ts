import { NormalizedCategoryType, NormalizedProductType, ProductSortEnum } from "domain/product/types";
import { AuthType, RequestTrackerType, FetchStatusEnum } from "src/app/";
import { CartItemType } from "domain/cart/types";
import { WishlistItemType } from "domain/wishlist/types";
import { UserType } from "domain/user/types";
import { OrderType } from "domain/order/types";
import { ReviewType } from "domain/review/type";

//import { NormalizedBlogType } from "domain/blog";
//import { NormalizedCategoryType } from "domain/category";
//import { NormalizedTagType } from "domain/tag";

export declare type UiStateType = {
  leftNavMenu?: boolean
  rightNavMenu?: boolean
  searchModal?: boolean
  cartModal?: boolean
}

export declare type AppStateType = {
  auth: AuthType 
  previousUrl: string
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
    reviews: {
      get: FetchStatusEnum
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
}

export declare type DomainPaginationType = {
  page: number
  limit: number
  totalPages: number
}

export declare type DomainStateSubType<D extends Record<string, any>> = {
  data: D
  pagination: DomainPaginationType
}

export declare type DomainStateType = {
  categories: {  
    data: NormalizedCategoryType,
    pagination: DomainPaginationType,
  },
  cartItems: CartItemType[] // don't need to normalized
  wishlistItems: {
    data: WishlistItemType[] // don't need to normalized
    pagination: DomainPaginationType,
    // no cache so don't need curItems
  },
  users: {
    data: UserType[] // don't need to normalized
    pagination: DomainPaginationType,
  },
  orders: {
    data: OrderType[] // don't need to normalized 
    pagination: DomainPaginationType,
  },
  reviews: {  
    data: ReviewType[],
    pagination: DomainPaginationType,
  },
  products: {
    data: NormalizedProductType 
    query: {
      searchQuery: string,
      categoryId: string,
      minPrice: number,
      maxPrice: number,
      reviewPoint: number,
      isDiscount: boolean,
      startDate: Date,
      endDate: Date,
      sort: ProductSortEnum,
    },
    pagination: DomainPaginationType,
    curItems: string[],
  }
}

export declare type SensitiveStateType = {
  stripeClientSecret: string
}

export declare type StateType = {
  ui?: UiStateType
  app?: AppStateType
  domain?: DomainStateType
  // NEVER EVER STORE THIS ON LOCAL STORAGE/SESSION STORAGE. just for only in-memory
  sensitive: SensitiveStateType 
}
