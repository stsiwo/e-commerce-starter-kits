import { NormalizedDomainType } from "domain/types";

export declare type CategoryType = {
  categoryId: string
  categoryName: string
  categoryPath: string
  categoryDescription: string
  totalProductCount?: number
}

export declare type NormalizedCategoryType = NormalizedDomainType<CategoryType>

export declare type ProductImageType = {
  productImageId?: string
  productImagePath: string
}

export declare type ProductVariantSizeType = {
  productSizeId: string
  productSizeName: string
  productSizeDescription: string
}

export declare type ProductVariantType = {
  variantId: string
  productSize: ProductVariantSizeType
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
  weight?: number
  height?: number
  width?: number
  length?: number
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
  productImageFiles?: File[] // to upload file in product form
  productImages?: ProductImageType[] // to display teh image at client side
  variants?: ProductVariantType[]
}

export declare type NormalizedProductType = NormalizedDomainType<ProductType>

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
  variantId?: string 
  productSize: ProductVariantSizeType
  variantColor: string
  variantUnitPrice?: number
  variantDiscountPrice?: number
  variantDiscountStartDate?: Date
  variantDiscountEndDate?: Date
  variantStock: number
  isDiscount: boolean
  soldCount: number
  note: string
  weight?: number
  height?: number
  width?: number
  length?: number
}

export const defaultProductVariantData: ProductVariantDataType = {
  productSize: null,
  variantColor: "#fff",
  variantUnitPrice: 0,
  variantDiscountPrice: 0,
  variantDiscountStartDate: new Date(),
  variantDiscountEndDate: new Date(),
  variantStock: 0,
  isDiscount: false,
  soldCount: 0,
  note: "",
  weight: 1,
  height: 1,
  width: 1,
  length: 1,
}

// product variant state type for form & input
export declare type ProductVariantValidationDataType = {
  productSize: string, 
  variantColor: string,
  variantUnitPrice: string,
  variantDiscountPrice: string,
  variantDiscountStartDate: string,
  variantDiscountEndDate: string,
  variantStock: string,
  isDiscount: string,
  soldCount: string,
  note: string,
  weight: string,
  height: string,
  width: string,
  length: string,
}

export const defaultProductVariantValidationData: ProductVariantValidationDataType = {
  productSize: "", 
  variantColor: "",
  variantUnitPrice: "",
  variantDiscountPrice: "",
  variantDiscountStartDate: "",
  variantDiscountEndDate: "",
  variantStock: "",
  isDiscount: "",
  soldCount: "",
  note: "",
  weight: "",
  height: "",
  width: "",
  length: "",
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
  productImageFiles?: File[]
  productImages?: ProductImageType[]
  productVariants?: ProductVariantDataType[]
}

export const defaultProductData: ProductDataType = {
  productName: "",
  productDescription: "",
  productPath: "",
  productImageFiles: Array(5).fill(null),
  productImages: Array(5).fill(null),
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
  productImageFiles: Array(5).fill(null),
  productImages: Array(5).fill(null),
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

