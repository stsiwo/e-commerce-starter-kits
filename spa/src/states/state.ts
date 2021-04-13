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
)

export const categorySchemaArray = new schema.Array(categorySchemaEntity);

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
    categoryFetchStatus: FetchStatusEnum.INITIAL,
    fetchStatus: {
      cartItems: {
        get: FetchStatusEnum.INITIAL,
        post: FetchStatusEnum.INITIAL,
        put: FetchStatusEnum.INITIAL,
        delete: FetchStatusEnum.INITIAL,
        deleteSingle: FetchStatusEnum.INITIAL,
      }
    }
  },
  domain: {
    categories: {}, 
    cartItems: [],
  },
}
