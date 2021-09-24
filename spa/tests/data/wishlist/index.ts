import { WishlistItemType } from "domain/wishlist/types";
import faker from "../faker";
import { generateProductList, generateProductVariantList } from "../product";
import { testGuestUser } from "../user";

export const generateWishlistItemList: (count?: number) => WishlistItemType[] =
  (count = 1) => {
    const list = [];

    for (let i = 0; i < count; i++) {
      list.push({
        wishlistId: `${i + 1}`,
        user: testGuestUser,
        product: generateProductList(1)[0],
        variant: generateProductVariantList(1)[0],
        createdAt: new Date(faker.date.past()),
        updatedAt: new Date(faker.date.past()),
        version: null,
      } as WishlistItemType);
    }

    return list;
  };
