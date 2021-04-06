import { OrderType, OrderEventType, OrderStatusEnum, OrderDetailType } from "domain/order/types";
import faker from "../faker";
import { testGuestUser } from "../user";
import { generateProductList } from "../product";


export const testOrderEventListAfterCompleted: OrderEventType[] = [
  {
    orderEventId: `order-event-id1`,
    orderId: `order-id1`,
    createdAt: faker.date.past(),
    isUndo: false,
    undoable: false,
    orderStatus: OrderStatusEnum.DRAFT,
    user: testGuestUser,
    note: "",
  },
  {
    orderEventId: `order-event-id2`,
    orderId: `order-id2`,
    createdAt: faker.date.past(),
    isUndo: false,
    undoable: false,
    orderStatus: OrderStatusEnum.PAID,
    user: testGuestUser,
    note: "",
  },
  {
    orderEventId: `order-event-id3`,
    orderId: `order-id3`,
    createdAt: faker.date.past(),
    isUndo: false,
    undoable: false,
    orderStatus: OrderStatusEnum.ORDERED,
    user: testGuestUser,
    note: "",
  },
  {
    orderEventId: `order-event-id4`,
    orderId: `order-id4`,
    createdAt: faker.date.past(),
    isUndo: false,
    undoable: false,
    orderStatus: OrderStatusEnum.SHIPPED,
    user: testGuestUser,
    note: "",
  },
  {
    orderEventId: `order-event-id5`,
    orderId: `order-id5`,
    createdAt: faker.date.past(),
    isUndo: false,
    undoable: false,
    orderStatus: OrderStatusEnum.COMPLETED,
    user: testGuestUser,
    note: "",
  },
]

export const testOrderEventListAfterOrdered: OrderEventType[] = [
  {
    orderEventId: `order-event-id1`,
    orderId: `order-id1`,
    createdAt: faker.date.past(),
    isUndo: false,
    undoable: false,
    orderStatus: OrderStatusEnum.DRAFT,
    user: testGuestUser,
    note: "",
  },
  {
    orderEventId: `order-event-id2`,
    orderId: `order-id2`,
    createdAt: faker.date.past(),
    isUndo: false,
    undoable: false,
    orderStatus: OrderStatusEnum.PAID,
    user: testGuestUser,
    note: "",
  },
  {
    orderEventId: `order-event-id3`,
    orderId: `order-id3`,
    createdAt: faker.date.past(),
    isUndo: false,
    undoable: false,
    orderStatus: OrderStatusEnum.ORDERED,
    user: testGuestUser,
    note: "",
  },
]
export const generateOrderDetailList: (count?: number) => OrderDetailType[] = (count = 1) => {
  const list = []

  for (let i = 0; i < count; i++) {
    list.push({
      orderDetailId: `${i + 1}`,
      product: generateProductList(1)[0],
      productColor: faker.commerce.color(),
      productName: faker.commerce.productName(),
      productQuantity: faker.random.number(5),
      productSize: "XS",
      productUnitPrice: parseFloat(faker.commerce.price()),
    } as OrderDetailType)
  }

  return list
}


export const generateOrderList: (count?: number) => OrderType[] = (count = 1) => {
  const list = []

  for (let i = 0; i < count; i++) {
    list.push({
      orderId: `${i + 1}`,
      orderNumber: faker.datatype.uuid(),
      createdAt: faker.date.past(),
      note: faker.random.words(200),
      productCost: parseFloat(faker.commerce.price()),
      taxCost: parseFloat(faker.commerce.price()),
      updatedAt: faker.date.past(),
      orderEvents: testOrderEventListAfterPaid,
      orderDetails: generateOrderDetailList(3),
      user: testGuestUser,
    } as OrderType)
  }

  return list
}
