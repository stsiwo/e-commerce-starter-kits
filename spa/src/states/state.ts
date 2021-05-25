import { StateType } from "./types";
import { UserTypeEnum, FetchStatusEnum, MessageTypeEnum } from "src/app";
import { defaultUser } from "domain/user/types";
import { normalize, schema } from 'normalizr';
import { ProductSortEnum } from "domain/product/types";
import { getNanoId } from "src/utils";
import { WishlistItemSortEnum } from "domain/wishlist/types";

/**
 *
 * normalizr definition
 *
 **/

// category
const categorySchemaEntity = new schema.Entity(
  "categories",
  {},
  {
    idAttribute: "categoryId",
  }
)

export const categorySchemaArray = new schema.Array(categorySchemaEntity);

// product
export const productSchemaEntity = new schema.Entity(
  "products",
  {},
  {
    idAttribute: "productId",
  }
)

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
 *
 * initial state
 *
 **/
export const initialState: StateType = {
  ui: {
    leftNavMenu: false,
    rightNavMenu: false,
    searchModal: false,
    cartModal: false,
  },
  app: {
    // if "auth" exists in localStorage, retrieve as initial state, otherwise, get default Guest auth.
    auth: localStorage.getItem("auth") != null ? JSON.parse(localStorage.getItem("auth")) : {
      isLoggedIn: false,
      userType: UserTypeEnum.GUEST,
      user: defaultUser,
    },
    previousUrl: "",
    message: {
      id: getNanoId(),
      type: MessageTypeEnum.INITIAL,
      message: ""
    },
    searchKeyword: "",
    requestTracker: {},
    fetchStatus: {
      stripeClientSecret: FetchStatusEnum.INITIAL,
      products: {
        get: FetchStatusEnum.INITIAL,
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
      },
      users: {
        get: FetchStatusEnum.INITIAL,
        getSingle: FetchStatusEnum.INITIAL,
        post: FetchStatusEnum.INITIAL,
        put: FetchStatusEnum.INITIAL,
        patch: FetchStatusEnum.INITIAL,
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
      },
    },
  },
  domain: {
    categories: {
      data: {},
      pagination: {
        page: 0, // start from 0 (not 1)
        limit: 10,
        totalPages: 1,
        totalElements: 0,
      },
    },
    cartItems: [],
    wishlistItems: {
      data: [],
      pagination: {
        page: 0, // start from 0 (not 1)
        limit: 10,
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
      pagination: {
        page: 0, // start from 0 (not 1)
        limit: 10,
        totalPages: 1,
        totalElements: 0,
      },
    },
    orders: {
      data: [],
      pagination: {
        page: 0, // start from 0 (not 1)
        limit: 10,
        totalPages: 1,
        totalElements: 0,
      },
    },
    reviews: {
      data: [],
      pagination: {
        page: 0, // start from 0 (not 1)
        limit: 10,
        totalPages: 1,
        totalElements: 0,
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
    }
  },
  // never persist
  sensitive: {
    stripeClientSecret: ""
  }
}
