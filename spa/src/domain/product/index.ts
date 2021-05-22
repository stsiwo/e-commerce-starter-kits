import { ProductType, ProductVariantType, ProductVariantSizeType } from "./types";
import uniq from 'lodash/uniq';
import cloneDeep from 'lodash/cloneDeep';

/**
 * domain behaviors
 *
 **/
export function filterUniqueVariantColors(product: ProductType): string[] {
  return uniq(product.variants.map((variant: ProductVariantType) => {
    return variant.variantColor
  }))
}


export function filterUniqueVariantSizes(product: ProductType): ProductVariantSizeType[] {
  return uniq(product.variants.map((variant: ProductVariantType) => {
    return variant.productSize
  }))
}

export function isExceedStock(amount: number, variantId: string, product: ProductType): boolean {
  const targetVariant = product.variants.find((variant: ProductVariantType) => variant.variantId == variantId);

  return amount > targetVariant.variantStock
}

// return the filtered variant as array
/**
 * use this when creating cartItem/wishlistItem.
 *
 * the product object of these entities required to filter product variants so that it contains only selected variant.
 *
 * return new filtered product object.
 *
 **/
export function filterSingleVariant(variantId: string, product: ProductType): ProductType {
  const tempProduct = cloneDeep(product)
  tempProduct.variants = product.variants.filter((variant: ProductVariantType) => variant.variantId == variantId);
  return tempProduct;
}
