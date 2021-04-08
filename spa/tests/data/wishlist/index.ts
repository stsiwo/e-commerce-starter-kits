import { WishListItemType } from "domain/wishlist/types";
import { testGuestUser } from "../user";
import faker from "../faker";
import { generateProductList, generateProductVariantList } from "../product";

export const generateWishListItemList: (count?: number) => WishListItemType[] = (count = 1) => {
  const list = []

  for (let i = 0; i < count; i++) {
    list.push({
      wishlistId: `${i + 1}`,
      user: testGuestUser,
      product: generateProductList(1)[0],
      variant: generateProductVariantList(1)[0],
      createdAt: new Date(faker.date.past()),
      updatedAt: new Date(faker.date.past()),
    } as WishListItemType)
  }

  return list
}

