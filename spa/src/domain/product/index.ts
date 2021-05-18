import { ProductType, ProductVariantType } from "./types";
import uniq from 'lodash/uniq';

/**
 * domain behaviors
 *
 **/
export function filterUniqueVariantColors(product: ProductType) {
  return uniq(product.variants.map((variant: ProductVariantType) => {
    return variant.variantColor
  }))
}


export function filterUniqueVariantSizes(product: ProductType) {
  return uniq(product.variants.map((variant: ProductVariantType) => {
    return variant.productSize
  }))
}

export function isExceedStock(amount: number, variantId: string, product: ProductType) {
  const targetVariant = product.variants.find((variant: ProductVariantType) => variant.variantId == variantId);

  return amount > targetVariant.variantStock
}
