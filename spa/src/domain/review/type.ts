import { ProductType } from "domain/product/types";
import { UserType } from "domain/user/types";

// type def
export declare type ReviewType = {
  reviewId?: string
  user: UserType
  product: ProductType
  reviewPoint: number
  reviewTitle: string
  reviewDescription: string
  isVerified: boolean
  createdAt: Date
  updateAt: Date
  note: string
}

export declare type ReviewValidationType = {
  reviewId?: string
  reviewPoint: string
  reviewTitle: string
  reviewDescription: string
  isVerified: string
  note: string
}

export declare type ReviewDataType = ReviewType
export declare type ReviewValidationDataType = ReviewValidationType

// form & input state
export const defaultReviewData: ReviewDataType = {
  user: null,
  product: null,
  reviewPoint: 0.0,
  reviewTitle: "",
  reviewDescription: "",
  isVerified: false,
  createdAt: new Date,
  updateAt: new Date,
  note: ""
}

export const defaultReviewValidationData: ReviewValidationDataType = {
  reviewPoint: "",
  reviewTitle: "",
  reviewDescription: "",
  isVerified: "",
  note: ""
}

// sort
export enum ReviewSortEnum {
  DATE_DESC = "DATE_DESC",
  DATE_ASC = "DATE_ASC",
  REVIEW_POINT_ASC = "REVIEW_POINT_ASC",
  REVIEW_POINT_DESC = "REVIEW_POINT_DESC",
}

// criteria
export declare type ReviewCriteria = {
  reviewId?: string
  userId: string
  productId: string
  reviewPoint: number
  reviewTitle: string
  reviewDescription: string
  isVerified: boolean
  note?: string
}
