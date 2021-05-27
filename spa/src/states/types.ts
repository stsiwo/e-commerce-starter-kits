import { NormalizedCategoryType, NormalizedProductType, ProductSortEnum } from "domain/product/types";
import { AuthType, RequestTrackerType, FetchStatusEnum, MessageTypeEnum, MessageStateType } from "src/app/";
import { CartItemType } from "domain/cart/types";
import { WishlistItemType, WishlistItemSortEnum } from "domain/wishlist/types";
import { UserType, UserSortEnum } from "domain/user/types";
import { OrderType, OrderSortEnum } from "domain/order/types";
import { ReviewType, ReviewSortEnum } from "domain/review/type";

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
  message: MessageStateType 
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
      postVariant: FetchStatusEnum
      putVariant: FetchStatusEnum
      deleteSingleVariant: FetchStatusEnum
    },
    orders: {
      get: FetchStatusEnum
      getSingle: FetchStatusEnum
      post: FetchStatusEnum
      put: FetchStatusEnum
      deleteSingle: FetchStatusEnum
      postEvent: FetchStatusEnum
      deleteSingleEvent: FetchStatusEnum
      putEvent: FetchStatusEnum
    },
    users: {
      get: FetchStatusEnum
      getSingle: FetchStatusEnum
      post: FetchStatusEnum
      put: FetchStatusEnum
      patch: FetchStatusEnum
      postPhone: FetchStatusEnum
      putPhone: FetchStatusEnum
      patchPhone: FetchStatusEnum
      deletePhone: FetchStatusEnum
      postAddress: FetchStatusEnum
      putAddress: FetchStatusEnum
      patchAddress: FetchStatusEnum
      deleteAddress: FetchStatusEnum
      deleteSingle: FetchStatusEnum
      postAvatarImage: FetchStatusEnum
      deleteAvatarImage: FetchStatusEnum
    },
    categories: {
      get: FetchStatusEnum
      post: FetchStatusEnum
      put: FetchStatusEnum
      deleteSingle: FetchStatusEnum
    },
    reviews: {
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
      patch: FetchStatusEnum
      deleteSingle: FetchStatusEnum
      delete: FetchStatusEnum
    },
    auth: {
      getSingle: FetchStatusEnum
      put: FetchStatusEnum
      postPhone: FetchStatusEnum
      putPhone: FetchStatusEnum
      patchPhone: FetchStatusEnum
      deletePhone: FetchStatusEnum
      postAddress: FetchStatusEnum
      putAddress: FetchStatusEnum
      patchAddress: FetchStatusEnum
      deleteAddress: FetchStatusEnum
      postAvatarImage: FetchStatusEnum
      deleteAvatarImage: FetchStatusEnum
      putCompany: FetchStatusEnum
    },
  },
}

export declare type DomainPaginationType = {
  page: number
  limit: number
  totalPages: number
  totalElements: number
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
    query: {
      searchQuery: string,
      minPrice: number,
      maxPrice: number,
      reviewPoint: number,
      isDiscount: boolean,
      startDate: Date,
      endDate: Date,
      sort: WishlistItemSortEnum,
    },
  },
  users: {
    data: UserType[] // don't need to normalized
    pagination: DomainPaginationType,
    query: {
      searchQuery: string,
      startDate: Date,
      endDate: Date,
      sort: UserSortEnum,
    },
  },
  orders: {
    data: OrderType[] // don't need to normalized 
    query: {
      searchQuery: string,
      orderStatus: string,
      startDate: Date,
      endDate: Date,
      sort: OrderSortEnum,
    },
    pagination: DomainPaginationType,
  },
  reviews: {  
    data: ReviewType[],
    pagination: DomainPaginationType,
    query: {
      searchQuery: string,
      reviewPoint: number,
      isVerified: boolean,
      startDate: Date,
      endDate: Date,
      userId: string,
      productId: string,
      sort: ReviewSortEnum,
    },
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
