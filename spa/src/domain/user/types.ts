import { UserTypeEnum } from "src/app";
import { ReviewType } from "domain/review/type";
import { OrderType } from "domain/order/types";
import { CartItemType } from "domain/cart/types";
import { getNanoId } from "src/utils";

export declare type UserPhoneType = {
  phoneId?: string
  phone: string
  countryCode: string
  isSelected: boolean
}

export declare type UserAddressType = {
  addressId?: string
  address1: string
  address2: string
  city: string
  province: string
  country: string
  postalCode: string
  isBillingAddress: boolean
  isShippingAddress: boolean
}

export declare type UserType = {
  userId?: string
  firstName: string
  lastName: string
  email: string
  avatarImagePath: string
  addresses: UserAddressType[]
  phones: UserPhoneType[]
  userType: UserTypeEnum
  reviews: ReviewType[]
  orders: OrderType[]
  cartItems: CartItemType[]
}

// empty

// state 
export const defaultUser: UserType = {
  firstName: "",
  lastName: "",
  email: "",
  avatarImagePath: "",
  addresses: [],
  phones: [],
  reviews: [],
  orders: [],
  cartItems: [],
  userType: UserTypeEnum.GUEST
}

// form & input 
export declare type UserBasicAccountDataType = {
  firstName: string
  lastName: string
  email: string
  password: string
  confirm: string
}

export declare type UserBasicAccountValidationDataType = {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
  confirm?: string
}

export const defaultUserBasicAccountData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirm: ""
}

export const defaultUserBasicAccountValidationData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirm: ""
}

// customer phone
export declare type CustomerPhonesFormDataType = {
  phoneId?: string
  phone: string
  countryCode: string
  isSelected: boolean
}

export const generateDefaultCustomerPhonesFormData: () => CustomerPhonesFormDataType = () => {
  return {
    phoneId: getNanoId(),
    phone: "",
    countryCode: "",
    isSelected: false,
  }
}

export declare type CustomerPhonesFormValidationDataType = {
  phoneId?: string
  phone?: string
  countryCode?: string
  isSelected?: string
}

export const defaultUserAccountValidationPhoneData: CustomerPhonesFormValidationDataType = {
  phoneId: "",
  phone: "",
  countryCode: "",
  isSelected: "",
}

// customer address
export declare type CustomerAddressesFormDataType = {
  addressId?: string
  address1: string
  address2: string
  city: string
  province: string
  country: string
  postalCode: string
  isBillingAddress: boolean
  isShippingAddress: boolean
}

export const generateDefaultCustomerAddressesFormData: () => CustomerAddressesFormDataType = () => {
  return {
    addressId: getNanoId(),
    address1: "",
    address2: "",
    city: "",
    province: "",
    country: "",
    postalCode: "",
    isBillingAddress: false,
    isShippingAddress: false,
  }
}

export declare type CustomerAddressesFormValidationDataType = {
  addressId?: string
  address1?: string
  address2?: string
  city?: string
  province?: string
  country?: string
  postalCode?: string
}

export const defaultUserAccountValidationAddressData: CustomerAddressesFormValidationDataType = {
  address1: "",
  address2: "",
  city: "",
  province: "",
  country: "",
  postalCode: "",
}

// contact form
export declare type ContactFormDataType = {
  firstName: string
  lastName: string
  email: string
  title: string
  description: string
}

export const generateDefaultContactFormData: () => ContactFormDataType = () => {
  return {
    firstName: "",
    lastName: "",
    email: "",
    title: "",
    description: "",
  }
}

export declare type ContactFormValidationDataType = {
  firstName: string,
  lastName: string,
  email: string,
  title: string,
  description: string,
}

export const defaultContactFormValidationData: ContactFormValidationDataType = {
  firstName: "",
  lastName: "",
  email: "",
  title: "",
  description: "",
}
