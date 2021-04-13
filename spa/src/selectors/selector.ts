import { createSelector } from "@reduxjs/toolkit";
import { StateType } from "states/types";
import { denormalize } from "normalizr";
import { categorySchemaArray } from "states/state";
import { UserType } from "domain/user/types";

export const rsSelector = {
  /**
 * selector function to retrieve data from redux store
 **/

  /**
   * check this: https://redux-toolkit.js.org/api/createEntityAdapter
   **/

  /**
   *
   * low level (pure) selector is always run (different from reselect) (no cache)
   *
   **/

  ui: {
    getLeftNavMenu: (state: StateType) => state.ui.leftNavMenu,
    getRightNavMenu: (state: StateType) => state.ui.rightNavMenu,
    getSearchModal: (state: StateType) => state.ui.searchModal,
  },

  app: {
    getAuth: (state: StateType) => state.app.auth,
    getSearchKeyword: (state: StateType) => state.app.searchKeyword,
    getRequestTracker: (state: StateType) => state.app.requestTracker,
  },

  domain: {
    getCategory: (state: StateType) => state.domain.categories,
    getCartItem: (state: StateType) => state.domain.cartItems,
    getWishlistItem: (state: StateType) => state.domain.wishlistItems,
    getUser: (state: StateType) => state.domain.users,
    getOrder: (state: StateType) => state.domain.orders,
    getProduct: (state: StateType) => state.domain.orders 
  }
}

/**
 * memorized selector note:
 *
 * it has cache (size 1) capability. so if its particular portion of state tree hasn't change, it returns cached value.
 *
 * However, if multiple component instances use the same memorized selector instance, you CAN'T use this cache features. since the memorized selector recognized that revieved arguments are different every time when it is called.
 *
 * Therefore, you have to give a copy of momerized selector to each component instance. (I'm not sure it is true when using redux-saga though)
 *
 **/

export const mSelector = {

  // ui.leftNavMenu
  makeLeftNavMenuSelector: () => {
    return createSelector(
      [
        rsSelector.ui.getLeftNavMenu
      ],
      (leftNavMenu) => {
        return leftNavMenu
      },
    )
  },

  // ui.rightNavMenu
  makeRightNavMenuSelector: () => {
    return createSelector(
      [
        rsSelector.ui.getRightNavMenu
      ],
      (rightNavMenu) => {
        return rightNavMenu
      },
    )
  },

  // ui.searchModal
  makeSearchModalSelector: () => {
    return createSelector(
      [
        rsSelector.ui.getSearchModal
      ],
      (searchModal) => {
        return searchModal
      },
    )
  },

  // app.auth
  makeAuthSelector: () => {
    return createSelector(
      [
        rsSelector.app.getAuth
      ],
      (auth) => {
        return auth
      },
    )
  },

  // app.searchKeyword
  makeSearchKeywordSelector: () => {
    return createSelector(
      [
        rsSelector.app.getSearchKeyword
      ],
      (keyword) => {
        return keyword
      },
    )
  },


  // app.requestTracker
  makeRequestTrackerSelector: () => {
    return createSelector(
      [
        rsSelector.app.getRequestTracker
      ],
      (requestTracker) => {
        return requestTracker
      },
    )
  },

  // domain.categories
  makeCategorySelector: () => {
    return createSelector(
      [
        rsSelector.domain.getCategory
      ],
      (normalizedCategories) => {

        /**
         * return empty array before fetch
         **/
        if (Object.keys(normalizedCategories).length === 0) {
          return []
        }

        /**
         * denormalize
         *
         * this return { 'domain-name': [{ domain1 }, { domain2 }] in the format
         **/
        const denormalizedEntities = denormalize(
          Object.keys(normalizedCategories), // ex, [0, 1, 2, 3, 4] ('result' prop of normalized data)
          categorySchemaArray,
          {
            categories: normalizedCategories
          }, // entities prop of normalized data (ex, { animes: { "1": { ... }, "2": { ... }, ... }})
        )

        return denormalizedEntities
      },
    )
  },

  // domain.cartItem
  makeCartItemSelector: () => {
    return createSelector(
      [
        rsSelector.domain.getCartItem
      ],
      (cartItem) => {
        // this is array of cart item
        return cartItem
      },
    )
  },
  
  // domain.wishlistItem
  makeWishlistItemSelector: () => {
    return createSelector(
      [
        rsSelector.domain.getWishlistItem
      ],
      (wishlistItem) => {
        // this is array of cart item
        return wishlistItem
      },
    )
  },

  // domain.users
  makeUserSelector: () => {
    return createSelector(
      [
        rsSelector.domain.getUser
      ],
      (user) => {

        /**
         * TODO: Pagination & Sort & Filter
         **/

        // this is array of cart item
        return user
      },
    )
  },
  
  // domain.users
  makeUserByIdSelector: (userId: string) => {
    return createSelector(
      [
        rsSelector.domain.getUser
      ],
      (user) => {

        /**
         * TODO: Pagination & Sort & Filter
         **/

        // this is array of cart item
        return user.find((user: UserType) => user.userId === userId)
      },
    )
  },
  
  // domain.orders
  makeOrderSelector: () => {
    return createSelector(
      [
        rsSelector.domain.getOrder
      ],
      (order) => {

        /**
         * TODO: Pagination & Sort & Filter
         **/

        // this is array of cart item
        return order
      },
    )
  },
  
  // domain.products
  makeProductSelector: () => {
    return createSelector(
      [
        rsSelector.domain.getCategory
      ],
      (normalizedProducts) => {

        /**
         * return empty array before fetch
         **/
        if (Object.keys(normalizedProducts).length === 0) {
          return []
        }

        /**
         * denormalize
         *
         * this return { 'domain-name': [{ domain1 }, { domain2 }] in the format
         **/
        const denormalizedEntities = denormalize(
          Object.keys(normalizedProducts), // ex, [0, 1, 2, 3, 4] ('result' prop of normalized data)
          categorySchemaArray,
          {
            products: normalizedProducts
          }, // entities prop of normalized data (ex, { animes: { "1": { ... }, "2": { ... }, ... }})
        )

        return denormalizedEntities
      },
    )
  },
}
