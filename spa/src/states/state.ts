import { StateType } from "./types";
import { UserTypeEnum, FetchStatusEnum } from "src/app";
import { defaultUser } from "domain/user/types";
import { normalize, schema } from 'normalizr';

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
const productSchemaEntity = new schema.Entity(
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
  },
  app: {
    auth: {
      isLoggedIn: false,
      userType: UserTypeEnum.GUEST,
      user: defaultUser,
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
      },
      categories: {
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
        delete: FetchStatusEnum.INITIAL,
        deleteSingle: FetchStatusEnum.INITIAL,
      }
    },
    private: {
      stripeClientSecret: ""
    }
  },
  domain: {
    categories: {}, 
    cartItems: [],
    wishlistItems: [],
    users: [],
    orders: [],
    products: {},
  },
}
