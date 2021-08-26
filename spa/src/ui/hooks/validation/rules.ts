import {
  get2AlphaCountryCodeRegex,
  getProvinceList,
  isAfterOrEqualDateOf,
  isBeforeOrEqualDateOf,
  isValidDate,
} from "src/utils";
import * as yup from "yup";
import { logger } from "configs/logger";
const log = logger(__filename);

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
  firstName: yup
    .string()
    .test(
      "len",
      "must be less than or equal to 100",
      (val) => val.length <= 100
    )
    .required(),
  lastName: yup
    .string()
    .test(
      "len",
      "must be less than or equal to 100",
      (val) => val.length <= 100
    )
    .required(),
  email: yup
    .string()
    .test(
      "len",
      "must be less than or equal to 100",
      (val) => val.length <= 100
    )
    .required()
    .email(),
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
  password: yup.lazy((value) =>
    value
      ? yup
          .string()
          .test(
            "len",
            "must be less than or equal to 100",
            (val) => val.length <= 100
          )
          .min(8, "password must be at least 8 characters")
          .matches(
            /^(?=.*[A-Z])(?=.*[a-z])(?!=\s+)[A-Za-z\d@$!%*#?&_]{8,}$/,
            "cannot include space and must include at least one upper case and lowercase char."
          )
          .required("password is required")
      : yup.string().notRequired()
  ),
  confirm: yup.lazy((cf) => {
    return yup.string().when("password", {
      is: (pw: string) => pw || (!pw && cf),
      then: yup
        .string()
        .oneOf([yup.ref("password"), null], "confirm must match with password"),
      otherwise: yup.string().notRequired(),
    });
  }),

  //yup.string().oneOf([yup.ref('password'), null], "password must match")
});

export const userAccountPhoneSchema = yup.object().shape({
  phoneNumber: yup
    .string()
    .matches(
      /^[0-9]{10}$/,
      "invalid format. please enter only number (no '-', '(', ')')"
    )
    .required(),
  countryCode: yup
    .string()
    .matches(
      /^(\+?\d{1,3}|\\d{1,4})$/,
      "invalid format. proper format: '+1', '+12'"
    )
    .required(),
});

export const userActiveStatusAccountSchema = yup.object().shape({
  active: yup.string().required(),
  activeNote: yup
    .string()
    .test(
      "len",
      "must be less than or equal to 1000",
      (val) => val.length <= 1000
    )
    .optional(),
});

export const userAccountAddressSchema = yup.object().shape({
  address1: yup
    .string()
    .test(
      "len",
      "must be less than or equal to 100",
      (val) => val.length <= 100
    )
    .required(),
  address2: yup
    .string()
    .test(
      "len",
      "must be less than or equal to 100",
      (val) => val.length <= 100
    )
    .optional()
    .nullable(),
  city: yup
    .string()
    .test(
      "len",
      "must be less than or equal to 100",
      (val) => val.length <= 100
    )
    .required(),
  province: yup
    .string()
    .test(
      "province-list-contain",
      "province does not exist.",
      /**
       * ref: https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
       * - the first file object exists and not empty object
       **/
      (value) => {
        const provinceList = getProvinceList();
        return provinceList.indexOf(value) !== -1 ? true : false;
      }
    )
    .required(),
  country: yup.string().matches(get2AlphaCountryCodeRegex()).required(),
  postalCode: yup
    .string()
    .matches(
      /^(?!.*[DFIOQU])[A-VXY][0-9][A-Z] ?[0-9][A-Z][0-9]$/,
      "invalid format. proper format: 'A1A 2B2'"
    )
    .required(),
});

export const adminLoginSchema = yup.object().shape({
  email: yup
    .string()
    .test(
      "len",
      "must be less than or equal to 100",
      (val) => val.length <= 100
    )
    .required()
    .email(),
  password: yup
    .string()
    .test(
      "len",
      "must be less than or equal to 100",
      (val) => val.length <= 100
    )
    .min(8, "password must be at least 8 characters")
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?!=\s+)[A-Za-z\d@$!%*#?&_]{8,}$/,
      "cannot include space and must include at least one upper case and lowercase char."
    )
    .required("password is required"),
});

export const memberSignupSchema = yup.object().shape({
  firstName: yup
    .string()
    .test(
      "len",
      "must be less than or equal to 100",
      (val) => val.length <= 100
    )
    .required(),
  lastName: yup
    .string()
    .test(
      "len",
      "must be less than or equal to 100 chars",
      (val) => val.length <= 100
    )
    .required(),
  email: yup
    .string()
    .test(
      "len",
      "must be less than or equal to 100 chars",
      (val) => val.length <= 100
    )
    .required()
    .email(),
  password: yup
    .string()
    .test(
      "len",
      "must be less than or equal to 100 chars",
      (val) => val.length <= 100
    )
    .min(8, "password must be at least 8 characters")
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?!=\s+)[A-Za-z\d@$!%*#?&_]{8,}$/,
      "cannot include space and must include at least one upper case and lowercase char."
    )
    .required("password is required"),
  confirm: yup
    .string()
    .test(
      "len",
      "must be less than or equal to 100 chars",
      (val) => val.length <= 100
    )
    .required()
    .oneOf([yup.ref("password"), null], "password must match"),
});

