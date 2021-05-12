import { ProductDataType } from "./types";

export const productDataGenerator = (input: ProductDataType) => {

  const formData = new FormData();

  if (input.productId)
    formData.append("productId", input.productId)

  formData.append("productName", input.productName)
  formData.append("productDescription", input.productDescription)
  formData.append("productPath", input.productPath)
  formData.append("productBaseUnitPrice", input.productBaseUnitPrice.toString())

  if (input.productBaseDiscountPrice)
    formData.append("productBaseDiscountPrice", input.productBaseDiscountPrice.toString())
  
  if (input.productBaseDiscountStartDate)
    formData.append("productBaseDiscountStartDate", input.productBaseDiscountStartDate.toISOString())

  if (input.productBaseDiscountEndDate)
    formData.append("productBaseDiscountEndDate", input.productBaseDiscountEndDate.toISOString())

  if (input.isDiscount) 
    formData.append("isDiscount", input.isDiscount.toString())

  if (input.isPublic) 
    formData.append("isPublic", input.isPublic.toString())

  formData.append("category", input.category.toString())

}
