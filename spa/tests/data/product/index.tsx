import {
  CategoryType,
  ProductImageType,
  ProductType,
  productVariantSizeObj,
  ProductVariantType,
} from "domain/product/types";
import faker from "../faker";

export const generateCategoryList: (count?: number) => CategoryType[] = (
  count = 1
) => {
  const list = [];

  for (let i = 0; i < count; i++) {
    list.push({
      categoryId: `${i + 1}`,
      categoryName: `Category Item Number ${i + 1}`,
      categoryDescription: faker.random.words(100),
    } as CategoryType);
  }

  return list;
};

export const generateProductImageList: (count?: number) => ProductImageType[] =
  (count = 1) => {
    const list = [];

    for (let i = 0; i < count; i++) {
      list.push({
        productImageId: `${i + 1}`,
        productImagePath: faker.random.image(),
      } as ProductImageType);
    }

    return list;
  };

// n = 5, last = 4
const productSizeArray = ["xs", "s", "m", "l", "xl"];

export const getRandomBoolean: () => boolean = () => {
  return Math.random() < 0.5;
};

export const generateProductVariantList: (
  count?: number
) => ProductVariantType[] = (count = 1) => {
  const list = [];

  for (let i = 0; i < count; i++) {
    const isDiscount = getRandomBoolean();

    list.push({
      variantId: `${i + 1}`,
      createdAt: faker.date.past(),
      updateAt: faker.date.past(),
      isDiscount: isDiscount,
      note: faker.random.words(200),
      soldCount: faker.datatype.number(20),
      variantColor: faker.commerce.color(),
      productSize:
        productVariantSizeObj[
          productSizeArray[
            faker.datatype.number(4)
          ] as keyof typeof productVariantSizeObj
        ],
      variantStock: faker.datatype.number(3),
      variantUnitPrice: parseFloat(faker.commerce.price()),
      ...(isDiscount && {
        variantDiscountPrice: parseFloat(faker.commerce.price()),
      }),
      ...(isDiscount && { variantDiscountStartDate: faker.date.past() }),
      ...(isDiscount && { variantDiscountEndDate: faker.date.future() }),
    } as ProductVariantType);
  }

  return list;
};

export const generateProductList: (count?: number) => ProductType[] = (
  count = 1
) => {
  const list = [];

  for (let i = 0; i < count; i++) {
    const isDiscount = getRandomBoolean();

    list.push({
      productId: faker.datatype.uuid(),
      productName: faker.commerce.productName(),
      productDescription: faker.commerce.productDescription(),
      productPath: faker.internet.url(),
      productImages: generateProductImageList(3),
      productVariants: generateProductVariantList(3),
      productBaseUnitPrice: parseFloat(faker.commerce.price()),
      cheapestPrice: parseFloat(faker.commerce.price()),
      isDiscount: isDiscount,
      ...(isDiscount && {
        variantDiscountPrice: parseFloat(faker.commerce.price()),
      }),
      ...(isDiscount && { variantDiscountStartDate: faker.date.past() }),
      ...(isDiscount && { variantDiscountEndDate: faker.date.future() }),
      releaseDate: faker.date.past(),
      averageReviewPoint: faker.random.float(5.0),
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
      isPublic: true,
      note: faker.commerce.productDescription(),
      category: generateCategoryList()[0],
      version: null,
    } as ProductType);
  }

  return list;
};
