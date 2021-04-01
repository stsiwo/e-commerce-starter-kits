export declare type CategoryType = {
  categoryId: string
  categoryName: string
  categoryDescription: string
}

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
  variantUnitPrice: number
  variantDiscountPrice: number
  variantDiscountStartDate: Date
  variantDiscountEndDate: Date
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
  productVariants: ProductVariantType[]
}

export enum ProductSortEnum {
  DATE_DESC = "DATE_DESC",
  DATE_ASC = "DATE_ASC",
  ALPHABETIC_ASC = "ALPHABETIC_ASC",
  ALPHABETIC_DESC = "ALPHABETIC_DESC",
  PRICE_ASC = "PRICE_ASC",
  PRICE_DESC = "PRICE_DESC",
}