export const memberLoginSchema = yup.object().shape({
  email: yup
    .string()
    .test(
      "len",
      "must be less than or equal to 100 chars",
      (val) => val.length <= 100
    )
    .required()
    .email(),
  password: yup
    .string()
    .test(
      "len",
      "must be less than or equal to 100 chars",
      (val) => val.length <= 100
    )
    .min(8, "password must be at least 8 characters")
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?!=\s+)[A-Za-z\d@$!%*#?&_]{8,}$/,
      "cannot include space and must include at least one upper case and lowercase char."
    )
    .required("password is required"),
});

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
  variantUnitPrice: yup
    .string()
    .matches(
      /^(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,
      "invalid currency format. please enter currency (e.g., 3.12, 12.00, and so on)"
    )
    .optional()
    .nullable(),
  variantDiscountPrice: yup
    .string()
    .test(
      "variant-discount-price-mandatory-if-discount",
      "variant discount price cannot be null.",
      function (value: string) {
        const isDiscount = this.parent.isDiscount;
        if (isDiscount) {
          if (!value) {
            return false;
          }
        }
        return true;
      }
    )
    .matches(
      /^(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,
      "invalid currency format. please enter currency (e.g., 3.12, 12.00, and so on)"
    )
    .optional()
    .nullable(),
  variantDiscountStartDate: yup
    .date()
    .test(
      "start-date-mandatory-if-discount",
      "please enter valid date.",
      function (value: Date) {
        const isDiscount = this.parent.isDiscount;
        log(value);
        if (isDiscount) {
          log("disocunt is enable so start date cannot be null");
          if (!isValidDate(value)) {
            log("invalid start dte");
            return false;
          }
          log("valid start dte");
        }
        return true;
      }
    )
    .test(
      "start-date-validator",
      "start date must be before or equal to the end date.",
      function (value: Date) {
        if (value) {
          const startDate = value;
          const endDate = this.parent.variantDiscountEndDate;
          if (isBeforeOrEqualDateOf(startDate, endDate)) {
            return true;
          } else {
            return false;
          }
        }
        return true;
      }
    )
    .optional()
    .nullable(),
  variantDiscountEndDate: yup
    .date()
    .test(
      "end-date-mandatory-if-discount",
      "please enter valid date.",
      function (value: Date) {
        const isDiscount = this.parent.isDiscount;
        log(value);
        if (isDiscount) {
          log("disocunt is enable so end date cannot be null");
          if (!isValidDate(value)) {
            return false;
          }
          log("valid end date");
        }
        return true;
      }
    )
    .test(
      "end-date-validator",
      "end date must be after or equal to the start date.",
      function (value: Date) {
        if (value) {
          const endDate = value;
          const startDate = this.parent.variantDiscountStartDate;
          if (isAfterOrEqualDateOf(endDate, startDate)) {
            return true;
          } else {
            return false;
          }
        }
        return true;
      }
    )
    .optional()
    .nullable(),
  variantStock: yup.number().min(0).required(),
  isDiscount: yup.bool().optional().nullable(),
  note: yup
    .string()
    .test(
      "len",
      "must be less than or equal to 10000 chars",
      (val) => val.length <= 10000
    )
    .optional()
    .nullable(),
  variantWeight: yup
    .string()
    .matches(
      /^(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,3})?$/,
      "invalid kg format. please enter currency (e.g., 3.120, 12.000, and so on)"
    )
    .test(
      "min-001",
      "weight must be greater than or equal to 0.01",
      function (value: string) {
        if (value) {
          const num: number = parseFloat(value);
          if (num < 0.01) {
            return false;
          }
        }
        return true;
      }
    )
    .required(),
  variantHeight: yup
    .string()
    .matches(
      /^(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,3})?$/,
      "invalid cm format. please enter currency (e.g., 3.120, 12.000, and so on)"
    )
    .test(
      "min-1-height",
      "height must be greater than or equal to 1.00",
      function (value: string) {
        if (value) {
          const num: number = parseFloat(value);
          if (num < 1.0) {
            return false;
          }
        }
        return true;
      }
    )
    .required(),
  variantLength: yup
    .string()
    .matches(
      /^(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,3})?$/,
      "invalid cm format. please enter currency (e.g., 3.120, 12.000, and so on)"
    )
    .test(
      "min-1-length",
      "height must be greater than or equal to 1.00",
      function (value: string) {
        if (value) {
          const num: number = parseFloat(value);
          if (num < 1.0) {
            return false;
          }
        }
        return true;
      }
    )
    .required(),
  variantWidth: yup
    .string()
    .matches(
      /^(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,3})?$/,
      "invalid cm format. please enter currency (e.g., 3.120, 12.000, and so on)"
    )
    .test(
      "min-1-width",
      "height must be greater than or equal to 1.00",
      function (value: string) {
        if (value) {
          const num: number = parseFloat(value);
          if (num < 1.0) {
            return false;
          }
        }
        return true;
      }
    )
    .required(),
});

