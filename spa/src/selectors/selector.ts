import { createSelector } from "@reduxjs/toolkit";
import { CartItemType } from "domain/cart/types";
import { ProductType } from "domain/product/types";
import { UserAddressType, UserPhoneType, UserType } from "domain/user/types";
import merge from 'lodash/merge';
import { denormalize } from "normalizr";
import { categorySchemaArray, productSchemaArray } from "states/state";
import { StateType } from "states/types";
import { WishlistItemType } from "domain/wishlist/types";

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
    getCartModal: (state: StateType) => state.ui.cartModal,
  },

  app: {
    getAuth: (state: StateType) => state.app.auth,
    getPreviousUrl: (state: StateType) => state.app.previousUrl,
    getMessage: (state: StateType) => state.app.message,
    getSearchKeyword: (state: StateType) => state.app.searchKeyword,
    getRequestTracker: (state: StateType) => state.app.requestTracker,
  },

  domain: {
    getCategory: (state: StateType) => state.domain.categories.data,
    getCategoryPagination: (state: StateType) => state.domain.categories.pagination,

    getReview: (state: StateType) => state.domain.reviews.data,
    getReviewPagination: (state: StateType) => state.domain.reviews.pagination,

    getCartItem: (state: StateType) => state.domain.cartItems,


    getWishlistItem: (state: StateType) => state.domain.wishlistItems.data,
    getWishlistItemPagination: (state: StateType) => state.domain.wishlistItems.pagination,
    getWishlistItemQuery: (state: StateType) => state.domain.wishlistItems.query,
    getWishlistItemQuerySearchQuery: (state: StateType) => state.domain.wishlistItems.query.searchQuery,
    getWishlistItemQueryMinPrice: (state: StateType) => state.domain.wishlistItems.query.minPrice,
    getWishlistItemQueryMaxPrice: (state: StateType) => state.domain.wishlistItems.query.maxPrice,
    getWishlistItemQueryStartDate: (state: StateType) => state.domain.wishlistItems.query.startDate,
    getWishlistItemQueryEndDate: (state: StateType) => state.domain.wishlistItems.query.endDate,
    getWishlistItemQueryIsDiscount: (state: StateType) => state.domain.wishlistItems.query.isDiscount,
    getWishlistItemQueryReviewPoint: (state: StateType) => state.domain.wishlistItems.query.reviewPoint,
    getWishlistItemQuerySort: (state: StateType) => state.domain.wishlistItems.query.sort,

    getUser: (state: StateType) => state.domain.users.data,
    getUserPagination: (state: StateType) => state.domain.users.pagination,

    getOrder: (state: StateType) => state.domain.orders.data,
    getOrderPagination: (state: StateType) => state.domain.orders.pagination,

    getProduct: (state: StateType) => state.domain.products.data,
    getProductQuery: (state: StateType) => state.domain.products.query,
    getProductQuerySearchQuery: (state: StateType) => state.domain.products.query.searchQuery,
    getProductQueryCategoryId: (state: StateType) => state.domain.products.query.categoryId,
    getProductQueryMinPrice: (state: StateType) => state.domain.products.query.minPrice,
    getProductQueryMaxPrice: (state: StateType) => state.domain.products.query.maxPrice,
    getProductQueryStartDate: (state: StateType) => state.domain.products.query.startDate,
    getProductQueryEndDate: (state: StateType) => state.domain.products.query.endDate,
    getProductQueryIsDiscount: (state: StateType) => state.domain.products.query.isDiscount,
    getProductQueryReviewPoint: (state: StateType) => state.domain.products.query.reviewPoint,
    getProductQuerySort: (state: StateType) => state.domain.products.query.sort,
    getProductPagination: (state: StateType) => state.domain.products.pagination,
    getProductCurItems: (state: StateType) => state.domain.products.curItems,
  },

  senstive: {
    getStripeClientSecret: (state: StateType) => state.sensitive.stripeClientSecret,
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

  // ui.cartModal
  makeCartModalSelector: () => {
    return createSelector(
      [
        rsSelector.ui.getCartModal
      ],
      (cartModal) => {
        return cartModal
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

  // app.auth.user.phones with isSelected
  makeAuthSelectedPhoneSelector: () => {
    return createSelector(
      [
        rsSelector.app.getAuth
      ],
      (auth) => {
        return auth.user.phones.find((phone: UserPhoneType) => phone.isSelected)
      },
    )
  },

  // app.auth.user.addresses with isBillingAddress
  makeAuthBillingAddressSelector: () => {
    return createSelector(
      [
        rsSelector.app.getAuth
      ],
      (auth) => {
        return auth.user.addresses.find((address: UserAddressType) => address.isBillingAddress)
      },
    )
  },

  // app.auth.user.addresses with isShippingAddress
  makeAuthShippingAddressSelector: () => {
    return createSelector(
      [
        rsSelector.app.getAuth
      ],
      (auth) => {
        return auth.user.addresses.find((address: UserAddressType) => address.isShippingAddress)
      },
    )
  },

  // app.auth.user to validate customer basic info
  makeAuthValidateCustomerBasicInfoSelector: () => {
    return createSelector(
      [
        rsSelector.app.getAuth
      ],
      (auth) => {
        return auth.user.firstName && auth.user.lastName && auth.user.email
      },
    )
  },

  // app.auth.user to validate customer phone info
  makeAuthValidateCustomerPhoneSelector: () => {
    return createSelector(
      [
        rsSelector.app.getAuth
      ],
      (auth) => {
        return auth.user.phones.find((phone: UserPhoneType) => phone.isSelected)
      },
    )
  },

  // app.auth.user to validate customer phone info
  makeAuthValidateCustomerShippingAddressSelector: () => {
    return createSelector(
      [
        rsSelector.app.getAuth
      ],
      (auth) => {
        return auth.user.addresses.find((address: UserAddressType) => address.isShippingAddress)
      },
    )
  },

  // app.auth.user to validate customer phone info
  makeAuthValidateCustomerBillingAddressSelector: () => {
    return createSelector(
      [
        rsSelector.app.getAuth
      ],
      (auth) => {
        return auth.user.addresses.find((address: UserAddressType) => address.isBillingAddress)
      },
    )
  },

  // app.private.stripeClientSecret
  makeStipeClientSecretSelector: () => {
    return createSelector(
      [
        rsSelector.senstive.getStripeClientSecret
      ],
      (stripeClientSecret) => {
        return stripeClientSecret
      },
    )
  },

  // app.previousUrl
  makePreviousUrlSelector: () => {
    return createSelector(
      [
        rsSelector.app.getPreviousUrl
      ],
      (previousUrl) => {
        return previousUrl
      },
    )
  },

  // app.message
  makeMessageSelector: () => {
    return createSelector(
      [
        rsSelector.app.getMessage
      ],
      (message) => {
        return message
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

  // domain.categories
  makeCategoryWithoutCacheSelector: () => {
    return createSelector(
      [
        rsSelector.domain.getCategory,
        rsSelector.domain.getCategoryPagination,
      ],
      (normalizedCategories, pagination) => {

        // need pagination??

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

        console.log(denormalizedEntities)

        return denormalizedEntities
      },
    )
  },

  // domain.categories.pagination
  makeCategoryPaginationSelector: () => {
    return createSelector(
      [
        rsSelector.domain.getCategoryPagination
      ],
      (pagination) => {
        return pagination
      },
    )
  },

  // domain.categories query string (query + pagination)
  makeCategoryQueryStringSelector: () => {
    return createSelector(
      [
        rsSelector.domain.getCategoryPagination
      ],
      (pagination) => {
        // react state should be immutable so put empty object first
        return merge({}, { page: pagination.page, limit: pagination.limit })
      },
    )
  },

  // domain.reviews
  makeReviewSelector: () => {
    return createSelector(
      [
        rsSelector.domain.getReview,
      ],
      (reviews) => {

        return reviews
      },
    )
  },

  // domain.reviews.pagination
  makeReviewPaginationSelector: () => {
    return createSelector(
      [
        rsSelector.domain.getReviewPagination
      ],
      (pagination) => {

        return pagination
      },
    )
  },

  // domain.reviews query string (query + pagination)
  makeReviewQueryStringSelector: () => {
    return createSelector(
      [
        rsSelector.domain.getReviewPagination
      ],
      (pagination) => {
        // react state should be immutable so put empty object first
        return merge({}, { page: pagination.page, limit: pagination.limit })
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

  // domain.cartItem with selected
  makeSelectedCartItemSelector: () => {
    return createSelector(
      [
        rsSelector.domain.getCartItem
      ],
      (cartItem) => {
        // this is array of cart item
        return cartItem.filter((cart: CartItemType) => cart.isSelected)
      },
    )
  },

  // domain.cartItem (# of cart items) 
  makeNumberOfCartItemSelector: () => {
    return createSelector(
      [
        rsSelector.domain.getCartItem
      ],
      (cartItem) => {
        return cartItem.length; 
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

  // domain.wishlistItem
  makeSingleWishlistItemSelector: (wishlistItemId: string) => {
    return createSelector(
      [
        rsSelector.domain.getWishlistItem
      ],
      (wishlistItem) => {
        // this is array of cart item
        return wishlistItem.find((wishlistItem: WishlistItemType) => wishlistItem.wishlistItemId === wishlistItemId)
      },
    )
  },

  // domain.wishlistItem.pagination
  makeWishlistItemPaginationSelector: () => {
    return createSelector(
      [
        rsSelector.domain.getWishlistItemPagination
      ],
      (pagination) => {
        // this is array of cart item
        return pagination
      },
    )
  },

  // domain.wishlistItems query string (query + pagination)
  makeWishlistItemQueryStringSelector: () => {
    return createSelector(
      [
        rsSelector.domain.getWishlistItemPagination,
        rsSelector.domain.getWishlistItemQuerySort,
        rsSelector.domain.getWishlistItemQuerySearchQuery,
        rsSelector.domain.getWishlistItemQueryStartDate,
        rsSelector.domain.getWishlistItemQueryEndDate,
        rsSelector.domain.getWishlistItemQueryReviewPoint,
        rsSelector.domain.getWishlistItemQueryMinPrice,
        rsSelector.domain.getWishlistItemQueryMaxPrice,
        rsSelector.domain.getWishlistItemQueryIsDiscount,
        rsSelector.app.getAuth, // don't forget this. used to get wishlist items for this user only.
      ],
      (pagination, sort, searchQuery, startDate, endDate, reviewPoint, minPrice, maxPrice, isDiscount, auth) => {
        // react state should be immutable so put empty object first
        return merge({}, { 
          sort: sort,
          searchQuery: searchQuery,
          startDate: startDate,
          endDate: endDate,
          reviewPoint: reviewPoint,
          minPrice: minPrice,
          maxPrice: maxPrice,
          isDiscount: isDiscount,
          page: pagination.page,
          limit: pagination.limit,
          userId: auth.user.userId,
        })
      },
    )
  },

  // domain.wishlistItems.query.isDiscount
  makeWishlistItemQueryIsDiscountSelector: () => {
    return createSelector(
      [
        rsSelector.domain.getWishlistItemQueryIsDiscount,
      ],
      (isDiscount) => {
        return isDiscount
      },
    )
  },

  // domain.wishlistItems.query.maxPrice
  makeWishlistItemQueryMaxPriceSelector: () => {
    return createSelector(
      [
        rsSelector.domain.getWishlistItemQueryMaxPrice,
      ],
      (maxPrice) => {
        return maxPrice
      },
    )
  },

  // domain.wishlistItems.query.minPrice
  makeWishlistItemQueryMinPriceSelector: () => {
    return createSelector(
      [
        rsSelector.domain.getWishlistItemQueryMinPrice,
      ],
      (minPrice) => {
        return minPrice
      },
    )
  },

  // domain.wishlistItems.query.reviewPoint
  makeWishlistItemQueryReviewPointSelector: () => {
    return createSelector(
      [
        rsSelector.domain.getWishlistItemQueryReviewPoint,
      ],
      (reviewPoint) => {
        return reviewPoint
      },
    )
  },

  // domain.wishlistItems.query.endDate
  makeWishlistItemQueryEndDateSelector: () => {
    return createSelector(
      [
        rsSelector.domain.getWishlistItemQueryEndDate,
      ],
      (endDate) => {
        return endDate
      },
    )
  },

  // domain.wishlistItems.query.startDate
  makeWishlistItemQueryStartDateSelector: () => {
    return createSelector(
      [
        rsSelector.domain.getWishlistItemQueryStartDate,
      ],
      (startDate) => {
        return startDate
      },
    )
  },

  // domain.wishlistItems.query.searchQuery
  makeWishlistItemQuerySearchQuerySelector: () => {
    return createSelector(
      [
        rsSelector.domain.getWishlistItemQuerySearchQuery,
      ],
      (searchQuery) => {
        return searchQuery
      },
    )
  },

  // domain.wishlistItems.query.sort
  makeWishlistItemQuerySortSelector: () => {
    return createSelector(
      [
        rsSelector.domain.getWishlistItemQuerySort,
      ],
      (sort) => {
        return sort
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

  // domain.users.pagination
  makeUserPaginationSelector: () => {
    return createSelector(
      [
        rsSelector.domain.getUserPagination
      ],
      (pagination) => {

        return pagination
      },
    )
  },

  // domain.users query string (query + pagination)
  makeUserQueryStringSelector: () => {
    return createSelector(
      [
        rsSelector.domain.getUserPagination
      ],
      (pagination) => {
        // react state should be immutable so put empty object first
        return merge({}, { page: pagination.page, limit: pagination.limit })
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

  // domain.orders.pagination
  makeOrderPaginationSelector: () => {
    return createSelector(
      [
        rsSelector.domain.getOrderPagination
      ],
      (pagination) => {

        return pagination
      },
    )
  },

  // domain.orders query string (query + pagination)
  makeOrderQueryStringSelector: () => {
    return createSelector(
      [
        rsSelector.domain.getOrderPagination
      ],
      (pagination) => {
        // react state should be immutable so put empty object first
        return merge({}, { page: pagination.page, limit: pagination.limit })
      },
    )
  },


  // domain.products
  makeProductWithoutCacheSelector: () => {
    return createSelector(
      [
        rsSelector.domain.getProduct,
        rsSelector.domain.getProductPagination,
      ],
      (normalizedProducts, pagination) => {

        // need pagination??

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
          productSchemaArray,
          {
            products: normalizedProducts
          }, // entities prop of normalized data (ex, { animes: { "1": { ... }, "2": { ... }, ... }})
        )

        console.log(denormalizedEntities)

        return denormalizedEntities
      },
    )
  },

  // domain.products
  makeProductSelector: () => {
    return createSelector(
      [
        rsSelector.domain.getProduct,
        rsSelector.domain.getProductPagination,
        rsSelector.domain.getProductCurItems,
      ],
      (normalizedProducts, pagination, curItems) => {

        // need pagination??

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
          curItems, // ex, [0, 1, 2, 3, 4] ('result' prop of normalized data)
          productSchemaArray,
          {
            products: normalizedProducts
          }, // entities prop of normalized data (ex, { animes: { "1": { ... }, "2": { ... }, ... }})
        )

        console.log(denormalizedEntities)

        return denormalizedEntities
      },
    )
  },

  // domain.products
  // mainly used for find this product at product detail page rather than sending request to api again.
  /**
   * this is not really performant. 
   *
   * instead, you should create new state for teh current target product on redux store. then, when users click the product link, update the target product
   * state and make selector for the target product when the user lands on the product detail page.
   *
   * #REFACTOR
   **/
  makeProductByPathSelector: (path: string) => {
    return createSelector(
      [
        rsSelector.domain.getProduct,
      ],
      (normalizedProducts) => {

        /**
         * denormalize
         *
         * this return { 'domain-name': [{ domain1 }, { domain2 }] in the format
         **/
        const denormalizedEntities = denormalize(
          Object.keys(normalizedProducts), // ex, [0, 1, 2, 3, 4] ('result' prop of normalized data)
          productSchemaArray,
          {
            products: normalizedProducts
          }, // entities prop of normalized data (ex, { animes: { "1": { ... }, "2": { ... }, ... }})
        )

        console.log(denormalizedEntities)

        return denormalizedEntities.find((product: ProductType) => product.productPath === path);
      },
    )
  },



  /**
   * get a list of product variant by product id
   **/
  makeProductVariantByProductIdSelector: (productId: string) => {
    return createSelector(
      [
        rsSelector.domain.getProduct
      ],
      (normalizedProducts) => {
        /**
         * return empty array before fetch
         **/
        if (Object.keys(normalizedProducts).length === 0) {
          return null
        }

        /**
         * denormalize
         *
         * this return { 'domain-name': [{ domain1 }, { domain2 }] in the format
         **/
        const denormalizedEntities = denormalize(
          [productId], // ex, [0, 1, 2, 3, 4] ('result' prop of normalized data)
          productSchemaArray,
          {
            products: normalizedProducts
          }, // entities prop of normalized data (ex, { animes: { "1": { ... }, "2": { ... }, ... }})
        )

        console.log(denormalizedEntities)

        return denormalizedEntities[0]
      },
    )
  },

  // domain.products.query
  makeProductQuerySelector: () => {
    return createSelector(
      [
        rsSelector.domain.getProductQuerySearchQuery,
        rsSelector.domain.getProductQueryCategoryId,
        rsSelector.domain.getProductQueryStartDate,
        rsSelector.domain.getProductQueryEndDate,
        rsSelector.domain.getProductQueryMinPrice,
        rsSelector.domain.getProductQueryMaxPrice,
        rsSelector.domain.getProductQueryIsDiscount,
        rsSelector.domain.getProductQueryReviewPoint,
        rsSelector.domain.getProductQuerySort,

      ],
      (searchQuery, categoryId, startDate, endDate, minPrice, maxPrice, isDiscount, reviewPoint, sort) => {

        return {
          searchQuery: searchQuery,
          categoryId: categoryId,
          minPrice: minPrice,
          maxPrice: maxPrice,
          reviewPoint: reviewPoint,
          isDiscount: isDiscount,
          startDate: startDate,
          endDate: endDate,
          sort: sort,
        }
      },
    )
  },

  makeProductQuerySearchQuerySelector: () => {
    return createSelector(
      [
        rsSelector.domain.getProductQuerySearchQuery
      ],
      (searchQuery) => {
        return searchQuery
      },
    )
  },

  makeProductQueryCategoryIdSelector: () => {
    return createSelector(
      [
        rsSelector.domain.getProductQueryCategoryId
      ],
      (categoryId) => {
        return categoryId
      },
    )
  },

  makeProductQueryMinPriceSelector: () => {
    return createSelector(
      [
        rsSelector.domain.getProductQueryMinPrice
      ],
      (minPrice) => {
        return minPrice
      },
    )
  },

  makeProductQueryMaxPriceSelector: () => {
    return createSelector(
      [
        rsSelector.domain.getProductQueryMaxPrice
      ],
      (maxPrice) => {
        return maxPrice
      },
    )
  },

  makeProductQueryReviewPointSelector: () => {
    return createSelector(
      [
        rsSelector.domain.getProductQueryReviewPoint
      ],
      (reviewPoint) => {
        return reviewPoint
      },
    )
  },

  makeProductQueryIsDiscountSelector: () => {
    return createSelector(
      [
        rsSelector.domain.getProductQueryIsDiscount
      ],
      (isDiscount) => {
        return isDiscount
      },
    )
  },

  makeProductQueryStartDateSelector: () => {
    return createSelector(
      [
        rsSelector.domain.getProductQueryStartDate
      ],
      (startDate) => {
        return startDate
      },
    )
  },

  makeProductQueryEndDateSelector: () => {
    return createSelector(
      [
        rsSelector.domain.getProductQueryEndDate
      ],
      (endDate) => {
        return endDate
      },
    )
  },

  makeProductQuerySortSelector: () => {
    return createSelector(
      [
        rsSelector.domain.getProductQuerySort
      ],
      (sort) => {
        return sort
      },
    )
  },

  // domain.products.pagination
  makeProductPaginationSelector: () => {
    return createSelector(
      [
        rsSelector.domain.getProductPagination
      ],
      (pagination) => {

        return pagination
      },
    )
  },


  // domain.products query string (query + pagination)
  makeProductQueryStringSelector: () => {
    return createSelector(
      [
        rsSelector.domain.getProductQuery,
        rsSelector.domain.getProductPagination
      ],
      (query, pagination) => {
        // react state should be immutable so put empty object first
        return merge({}, query, { page: pagination.page, limit: pagination.limit })
      },
    )
  },
}
