import { NormalizedDomainType } from "domain/types";

export declare type CategoryType = {
  categoryId: string
  categoryName: string
  categoryDescription: string
}

export declare type NormalizedCategoryType = NormalizedDomainType<CategoryType>

export declare type ProductImageType = {
  productImageId: string
  productImagePath: string
}

export declare type ProductVariantSizeType = {
  productSizeId: string
  productSizeName: string
  productSizeDescription: string
}

export declare type ProductVariantType = {
  variantId: string
  variantSize: ProductVariantSizeType
  variantColor: string
  variantUnitPrice?: number
  variantDiscountPrice?: number
  variantDiscountStartDate?: Date
  variantDiscountEndDate?: Date
  variantStock: number
  isDiscount: boolean
  soldCount: number
  note: string
  createdAt: Date
  updateAt: Date
}


export declare type ProductType = {
  productId?: string
  productName: string
  productDescription: string
  productPath: string
  productBaseUnitPrice: number
  productBaseDiscountPrice?: number
  productBaseDiscountStartDate?: Date
  productBaseDiscountEndDate?: Date
  averageReviewPoint: number
  isDiscount: boolean
  isPublic: boolean
  category: CategoryType
  releaseDate: Date
  note: string
  createdAt: Date
  updatedAt: Date
  productImages: ProductImageType[]
  productVariants?: ProductVariantType[]
}

export enum ProductSortEnum {
  DATE_DESC = "DATE_DESC",
  DATE_ASC = "DATE_ASC",
  ALPHABETIC_ASC = "ALPHABETIC_ASC",
  ALPHABETIC_DESC = "ALPHABETIC_DESC",
  PRICE_ASC = "PRICE_ASC",
  PRICE_DESC = "PRICE_DESC",
}

// product variant state type for form & input
export declare type ProductVariantDataType = {
  variantSize: ProductVariantSizeType
  variantColor: string
  variantUnitPrice?: number
  variantDiscountPrice?: number
  variantDiscountStartDate?: Date
  variantDiscountEndDate?: Date
  variantStock: number
  isDiscount: boolean
  soldCount: number
  note: string
}

export const defaultProductVariantData: ProductVariantDataType = {
  variantSize: null,
  variantColor: "#fff",
  variantUnitPrice: 0,
  variantDiscountPrice: 0,
  variantDiscountStartDate: new Date(),
  variantDiscountEndDate: new Date(),
  variantStock: 0,
  isDiscount: false,
  soldCount: 0,
  note: ""
}

// product variant state type for form & input
export declare type ProductVariantValidationDataType = {
  variantSize: string, 
  variantColor: string,
  variantUnitPrice: string,
  variantDiscountPrice: string,
  variantDiscountStartDate: string,
  variantDiscountEndDate: string,
  variantStock: string,
  isDiscount: string,
  soldCount: string,
  note: string,
}

export const defaultProductVariantValidationData: ProductVariantValidationDataType = {
  variantSize: "", 
  variantColor: "",
  variantUnitPrice: "",
  variantDiscountPrice: "",
  variantDiscountStartDate: "",
  variantDiscountEndDate: "",
  variantStock: "",
  isDiscount: "",
  soldCount: "",
  note: "",
}

// product state type for form & input
export declare type ProductDataType = {
  productId?: string
  productName: string
  productDescription: string
  productPath: string
  productBaseUnitPrice: number
  productBaseDiscountPrice?: number
  productBaseDiscountStartDate?: Date
  productBaseDiscountEndDate?: Date
  isDiscount: boolean
  isPublic: boolean
  category: CategoryType
  releaseDate: Date
  note: string
  productVariants?: ProductVariantDataType[]
}

export const defaultProductData: ProductDataType = {
  productName: "",
  productDescription: "",
  productPath: "",
  productBaseUnitPrice: 0,
  productBaseDiscountPrice: 0,
  productBaseDiscountStartDate: new Date(),
  productBaseDiscountEndDate: new Date(),
  isDiscount: false,
  isPublic: false,
  category: null,
  releaseDate: new Date(),
  note: "",
  productVariants: [
    defaultProductVariantData
  ],
}

export const defaultProductOnlyData: ProductDataType = {
  productName: "",
  productDescription: "",
  productPath: "",
  productBaseUnitPrice: 0,
  productBaseDiscountPrice: 0,
  productBaseDiscountStartDate: new Date(),
  productBaseDiscountEndDate: new Date(),
  isDiscount: false,
  isPublic: false,
  category: null,
  releaseDate: new Date(),
  note: "",
}

// product validation state type for form & input
export declare type ProductValidationDataType = {
  productId?: string
  productName: string
  productDescription: string
  productPath: string
  productBaseUnitPrice: string
  productBaseDiscountPrice?: string
  productBaseDiscountStartDate?: string
  productBaseDiscountEndDate?: string
  isDiscount: string
  isPublic: string
  category: string
  releaseDate: string
  note: string
  productVariants: ProductVariantValidationDataType[]
}

export const defaultProductValidationData: ProductValidationDataType = {
  productName: "",
  productDescription: "",
  productPath: "",
  productBaseUnitPrice: "",
  productBaseDiscountPrice: "",
  productBaseDiscountStartDate: "",
  productBaseDiscountEndDate: "",
  isDiscount: "",
  isPublic: "",
  category: "",
  releaseDate: "",
  note: "",
  productVariants: [
    defaultProductVariantValidationData
  ]
}

// category state typ for form & input
export declare type CategoryDataType = {
  categoryId?: string
  categoryName: string
  categoryDescription: string
  categoryPath: string
}

export const defaultCategoryData: CategoryDataType = {
  categoryName: "",
  categoryDescription: "",
  categoryPath: ""
}


// category validation type for form & input
export declare type CategoryValidationDataType = {
  categoryId?: string
  categoryName: string
  categoryDescription: string
  categoryPath: string
}

export const defaultCategoryValidationData: CategoryValidationDataType = {
  categoryName: "",
  categoryDescription: "",
  categoryPath: ""
}

