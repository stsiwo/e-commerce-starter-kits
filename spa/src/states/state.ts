import { CheckoutSessionStatusEnum, OrderSortEnum } from "domain/order/types";
import { ProductSortEnum } from "domain/product/types";
import { ReviewSortEnum } from "domain/review/type";
import { defaultUser, UserSortEnum } from "domain/user/types";
import { WishlistItemSortEnum } from "domain/wishlist/types";
import { cloneDeep } from "lodash";
import { schema } from "normalizr";
import {
  FetchStatusEnum,
  MessageStateType,
  MessageTypeEnum,
  UserTypeEnum,
} from "src/app";
import { getNanoId } from "src/utils";
import { StateType } from "./types";

/**
 *
 * normalizr definition
 *
 **/

// category
export const categorySchemaEntity = new schema.Entity(
  "categories",
  {},
  {
    idAttribute: "categoryId",
  }
);

export const categorySchemaArray = new schema.Array(categorySchemaEntity);

// product
export const productSchemaEntity = new schema.Entity(
  "products",
  {},
  {
    idAttribute: "productId",
  }
);

export const productSchemaArray = new schema.Array(productSchemaEntity);

//export const tagSchemaArray = new schema.Array(tagSchemaEntity)

// anime
//const animeSchemaEntity = new schema.Entity(
//  "animes",
//)
//export const animeSchemaArray = new schema.Array(animeSchemaEntity)
//
//// make connection btw blogs and categories
////categorySchemaEntity.define({
////  blogs: blogSchemaArray
////})
//
///**
// *
// * normalize blog data
// *
// **/
//const normalizedResult = normalize(
//  {},
//  animeSchemaArray
//)

/**
 * original initial state
 */
