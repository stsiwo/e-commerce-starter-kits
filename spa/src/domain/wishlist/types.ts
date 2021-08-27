import { ProductType } from "domain/product/types";
import { UserType } from "domain/user/types";

export declare type WishlistItemType = {
  wishlistItemId?: string;
  user?: UserType;
  /**
   *  - assuming that this product only contains a selected product.
   **/
  product: ProductType;
  createdAt?: Date;
  updatedAt?: Date;
};

// criteria
export declare type WishlistItemCriteria = {
  wishlistItemId?: string;
  userId?: string;
  variantId: string;
};

export declare type WishlistItemQueryStringCriteria = {
  userId: string;
  searchQuery?: string;
  reviewPoint?: number;
  minPrice?: number;
  maxPrice?: number;
  isDiscount?: boolean;
  startDate?: Date;
  endDate?: Date;
};

export enum WishlistItemSortEnum {
  DATE_DESC = "DATE_DESC",
  DATE_ASC = "DATE_ASC",
  ALPHABETIC_ASC = "ALPHABETIC_ASC",
  ALPHABETIC_DESC = "ALPHABETIC_DESC",
  PRICE_ASC = "PRICE_ASC",
  PRICE_DESC = "PRICE_DESC",
}

export declare type WishlistItemQueryType = {
  searchQuery: string;
  minPrice: number;
  maxPrice: number;
  reviewPoint: number;
  isDiscount: boolean;
  startDate: Date;
  endDate: Date;
  sort: WishlistItemSortEnum;
};

export declare type WishlistItemQueryStringType = WishlistItemQueryType & {
  page: number;
  limit: number;
};