export const productSchema = yup.object().shape({
  productName: yup
    .string()
    .test(
      "len",
      "must be less than or equal to 500 chars",
      (val) => val.length <= 500
    )
    .required(),
  productDescription: yup
    .string()
    .test(
      "len",
      "must be less than or equal to 10000 chars",
      (val) => val.length <= 10000
    )
    .required(),
  productBaseUnitPrice: yup
    .string()
    .matches(
      /^(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,
      "invalid currency format. please enter currency (e.g., 3.12, 12.00, and so on)"
    )
    .required(),
  productPath: yup
    .string()
    .test(
      "len",
      "must be less than or equal to 100 chars",
      (val) => val.length <= 100
    )
    .matches(
      /^[a-zA-Z0-9-_]*$/,
      "only alphabetics, numbers, underscore (_) and hyphen (-) are availble."
    )
    .required(),
  productImages: yup.array().test(
    "has-first-element",
    "the primary product image (1st image) is required.",
    /**
     * ref: https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
     * - the first file object exists and not empty object
     **/
    (value) => {
      log("product images");
      log(value);
      log("result");
      log(
        value[0] != null &&
          Object.keys(value[0]).length === 0 &&
          value[0].constructor === Object
      );
      return value[0].productImagePath != "";
    }
  ),
  releaseDate: yup
    .date()
    .default(() => new Date())
    .required()
    .nullable(),
  isPublic: yup
    .bool()
    .test(
      "has-at-least-one-varaint",
      "Oops. you need to have at least one variant. come back here after you create variants.",
      function (value) {
        /**
         * be careful this 'value' is string which contains 'true'/'false' as string so you need to convert it to boolean first.
         *  -> you need to use 'bool()'. don't use 'string()' for boolean variable.
         **/
        const isPublic = value;
        if (isPublic) {
          const variants = this.parent.variants;
          if (!variants) {
            return false;
          }
          if (variants.length == 0) {
            return false;
          }
        }
        return true;
      }
    )
    .test(
      "must-be-after-release-date",
      "Oops. need to be after release date to publish this product. Don't worry, we automatically publish this product at the release date.",
      function (value) {
        /**
         * be careful this 'value' is string which contains 'true'/'false' as string so you need to convert it to boolean first.
         *
         *  -> you need to use 'bool()'. don't use 'string()' for boolean variable.
         **/
        const isPublic = value;
        if (isPublic) {
          const releaseDate = this.parent.releaseDate;
          const curDate = new Date();
          return (
            curDate.getDate() >= (releaseDate as unknown as Date).getDate()
          );
        }
        return true;
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
  category: yup
    .object()
    .shape({
      categoryId: yup.string().required(),
    })
    .nullable(),
  productVariants: yup.array().of(productVariantSchema),
  note: yup
    .string()
    .test(
      "len",
      "must be less than or equal to 10000 chars",
      (val) => val.length <= 10000
    )
    .optional()
    .nullable(),
});

// categories
export const categorySchema = yup.object().shape({
  categoryName: yup
    .string()
    .test(
      "len",
      "must be less than or equal to 100 chars",
      (val) => val.length <= 100
    )
    .required(),
  categoryDescription: yup
    .string()
    .test(
      "len",
      "must be less than or equal to 10000 chars",
      (val) => val.length <= 10000
    )
    .required(),
  categoryPath: yup
    .string()
    .matches(
      /^[a-zA-Z0-9-_]*$/,
      "only alphabetics, numbers, underscore (_) and hyphen (-) are availble."
    )
    .required(),
});

// reviews
export const reviewSchema = yup.object().shape({
  reviewPoint: yup.number().min(0).max(5).required(),
  reviewTitle: yup
    .string()
    .test(
      "len",
      "must be less than or equal to 500 chars",
      (val) => val.length <= 500
    )
    .required(),
  reviewDescription: yup
    .string()
    .test(
      "len",
      "must be less than or equal to 10000 chars",
      (val) => val.length <= 10000
    )
    .required(),
  isVerified: yup.bool().required(),
  note: yup
    .string()
    .test(
      "len",
      "must be less than or equal to 10000 chars",
      (val) => val.length <= 10000
    )
    .optional()
    .nullable(),
});

// contact
export const contactSchema = yup.object().shape({
  firstName: yup
    .string()
    .test(
      "len",
      "must be less than or equal to 100 chars",
      (val) => val.length <= 100
    )
    .required(),
  lastName: yup
    .string()
    .test(
      "len",
      "must be less than or equal to 100 chars",
      (val) => val.length <= 100
    )
    .required(),
  email: yup
    .string()
    .test(
      "len",
      "must be less than or equal to 100 chars",
      (val) => val.length <= 100
    )
    .required()
    .email(),
  title: yup
    .string()
    .test(
      "len",
      "must be less than or equal to 500 chars",
      (val) => val.length <= 500
    )
    .required(),
  description: yup
    .string()
    .test(
      "len",
      "must be less than or equal to 10000 chars",
      (val) => val.length <= 10000
    )
    .required(),
});

// admin company
export const companySchema = yup.object().shape({
  companyName: yup
    .string()
    .test(
      "len",
      "must be less than or equal to 100 chars",
      (val) => val.length <= 100
    )
    .required(),
  companyDescription: yup
    .string()
    .test(
      "len",
      "must be less than or equal to 10000 chars",
      (val) => val.length <= 10000
    )
    .required(),
  companyEmail: yup
    .string()
    .test(
      "len",
      "must be less than or equal to 100 chars",
      (val) => val.length <= 100
    )
    .required()
    .email(),
  phoneNumber: yup
    .string()
    .matches(
      /^[0-9]{10}$/,
      "invalid format. please enter only number (no '-', '(', ')')"
    )
    .required(),
  countryCode: yup
    .string()
    .matches(
      /^(\+?\d{1,3}|\\d{1,4})$/,
      "invalid format. proper format: '+1', '+12'"
    )
    .required(),
  address1: yup
    .string()
    .test(
      "len",
      "must be less than or equal to 100 chars",
      (val) => val.length <= 100
    )
    .required(),
  address2: yup
    .string()
    .test(
      "len",
      "must be less than or equal to 100 chars",
      (val) => val.length <= 100
    )
    .optional()
    .nullable(),
  city: yup
    .string()
    .test(
      "len",
      "must be less than or equal to 100 chars",
      (val) => val.length <= 100
    )
    .required(),
  province: yup
    .string()
    .test(
      "province-list-contain",
      "province does not exist. please choose from available option.",
      /**
       * ref: https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
       * - the first file object exists and not empty object
       **/
      (value) => {
        const provinceList = getProvinceList();
        log(value);
        return provinceList.indexOf(value) !== -1 ? true : false;
      }
    )
    .required(),
  country: yup
    .string()
    .matches(
      get2AlphaCountryCodeRegex(),
      "invalid country format. please choose from available option."
    )
    .required(),
  postalCode: yup
    .string()
    .matches(
      /^(?!.*[DFIOQU])[A-VXY][0-9][A-Z] ?[0-9][A-Z][0-9]$/,
      "invalid format. proper format: 'A1A 2B2'"
    )
    .required(),
  facebookLink: yup
    .string()
    .test(
      "len",
      "must be less than or equal to 100 chars",
      (val) => val.length <= 100
    )
    .matches(
      /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
      "invalid url."
    )
    .optional(),
  instagramLink: yup
    .string()
    .test(
      "len",
      "must be less than or equal to 100 chars",
      (val) => val.length <= 100
    )
    .matches(
      /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
      "invalid url."
    )
    .optional(),
  twitterLink: yup
    .string()
    .test(
      "len",
      "must be less than or equal to 100 chars",
      (val) => val.length <= 100
    )
    .matches(
      /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
      "invalid url."
    )
    .optional(),
  youtubeLink: yup
    .string()
    .test(
      "len",
      "must be less than or equal to 100 chars",
      (val) => val.length <= 100
    )
    .matches(
      /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
      "invalid url."
    )
    .optional(),
});

// forgot password
export const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .test(
      "len",
      "must be less than or equal to 100 chars",
      (val) => val.length <= 100
    )
    .required()
    .email(),
});

// reset password
export const resetPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .test(
      "len",
      "must be less than or equal to 100 chars",
      (val) => val.length <= 100
    )
    .min(8, "password must be at least 8 characters")
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?!=\s+)[A-Za-z\d@$!%*#?&_]{8,}$/,
      "cannot include space and must include at least one upper case and lowercase char."
    )
    .required("password is required"),
  confirm: yup
    .string()
    .test(
      "len",
      "must be less than or equal to 100 chars",
      (val) => val.length <= 100
    )
    .required()
    .oneOf([yup.ref("password"), null], "password must match"),
});