const originalInitialState: StateType = {
  ui: {
    leftNavMenu: false,
    rightNavMenu: false,
    searchModal: false,
    cartModal: false,
  },
  app: {
    // if "auth" exists in localStorage, retrieve as initial state, otherwise, get default Guest auth.
    auth:
      localStorage.getItem("auth") != null
        ? JSON.parse(localStorage.getItem("auth"))
        : {
            isLoggedIn: false,
            userType: UserTypeEnum.GUEST,
            user: defaultUser,
          },
    previousUrl: "",
    message: {
      id: getNanoId(),
      type: MessageTypeEnum.INITIAL,
      message: "",
    },
    searchKeyword: "",
    requestTracker: {},
    fetchStatus: {
      products: {
        get: FetchStatusEnum.INITIAL,
        getPublic: FetchStatusEnum.INITIAL,
        getSingle: FetchStatusEnum.INITIAL,
        post: FetchStatusEnum.INITIAL,
        put: FetchStatusEnum.INITIAL,
        deleteSingle: FetchStatusEnum.INITIAL,
        postVariant: FetchStatusEnum.INITIAL,
        putVariant: FetchStatusEnum.INITIAL,
        deleteSingleVariant: FetchStatusEnum.INITIAL,
      },
      orders: {
        get: FetchStatusEnum.INITIAL,
        getSingle: FetchStatusEnum.INITIAL,
        post: FetchStatusEnum.INITIAL,
        put: FetchStatusEnum.INITIAL,
        deleteSingle: FetchStatusEnum.INITIAL,
        postEvent: FetchStatusEnum.INITIAL,
        deleteSingleEvent: FetchStatusEnum.INITIAL,
        putEvent: FetchStatusEnum.INITIAL,
        postSessionTimeoutEvent: FetchStatusEnum.INITIAL,
        getRating: FetchStatusEnum.INITIAL,
      },
      users: {
        get: FetchStatusEnum.INITIAL,
        getSingle: FetchStatusEnum.INITIAL,
        post: FetchStatusEnum.INITIAL,
        put: FetchStatusEnum.INITIAL,
        patch: FetchStatusEnum.INITIAL,
        postPhone: FetchStatusEnum.INITIAL,
        putPhone: FetchStatusEnum.INITIAL,
        patchPhone: FetchStatusEnum.INITIAL,
        deletePhone: FetchStatusEnum.INITIAL,
        postAddress: FetchStatusEnum.INITIAL,
        putAddress: FetchStatusEnum.INITIAL,
        patchAddress: FetchStatusEnum.INITIAL,
        deleteAddress: FetchStatusEnum.INITIAL,
        deleteSingle: FetchStatusEnum.INITIAL,
        postAvatarImage: FetchStatusEnum.INITIAL,
        deleteAvatarImage: FetchStatusEnum.INITIAL,
      },
      categories: {
        get: FetchStatusEnum.INITIAL,
        post: FetchStatusEnum.INITIAL,
        put: FetchStatusEnum.INITIAL,
        deleteSingle: FetchStatusEnum.INITIAL,
      },
      reviews: {
        get: FetchStatusEnum.INITIAL,
        post: FetchStatusEnum.INITIAL,
        put: FetchStatusEnum.INITIAL,
        deleteSingle: FetchStatusEnum.INITIAL,
      },
      cartItems: {
        get: FetchStatusEnum.INITIAL,
        post: FetchStatusEnum.INITIAL,
        put: FetchStatusEnum.INITIAL,
        delete: FetchStatusEnum.INITIAL,
        deleteSingle: FetchStatusEnum.INITIAL,
      },
      wishlistItems: {
        get: FetchStatusEnum.INITIAL,
        post: FetchStatusEnum.INITIAL,
        patch: FetchStatusEnum.INITIAL,
        delete: FetchStatusEnum.INITIAL,
        deleteSingle: FetchStatusEnum.INITIAL,
      },
      auth: {
        getSingle: FetchStatusEnum.INITIAL,
        put: FetchStatusEnum.INITIAL,
        patch: FetchStatusEnum.INITIAL,
        postPhone: FetchStatusEnum.INITIAL,
        putPhone: FetchStatusEnum.INITIAL,
        patchPhone: FetchStatusEnum.INITIAL,
        deletePhone: FetchStatusEnum.INITIAL,
        postAddress: FetchStatusEnum.INITIAL,
        putAddress: FetchStatusEnum.INITIAL,
        patchAddress: FetchStatusEnum.INITIAL,
        deleteAddress: FetchStatusEnum.INITIAL,
        postAvatarImage: FetchStatusEnum.INITIAL,
        deleteAvatarImage: FetchStatusEnum.INITIAL,
        putCompany: FetchStatusEnum.INITIAL,
        fetchOrder: FetchStatusEnum.INITIAL,
        fetchSingleOrder: FetchStatusEnum.INITIAL,
        postOrderEvent: FetchStatusEnum.INITIAL,
      },
      notifications: {
        get: FetchStatusEnum.INITIAL,
        patch: FetchStatusEnum.INITIAL,
      },
      company: {
        get: FetchStatusEnum.INITIAL,
      },
    },
  },
  domain: {
    categories: {
      data: {},
      query: {
        searchQuery: "",
      },
      pagination: {
        page: 0, // start from 0 (not 1)
        limit: 20,
        totalPages: 1,
        totalElements: 0,
      },
    },
    cartItems:
      localStorage.getItem("cartItems") != null
        ? JSON.parse(localStorage.getItem("cartItems"))
        : [],
    wishlistItems: {
      data: [],
      pagination: {
        page: 0, // start from 0 (not 1)
        limit: 20,
        totalPages: 1,
        totalElements: 0,
      },
      query: {
        searchQuery: "",
        minPrice: null,
        maxPrice: null,
        isDiscount: null,
        reviewPoint: null,
        startDate: null,
        endDate: null,
        sort: WishlistItemSortEnum.DATE_DESC,
      },
    },
    users: {
      data: [],
      query: {
        searchQuery: "",
        active: null,
        startDate: null,
        endDate: null,
        sort: UserSortEnum.DATE_DESC,
      },
      pagination: {
        page: 0, // start from 0 (not 1)
        limit: 20,
        totalPages: 1,
        totalElements: 0,
      },
    },
    orders: {
      data: [],
      query: {
        searchQuery: "",
        orderStatus: null,
        startDate: null,
        endDate: null,
        sort: OrderSortEnum.DATE_DESC,
      },
      pagination: {
        page: 0, // start from 0 (not 1)
        limit: 20,
        totalPages: 1,
        totalElements: 0,
      },
    },
    reviews: {
      data: [],
      pagination: {
        page: 0, // start from 0 (not 1)
        limit: 20,
        totalPages: 1,
        totalElements: 0,
      },
      query: {
        searchQuery: "",
        reviewPoint: null,
        isVerified: null,
        startDate: null,
        endDate: null,
        userId: "",
        productId: "",
        sort: ReviewSortEnum.DATE_DESC,
      },
    },
    products: {
      data: {},
      query: {
        searchQuery: "",
        categoryId: "0",
        minPrice: null,
        maxPrice: null,
        isDiscount: null,
        reviewPoint: null,
        startDate: null,
        endDate: null,
        sort: ProductSortEnum.DATE_DESC,
      },
      pagination: {
        page: 0, // start from 0 (not 1)
        limit: 20,
        totalPages: 1,
        totalElements: 0,
      },
      curItems: [],
    },
    checkout: {
      sessionStatus: CheckoutSessionStatusEnum.INITIAL,
      order: null,
      isRatingSuccess: false,
    },
    notifications: {
      data: [],
      pagination: {
        page: 0, // start from 0 (not 1)
        limit: 5,
        totalPages: 1,
        totalElements: 0,
        last: true,
      },
      curId: null,
      curNotification: null,
    },
    company: {
      data: null,
    },
  },
  // never persist
  sensitive: {
    stripeClientSecret: "",
  },
};

/**
 *
 * initial state
 *
 **/
export const initialState: StateType = cloneDeep(originalInitialState);

/**
 * create a new initial state when you receive 401 error
 */
export const initialStateWhen401 = (message: MessageStateType) => {
  const newState = cloneDeep(originalInitialState);
  newState.app.message = message;
  return newState;
};
