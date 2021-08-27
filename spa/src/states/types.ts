import { CartItemType } from "domain/cart/types";
import { NotificationType } from "domain/notification/types";
import {
  CheckoutSessionStatusEnum,
  OrderQueryType,
  OrderType,
} from "domain/order/types";
import {
  CategoryQueryType,
  NormalizedCategoryType,
  NormalizedProductType,
  ProductQueryType,
} from "domain/product/types";
import { ReviewQueryType, ReviewType } from "domain/review/type";
import { AdminCompanyType, UserQueryType, UserType } from "domain/user/types";
import { WishlistItemQueryType, WishlistItemType } from "domain/wishlist/types";
import {
  AuthType,
  FetchStatusEnum,
  MessageStateType,
  RequestTrackerType,
} from "src/app/";

//import { NormalizedBlogType } from "domain/blog";
//import { NormalizedCategoryType } from "domain/category";
//import { NormalizedTagType } from "domain/tag";

export declare type UiStateType = {
  leftNavMenu: boolean;
  rightNavMenu: boolean;
  searchModal: boolean;
  cartModal: boolean;
};

export declare type AppStateType = {
  auth: AuthType;
  previousUrl: string;
  message: MessageStateType;
  searchKeyword: string;
  requestTracker: RequestTrackerType;
  fetchStatus: {
    products: {
      get: FetchStatusEnum;
      getPublic: FetchStatusEnum;
      getSingle: FetchStatusEnum;
      post: FetchStatusEnum;
      put: FetchStatusEnum;
      deleteSingle: FetchStatusEnum;
      postVariant: FetchStatusEnum;
      putVariant: FetchStatusEnum;
      deleteSingleVariant: FetchStatusEnum;
    };
    orders: {
      get: FetchStatusEnum;
      getSingle: FetchStatusEnum;
      post: FetchStatusEnum;
      put: FetchStatusEnum;
      deleteSingle: FetchStatusEnum;
      postEvent: FetchStatusEnum;
      deleteSingleEvent: FetchStatusEnum;
      putEvent: FetchStatusEnum;
      postSessionTimeoutEvent: FetchStatusEnum;
      getRating: FetchStatusEnum;
    };
    users: {
      get: FetchStatusEnum;
      getSingle: FetchStatusEnum;
      post: FetchStatusEnum;
      put: FetchStatusEnum;
      patch: FetchStatusEnum;
      postPhone: FetchStatusEnum;
      putPhone: FetchStatusEnum;
      patchPhone: FetchStatusEnum;
      deletePhone: FetchStatusEnum;
      postAddress: FetchStatusEnum;
      putAddress: FetchStatusEnum;
      patchAddress: FetchStatusEnum;
      deleteAddress: FetchStatusEnum;
      deleteSingle: FetchStatusEnum;
      postAvatarImage: FetchStatusEnum;
      deleteAvatarImage: FetchStatusEnum;
    };
    categories: {
      get: FetchStatusEnum;
      post: FetchStatusEnum;
      put: FetchStatusEnum;
      deleteSingle: FetchStatusEnum;
    };
    reviews: {
      get: FetchStatusEnum;
      post: FetchStatusEnum;
      put: FetchStatusEnum;
      deleteSingle: FetchStatusEnum;
    };
    cartItems: {
      get: FetchStatusEnum;
      post: FetchStatusEnum;
      put: FetchStatusEnum;
      deleteSingle: FetchStatusEnum;
      delete: FetchStatusEnum;
    };
    wishlistItems: {
      get: FetchStatusEnum;
      post: FetchStatusEnum;
      patch: FetchStatusEnum;
      deleteSingle: FetchStatusEnum;
      delete: FetchStatusEnum;
    };
    auth: {
      getSingle: FetchStatusEnum;
      put: FetchStatusEnum;
      postPhone: FetchStatusEnum;
      putPhone: FetchStatusEnum;
      patchPhone: FetchStatusEnum;
      deletePhone: FetchStatusEnum;
      postAddress: FetchStatusEnum;
      putAddress: FetchStatusEnum;
      patchAddress: FetchStatusEnum;
      deleteAddress: FetchStatusEnum;
      postAvatarImage: FetchStatusEnum;
      deleteAvatarImage: FetchStatusEnum;
      putCompany: FetchStatusEnum;
      fetchOrder: FetchStatusEnum;
      fetchSingleOrder: FetchStatusEnum;
      postOrderEvent: FetchStatusEnum;
    };
    notifications: {
      get: FetchStatusEnum;
      patch: FetchStatusEnum;
    };
    company: {
      get: FetchStatusEnum;
    };
  };
};

export declare type DomainPaginationType = {
  page: number;
  limit: number;
  totalPages: number;
  totalElements: number;
  last?: boolean; // last page or not
};

export declare type DomainStateSubType<D extends Record<string, any>> = {
  data: D;
  pagination: DomainPaginationType;
};

export declare type DomainStateType = {
  categories: {
    data: NormalizedCategoryType;
    query: CategoryQueryType;
    pagination: DomainPaginationType;
  };
  cartItems: CartItemType[]; // don't need to normalized
  wishlistItems: {
    data: WishlistItemType[]; // don't need to normalized
    pagination: DomainPaginationType;
    query: WishlistItemQueryType;
  };
  users: {
    data: UserType[]; // don't need to normalized
    pagination: DomainPaginationType;
    query: UserQueryType;
  };
  orders: {
    data: OrderType[]; // don't need to normalized
    query: OrderQueryType;
    pagination: DomainPaginationType;
  };
  reviews: {
    data: ReviewType[];
    pagination: DomainPaginationType;
    query: ReviewQueryType;
  };
  products: {
    data: NormalizedProductType;
    query: ProductQueryType;
    pagination: DomainPaginationType;
    curItems: string[];
  };
  checkout: {
    sessionStatus: CheckoutSessionStatusEnum;
    order: OrderType;
    isRatingSuccess: boolean;
  };
  notifications: {
    data: NotificationType[];
    pagination: DomainPaginationType;
    curIndex: number;
  };
  company: {
    data: AdminCompanyType;
  };
};

export declare type SensitiveStateType = {
  stripeClientSecret: string;
};

export declare type StateType = {
  ui: UiStateType;
  app: AppStateType;
  domain: DomainStateType;
  // NEVER EVER STORE THIS ON LOCAL STORAGE/SESSION STORAGE. just for only in-memory
  sensitive: SensitiveStateType;
};
