import * as yup from 'yup';
import { get2AlphaCountryCodeRegex, getProvinceList } from 'src/utils';

/**
 * note:
 *
 *  - if props are optional and might have null value, use 'nullable()'
 *
 *  - to access another property from a property validation, 
 *
 *    - use regular function 'function' not arrow function (e.g.,  () => ) in order to use 'this' inside the function.
 *      - the arrow function does not have 'binding' so you cannot use 'this' if you use arrow function.
 *
 *    - use 'this.parent' to access another field value.
 *      - 'yup.ref()' does not work as you expected.
 *
 **/

export const userAccountSchema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().required().email(),
  /**
   * password.
   * 
   * - conditional required password and confirm: if password/confirm is null, it is optional
   *
   * - following rules:
   *   - min 8
   *   - at least one lowercase and uppercase
   *   - no space
   *
   **/
  password: yup.lazy((value) => value ? yup.string().min(8, "password must be at least 8 characters").matches(/^(?=.*[A-Z])(?=.*[a-z])(?!=\s+)[A-Za-z\d@$!%*#?&_]{8,}$/, "cannot include space and must include at least one upper case and lowercase char.").required("password is required") : yup.string().notRequired()),
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
  phoneNumber: yup.string().matches(/^[0-9]{10}$/, "invalid format. please enter only number (no '-', '(', ')')").required(),
  countryCode: yup.string().matches(/^(\+?\d{1,3}|\\d{1,4})$/, "invalid format. proper format: '+1', '+12'").required(),
})

export const userActiveStatusAccountSchema = yup.object().shape({
  active: yup.string().required(),
  activeNote: yup.string().optional(),
})

export const userAccountAddressSchema = yup.object().shape({
  address1: yup.string().required(),
  address2: yup.string().optional().nullable(),
  city: yup.string().required(),
  province: yup.string().test(
    'province-list-contain',
    'province does not exist.',
    /** 
     * ref: https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object 
     * - the first file object exists and not empty object
     **/
    (value) => {
      const provinceList = getProvinceList();
      return provinceList.indexOf(value) !== -1 ? true : false;
    }
  ).required(),
  country: yup.string().matches(get2AlphaCountryCodeRegex()).required(),
  postalCode: yup.string().matches(/^(?!.*[DFIOQU])[A-VXY][0-9][A-Z] ?[0-9][A-Z][0-9]$/, "invalid format. proper format: 'A1A 2B2'").required(),
})

export const adminLoginSchema = yup.object().shape({
  email: yup.string().required().email(),
  password: yup.string().min(8, "password must be at least 8 characters").matches(/^(?=.*[A-Z])(?=.*[a-z])(?!=\s+)[A-Za-z\d@$!%*#?&_]{8,}$/, "cannot include space and must include at least one upper case and lowercase char.").required("password is required"),
})

export const memberSignupSchema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().required().email(),
  password: yup.string().min(8, "password must be at least 8 characters").matches(/^(?=.*[A-Z])(?=.*[a-z])(?!=\s+)[A-Za-z\d@$!%*#?&_]{8,}$/, "cannot include space and must include at least one upper case and lowercase char.").required("password is required"),
  confirm: yup.string().required().oneOf([yup.ref('password'), null], "password must match")
})

export const memberLoginSchema = yup.object().shape({
  email: yup.string().required().email(),
  password: yup.string().min(8, "password must be at least 8 characters").matches(/^(?=.*[A-Z])(?=.*[a-z])(?!=\s+)[A-Za-z\d@$!%*#?&_]{8,}$/, "cannot include space and must include at least one upper case and lowercase char.").required("password is required"),
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
  variantUnitPrice: yup.string().matches(/^(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/, "invalid currency format. please enter currency (e.g., 3.12, 12.00, and so on)").optional().nullable(),
  variantDiscountPrice: yup.string().matches(/^(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/, "invalid currency format. please enter currency (e.g., 3.12, 12.00, and so on)").optional().nullable(),
  variantDiscountStartDate: yup.date().max(yup.ref('variantDiscountEndDate'), "start date must be before the end date.").required(),
  variantDiscountEndDate: yup.date().min(yup.ref('variantDiscountStartDate'), "end date must be after the start date.").required(),
  variantStock: yup.number().min(0).required(),
  isDiscount: yup.bool().optional().nullable(),
  note: yup.string().optional().nullable(),
  variantWeight: yup.string().matches(/^(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,3})?$/, "invalid kg format. please enter currency (e.g., 3.120, 12.000, and so on)").required(),
  variantHeight: yup.string().matches(/^(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,3})?$/, "invalid cm format. please enter currency (e.g., 3.120, 12.000, and so on)").required(),
  variantLength: yup.string().matches(/^(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,3})?$/, "invalid cm format. please enter currency (e.g., 3.120, 12.000, and so on)").required(),
  variantWidth: yup.string().matches(/^(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,3})?$/, "invalid cm format. please enter currency (e.g., 3.120, 12.000, and so on)").required(),
})

export const productSchema = yup.object().shape({
  productName: yup.string().required(),
  productDescription: yup.string().required(),
  productPath: yup.string().matches(/^[a-zA-Z0-9-_]*$/, "only alphabetics, numbers, underscore (_) and hyphen (-) are availble.").required(),
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
  releaseDate: yup.date().default(() => new Date()).required().nullable(),
  isPublic: yup.bool().test(
    'has-at-least-one-varaint',
    'Oops. you need to have at least one variant. come back here after you create variants.',
    function(value) {
      /**
       * be careful this 'value' is string which contains 'true'/'false' as string so you need to convert it to boolean first.
       *  -> you need to use 'bool()'. don't use 'string()' for boolean variable.
       **/
      const isPublic = value
      if (isPublic) {
        const variants = this.parent.variants; 
        if (!variants) {
          return false;
        }
        if (variants.length == 0) {
          return false;
        }
      }
      return true
    }
  ).test(
    'must-be-after-release-date',
    "Oops. need to be after release date to publish this product. Don't worry, we automatically publish this product at the release date.",
    function(value) {
      /**
       * be careful this 'value' is string which contains 'true'/'false' as string so you need to convert it to boolean first.
       *
       *  -> you need to use 'bool()'. don't use 'string()' for boolean variable.
       **/
      const isPublic = value
      if (isPublic) {
        const releaseDate = this.parent.releaseDate 
        const curDate = new Date()
        return curDate.getDate() >= (releaseDate as unknown as Date).getDate()
      }
      return true
    }
  ),
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
  categoryPath: yup.string().matches(/^[a-zA-Z0-9-_]*$/, "only alphabetics, numbers, underscore (_) and hyphen (-) are availble.").required(),
})

// reviews
export const reviewSchema = yup.object().shape({
  reviewPoint: yup.number().min(0).max(5).required(),
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
  phoneNumber: yup.string().matches(/^[0-9]{10}$/, "invalid format. please enter only number (no '-', '(', ')')").required(),
  countryCode: yup.string().matches(/^(\+?\d{1,3}|\\d{1,4})$/, "invalid format. proper format: '+1', '+12'").required(),
  address1: yup.string().required(),
  address2: yup.string().optional().nullable(),
  city: yup.string().required(),
  province: yup.string().test(
    'province-list-contain',
    'province does not exist. please choose from available option.',
    /** 
     * ref: https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object 
     * - the first file object exists and not empty object
     **/
    (value) => {
      const provinceList = getProvinceList();
      console.log(value);
      return provinceList.indexOf(value) !== -1 ? true : false;
    }
  ).required(),
  country: yup.string().matches(get2AlphaCountryCodeRegex(), "invalid country format. please choose from available option.").required(),
  postalCode: yup.string().matches(/^(?!.*[DFIOQU])[A-VXY][0-9][A-Z] ?[0-9][A-Z][0-9]$/, "invalid format. proper format: 'A1A 2B2'").required(),
})

// forgot password 
export const forgotPasswordSchema = yup.object().shape({
  email: yup.string().required().email(),
})

// reset password
export const resetPasswordSchema = yup.object().shape({
  password: yup.string().min(8, "password must be at least 8 characters").matches(/^(?=.*[A-Z])(?=.*[a-z])(?!=\s+)[A-Za-z\d@$!%*#?&_]{8,}$/, "cannot include space and must include at least one upper case and lowercase char.").required("password is required"),
  confirm: yup.string().required().oneOf([yup.ref('password'), null], "password must match")
})

