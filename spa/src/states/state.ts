import { StateType } from "./types";
import { UserTypeEnum } from "src/app";
import { defaultUser } from "domain/user/types";

/**
 *
 * normalizr definition
 *
 **/

// category
//const categorySchemaEntity = new schema.Entity(
//  "categories",
//  {},
//  {
//    // need to override default value ('id')
//    idAttribute: "path",
//  }
//)
//
//// tags
//const tagSchemaEntity = new schema.Entity(
//  "tags",
//  {},
//  {
//    idAttribute: "name",
//  }
//)
//
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
    
  },
  domain: {
  },
}
