import { CartItemType } from "domain/cart/types";
import faker from "../faker";
import { generateProductList, generateProductVariantList } from "../product";
import { testGuestUser } from "../user";

export const generateCartItemList: (count?: number) => CartItemType[] = (
  count = 1
) => {
  const list = [];

  for (let i = 0; i < count; i++) {
    list.push({
      cartId: `${i + 1}`,
      user: testGuestUser,
      isSelected: true,
      product: generateProductList(1)[0],
      variant: generateProductVariantList(1)[0],
      quantity: faker.datatype.number(4),
      createdAt: new Date(faker.date.past()),
      updatedAt: new Date(faker.date.past()),
      version: null,
    } as CartItemType);
  }

  return list;
};
