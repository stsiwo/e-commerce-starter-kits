import { NormalizedDomainType } from "domain/types";

// variant size
// this must match with the backend 'product_size' table
export const productVariantSizeObj = {
  xs: {
    productSizeId: "1",
    productSizeName: "XS",
    productSizeDescription: "",
  },
  s: {
    productSizeId: "2",
    productSizeName: "S",
    productSizeDescription: "",
  },
  m: {
    productSizeId: "3",
    productSizeName: "M",
    productSizeDescription: "",
  },
  l: {
    productSizeId: "4",
    productSizeName: "L",
    productSizeDescription: "",
  },
  xl: {
    productSizeId: "5",
    productSizeName: "XL",
    productSizeDescription: "",
  },
}
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
  isChange: boolean
  productImageName: string
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
  variantWeight: number
  variantHeight: number
  variantWidth: number
  variantLength: number
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
  productImages?: ProductImageType[] // to display teh image at client side (also send this to backend)
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

// productCriteria
export declare type ProductCriteria = {
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
  productImageFiles?: File[] // to upload file in product form
  productImages?: ProductImageType[] // to display teh image at client side (also send this to backend)
}

// product variant criteria
export declare type ProductVariantCriteria = {
  variantId?: string 
  productSize: ProductVariantSizeType
  variantColor: string
  variantUnitPrice?: number
  variantDiscountPrice?: number
  variantDiscountStartDate?: Date
  variantDiscountEndDate?: Date
  variantStock: number
  isDiscount: boolean
  note: string
  variantWeight: number
  variantHeight: number
  variantWidth: number
  variantLength: number
}

// category criteria
export declare type CategoryCriteria = {
  categoryId?: string
  categoryName: string
  categoryDescription: string
  categoryPath: string
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
  note: string
  variantWeight: number
  variantHeight: number
  variantWidth: number
  variantLength: number
}

export const defaultProductVariantData: ProductVariantDataType = {
  productSize: productVariantSizeObj.xs,
  variantColor: "#fff",
  variantUnitPrice: 1,
  variantDiscountPrice: 1,
  variantDiscountStartDate: new Date(),
  variantDiscountEndDate: new Date(),
  variantStock: 0,
  isDiscount: false,
  note: "",
  variantWeight: 1,
  variantHeight: 1,
  variantWidth: 1,
  variantLength: 1,
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
  note: string,
  variantWeight: string,
  variantHeight: string,
  variantWidth: string,
  variantLength: string,
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
  note: "",
  variantWeight: "",
  variantHeight: "",
  variantWidth: "",
  variantLength: "",
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
  productBaseUnitPrice: 1,
  productBaseDiscountPrice: 1,
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
  productImages: [
    {
      productImageName: "product-image-0",
      productImagePath: "",
      isChange: true,
    },
    {
      productImageName: "product-image-1",
      productImagePath: "",
      isChange: true,
    },
    {
      productImageName: "product-image-2",
      productImagePath: "",
      isChange: true,
    },
    {
      productImageName: "product-image-3",
      productImagePath: "",
      isChange: true,
    },
    {
      productImageName: "product-image-4",
      productImagePath: "",
      isChange: true,
    },
  ],
  productBaseUnitPrice: 1,
  productBaseDiscountPrice: 1,
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
  productImages: string 
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
  productImages: "", 
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

