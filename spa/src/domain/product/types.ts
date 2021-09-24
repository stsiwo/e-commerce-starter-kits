import { ReviewType } from "domain/review/type";
import { NormalizedDomainType } from "domain/types";

// variant stock enum
export enum ProductStockEnum {
  OUT_OF_STOCK = "OUT_OF_STOCK",
  LIMITED_STOCK = "LIMITED_STOCK",
  ENOUGH_STOCK = "ENOUGH_STOCK",
}

export declare type ProductStockBagType = {
  label: string;
  color: string;
  enum: ProductStockEnum;
};
export declare type ProductStockBagsType = {
  [key in ProductStockEnum]: ProductStockBagType;
};

export const productStockBags: ProductStockBagsType = {
  [ProductStockEnum.OUT_OF_STOCK]: {
    label: "out of stock",
    color: "#f44336", // default theme error.main
    enum: ProductStockEnum.OUT_OF_STOCK,
  },
  [ProductStockEnum.LIMITED_STOCK]: {
    label: "limited stock",
    color: "#ff9800", // default theme warning.main
    enum: ProductStockEnum.LIMITED_STOCK,
  },
  [ProductStockEnum.ENOUGH_STOCK]: {
    label: "enough stock",
    color: "#4caf50", // default theme success.main
    enum: ProductStockEnum.ENOUGH_STOCK,
  },
};

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
};
export declare type CategoryType = {
  categoryId: string;
  categoryName: string;
  categoryPath: string;
  categoryDescription: string;
  totalProductCount?: number;
  version: number;
};

export declare type NormalizedCategoryType = NormalizedDomainType<CategoryType>;

export declare type ProductImageType = {
  productImageId?: string;
  productImagePath: string;
  isChange: boolean;
  productImageName: string;
};

export declare type ProductVariantSizeType = {
  productSizeId: string;
  productSizeName: string;
  productSizeDescription: string;
};

export declare type ProductVariantType = {
  variantId: string;
  productSize: ProductVariantSizeType;
  variantColor: string;
  variantUnitPrice?: number;
  variantDiscountPrice?: number;
  variantDiscountStartDate?: Date;
  variantDiscountEndDate?: Date;
  variantStock: number;
  isDiscount: boolean;
  soldCount: number;
  note: string;
  createdAt: Date;
  updateAt: Date;
  variantWeight: number;
  variantHeight: number;
  variantWidth: number;
  variantLength: number;
  productId?: string;
  currentPrice?: number;
  isDiscountAvailable: boolean;
  regularPrice: number; // either product base unit price / variant uint price
  version: number;
};

export declare type ProductType = {
  productId?: string;
  productName: string;
  productDescription: string;
  productPath: string;
  productBaseUnitPrice: number;
  averageReviewPoint: number;
  isPublic: boolean;
  category: CategoryType;
  releaseDate: Date;
  note: string;
  createdAt: Date;
  updatedAt: Date;
  productImageFiles?: File[]; // to upload file in product form
  productImages?: ProductImageType[]; // to display teh image at client side (also send this to backend)
  variants?: ProductVariantType[];
  isDiscountAvailable?: boolean;
  cheapestPrice?: number;
  reviews?: ReviewType[];
  version: number;
};

export declare type NormalizedProductType = NormalizedDomainType<ProductType>;

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
  productId?: string;
  productName: string;
  productDescription: string;
  productPath: string;
  productBaseUnitPrice: number;
  isPublic: boolean;
  category: CategoryType;
  releaseDate: Date;
  note: string;
  productImageFiles?: File[]; // to upload file in product form
  productImages?: ProductImageType[]; // to display teh image at client side (also send this to backend)
  version: number;
};

// product variant criteria
export declare type ProductVariantCriteria = {
  variantId?: string;
  productSize: ProductVariantSizeType;
  variantColor: string;
  variantUnitPrice?: number;
  variantDiscountPrice?: number;
  variantDiscountStartDate?: Date;
  variantDiscountEndDate?: Date;
  variantStock: number;
  isDiscount: boolean;
  note: string;
  variantWeight: number;
  variantHeight: number;
  variantWidth: number;
  variantLength: number;
  version: number;
};

