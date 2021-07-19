import { WishlistItemType } from "./types"

export const isOutOfStock: (wishlistItem: WishlistItemType) => boolean = (wishlistItem) => {
    return wishlistItem.product.variants[0].variantStock <= 0
}