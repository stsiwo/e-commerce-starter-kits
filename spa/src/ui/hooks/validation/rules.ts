import * as yup from 'yup';

export const userAccountSchema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().required().email(),
  /**
   * conditional required password and confirm: if password/confirm is null, it is optional
   **/
  password: yup.lazy((value) => value ? yup.string().min(4, "password must be at least 4 characters").required("password is required") : yup.string().notRequired()), 
  confirm: yup.lazy((cf) => {
      return yup.string().when('password', {
        is: (pw: string) => pw || (!pw && cf),
        then: yup.string().oneOf([yup.ref('password'), null], 'confirm must match with password'),
        otherwise: yup.string().notRequired()
      })
    })
  
  //yup.string().oneOf([yup.ref('password'), null], "password must match")
})


export const userAccountPhoneSchema = yup.object().shape({
  phone: yup.string().required(),
  countryCode: yup.string().required(),
})

export const userAccountAddressSchema = yup.object().shape({
  address1: yup.string().required(),
  address2: yup.string().optional(),
  city: yup.string().required(),
  province: yup.string().required(),
  country: yup.string().required(),
  postalCode: yup.string().required(),
})

export const adminLoginSchema = yup.object().shape({
  email: yup.string().required().email(),
  password: yup.string().required(),
})

export const memberSignupSchema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().required().email(),
  password: yup.string().required(),
  confirm: yup.string().required().oneOf([yup.ref('password'), null], "password must match")
})

export const memberLoginSchema = yup.object().shape({
  email: yup.string().required().email(),
  password: yup.string().required(),
})

// products
export const productVariantSchema = yup.object().shape({
  variantSize: yup.object().required(),
  variantColor: yup.string().required(),
  variantUnitPrice: yup.string().optional(),
  variantDiscountPrice: yup.number().optional(),
  variantDiscountStartDate: yup.string().optional(),
  variantDiscountEndDate: yup.string().optional(),
  variantStock: yup.number().required(),
  isDiscount: yup.string().optional(),
  note: yup.string().optional().nullable(),
})

export const productSchema = yup.object().shape({
  productName: yup.string().required(),
  productDescription: yup.string().required(),
  productPath: yup.string().required(),
  productBaseUnitPrice: yup.string().required(),
  productBaseDiscountPrice: yup.string().required(),
  productBaseDiscountStartDate: yup.string().required(),
  productBaseDiscountEndDate: yup.string().required(),
  isDiscount: yup.string().required(),
  isPublic: yup.string().required(),
  releaseDate: yup.string().optional(),
  category: yup.object().required(),
  productVariants: yup.array().of(productVariantSchema),
  note: yup.string().optional().nullable(),
})

// categories
export const categorySchema = yup.object().shape({
  categoryName: yup.string().required(),
  categoryDescription: yup.string().required(),
  categoryPath: yup.string().required(),
})

// reviews
export const reviewSchema = yup.object().shape({
  reviewPoint: yup.number().required(),
  reviewTitle: yup.string().required(),
  reviewDescription: yup.string().required(),
  isVerified: yup.bool().required(),
  note: yup.string().optional(),
})
