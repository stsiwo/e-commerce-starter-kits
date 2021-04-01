import * as yup from 'yup';

export const userAccountSchema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().required().email(),
  password: yup.string().required(),
  confirm: yup.string().oneOf([yup.ref('password'), null], "password must match")
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

