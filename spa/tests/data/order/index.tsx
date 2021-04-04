import { OrderType } from "domain/order/types";
import faker from "../faker";


export const generateOrderList: (count?: number) => OrderType[] = (count = 1) => {
  const list = []

  for (let i = 0; i < count; i++) {
    list.push({
      orderId: `${i + 1}`,
      orderNumber: faker.datatype.uuid,
      
    } as OrderType)
  }

  return list
}
