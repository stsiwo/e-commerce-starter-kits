import { AppPageResponse } from "configs/axiosConfig";
import { ProductType } from "domain/product/types";
import { rest } from "msw";
import { paginationObject } from "tests/data";
import { generateProductList } from "tests/data/product";

export const handlers = [
  rest.get("http://api.stsiwo.com/products/public", (req, res, ctx) => {
    return res(
      ctx.json({
        content: generateProductList(5),
        ...paginationObject,
      } as AppPageResponse<ProductType[]>)
    );
  }),

  rest.options("http://api.stsiwo.com/products/public", (req, res, ctx) => {
    return res(
      ctx.json({
        content: generateProductList(5),
        ...paginationObject,
      } as AppPageResponse<ProductType[]>)
    );
  }),
];
