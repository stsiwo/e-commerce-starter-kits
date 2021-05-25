import * as yup from 'yup';

/**
 * note:
 *
 *  - if props are optional and might have null value, use 'nullable()'
 *
 **/

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
  phoneNumber: yup.string().required(),
  countryCode: yup.string().required(),
})

export const userAccountAddressSchema = yup.object().shape({
  address1: yup.string().required(),
  address2: yup.string().optional().nullable(),
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
  /**
   * product size object validation not working.
   *
   * always complains about 'final value is null'....
   *
   * for now, make this nullable.
   *
   **/
  productSize: yup.object().nullable(),
  variantColor: yup.string().required(),
  variantUnitPrice: yup.string().optional().nullable(),
  variantDiscountPrice: yup.number().optional().nullable(),
  variantDiscountStartDate: yup.string().optional().nullable(),
  variantDiscountEndDate: yup.string().optional().nullable(),
  variantStock: yup.number().required(),
  isDiscount: yup.string().optional().nullable(),
  note: yup.string().optional().nullable(),
  variantWeight: yup.number().required(),
  variantHeight: yup.number().required(),
  variantLength: yup.number().required(),
  variantWidth: yup.number().required(),
})

export const productSchema = yup.object().shape({
  productName: yup.string().required(),
  productDescription: yup.string().required(),
  productPath: yup.string().required(),
  productImages: yup.array().test(
    'has-first-element', 
    'the primary product image (1st image) is required.',
    /** 
     * ref: https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object 
     * - the first file object exists and not empty object
     **/
    (value) => {
      console.log("product images")
      console.log(value)
      console.log("result")
      console.log(value[0] != null && Object.keys(value[0]).length === 0 && value[0].constructor === Object)
      return value[0].productImagePath != ""
    }
  ),
  productBaseUnitPrice: yup.string().required(),
  productBaseDiscountPrice: yup.string().required(),
  productBaseDiscountStartDate: yup.string().required(),
  productBaseDiscountEndDate: yup.string().required(),
  isDiscount: yup.string().required(),
  isPublic: yup.string().test(
    'has-at-least-one-varaint',
    'Oops. you need to have at least one variant. come back here after you create variants.',
    (value) => {
      /**
       * be careful this 'value' is string which contains 'true'/'false' as string so you need to convert it to boolean first.
       **/
      const isPublic = (value === 'true');
      if (isPublic) {
        const variants = yup.ref("productVariants")
        return variants && (variants as unknown as any[]).length > 0
      }
      return true
    }
  ),
  releaseDate: yup.string().optional().nullable(),
  /**
   * cateogry object validation not working.
   *
   * always complains about 'final value is null'....
   *
   * for now, make this nullable.
   *
   **/
  category: yup.object().shape({
    categoryId: yup.string().required() 
  }).nullable(),
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
  note: yup.string().optional().nullable(),
})

// contact 
export const contactSchema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().required().email(),
  title: yup.string().required(),
  description: yup.string().required(),
})

// admin company
export const companySchema = yup.object().shape({
  companyName: yup.string().required(),
  companyDescription: yup.string().required(),
  companyEmail: yup.string().required().email(),
  phoneNumber: yup.string().required(),
  countryCode: yup.string().required(),
  address1: yup.string().required(),
  address2: yup.string().optional().nullable(),
  city: yup.string().required(),
  province: yup.string().required(),
  country: yup.string().required(),
  postalCode: yup.string().required(),
})

// forgot password 
export const forgotPasswordSchema = yup.object().shape({
  email: yup.string().required().email(),
})

// reset password
export const resetPasswordSchema = yup.object().shape({
  password: yup.string().required(),
  confirm: yup.string().required().oneOf([yup.ref('password'), null], "password must match")
})

