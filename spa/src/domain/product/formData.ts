import { ProductCriteria } from "./types";

export const productFormDataGenerator = (input: ProductCriteria) => {

  const formData = new FormData();

  /**
   * extract 'productImageFiles' (e.g., array of File) and make the rest of data json string and send the two data as form data.
   *
   * 1. files: File[] (files)
   * 2. criteria: string (application/json)
   *
   **/

  // save files to form data
  const productImageFiles = input.productImageFiles;

  productImageFiles.forEach((file: File) => {
    formData.append("files", file)
  })

  // remove 'productImageFiles' from input
  delete input.productImageFiles

  // make the rest of data json and save it to form data

  /**
   * you need to make this file to prevent below error.
   *
   * Spring: 415: ContentType: application/octet-stream is not supported.
   *
   **/
  formData.append("criteria", new Blob([JSON.stringify(input)], { type: 'application/json' }));
  
  return formData
}