// category criteria
export declare type CategoryCriteria = {
  categoryId?: string;
  categoryName: string;
  categoryDescription: string;
  categoryPath: string;
  version: number;
};

// product variant state type for form & input
export declare type ProductVariantDataType = {
  variantId?: string;
  productSize: ProductVariantSizeType;
  variantColor: string;
  variantUnitPrice?: number;
  variantDiscountPrice?: number;
  variantDiscountStartDate?: Date;
  variantDiscountEndDate?: Date;
  variantStock: number;
  isDiscount: boolean;
  note: string;
  variantWeight: number;
  variantHeight: number;
  variantWidth: number;
  variantLength: number;
  version: number;
};

export const generateDefaultProductVariantData: () => ProductVariantDataType =
  () => ({
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
    version: null,
  });

// product variant state type for form & input
export declare type ProductVariantValidationDataType = {
  productSize: string;
  variantColor: string;
  variantUnitPrice: string;
  variantDiscountPrice: string;
  variantDiscountStartDate: string;
  variantDiscountEndDate: string;
  variantStock: string;
  isDiscount: string;
  note: string;
  variantWeight: string;
  variantHeight: string;
  variantWidth: string;
  variantLength: string;
};

export const defaultProductVariantValidationData: ProductVariantValidationDataType =
  {
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
  };

// product state type for form & input
export declare type ProductDataType = {
  productId?: string;
  productName: string;
  productDescription: string;
  productPath: string;
  productBaseUnitPrice: number;
  isPublic: boolean;
  category: CategoryType;
  releaseDate: Date;
  note: string;
  productImageFiles?: File[];
  productImages?: ProductImageType[];
  productVariants?: ProductVariantDataType[];
  version: number;
};

export const defaultProductData: ProductDataType = {
  productName: "",
  productDescription: "",
  productPath: "",
  productImageFiles: Array(5).fill(null),
  productImages: Array(5).fill(null),
  productBaseUnitPrice: 1,
  isPublic: false,
  category: null,
  releaseDate: new Date(),
  note: "",
  productVariants: [generateDefaultProductVariantData()],
  version: null,
};

export const generateDefaultProductOnlyData: () => ProductDataType = () => ({
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
  isPublic: false,
  category: null,
  releaseDate: new Date(),
  note: "",
  version: null,
});

// product validation state type for form & input
export declare type ProductValidationDataType = {
  productId?: string;
  productName: string;
  productDescription: string;
  productPath: string;
  productImages: string;
  productBaseUnitPrice: string;
  isPublic: string;
  category: string;
  releaseDate: string;
  note: string;
  productVariants: ProductVariantValidationDataType[];
};

export const defaultProductValidationData: ProductValidationDataType = {
  productName: "",
  productDescription: "",
  productPath: "",
  productImages: "",
  productBaseUnitPrice: "",
  isPublic: "",
  category: "",
  releaseDate: "",
  note: "",
  productVariants: [defaultProductVariantValidationData],
};

// category state typ for form & input
export declare type CategoryDataType = {
  categoryId?: string;
  categoryName: string;
  categoryDescription: string;
  categoryPath: string;
  version: number;
};

export const generateDefaultCategoryData: () => CategoryDataType = () => ({
  categoryName: "",
  categoryDescription: "",
  categoryPath: "",
  version: null,
});

// category validation type for form & input
export declare type CategoryValidationDataType = {
  categoryId?: string;
  categoryName: string;
  categoryDescription: string;
  categoryPath: string;
};

export const defaultCategoryValidationData: CategoryValidationDataType = {
  categoryName: "",
  categoryDescription: "",
  categoryPath: "",
};

export declare type ProductQueryType = {
  searchQuery: string;
  categoryId: string;
  minPrice: number;
  maxPrice: number;
  reviewPoint: number;
  isDiscount: boolean;
  startDate: Date;
  endDate: Date;
  sort: ProductSortEnum;
};

export declare type ProductQueryStringType = ProductQueryType & {
  page: number;
  limit: number;
};

export declare type CategoryQueryType = {
  searchQuery: string;
};

export declare type CategoryQueryStringType = CategoryQueryType & {
  page: number;
  limit: number;
};
