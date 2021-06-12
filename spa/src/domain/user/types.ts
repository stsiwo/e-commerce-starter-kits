import { UserTypeEnum } from "src/app";
import { ReviewType } from "domain/review/type";
import { OrderType } from "domain/order/types";
import { CartItemType } from "domain/cart/types";
import { getNanoId } from "src/utils";

export enum UserActiveEnum {
  TEMP = "TEMP",
  ACTIVE = "ACTIVE",
  BLACKLIST = "BLACKLIST",
  CUSTOMER_DELETED = "CUSTOMER_DELETED",
}

export declare type UserActiveLabelListType = {
  [key in UserActiveEnum]: string
}

export const userActiveLabelList: UserActiveLabelListType = {
  [UserActiveEnum.TEMP]: "Temporary (Not Email Verified)",
  [UserActiveEnum.ACTIVE]: "Active (Email Verified)",
  [UserActiveEnum.BLACKLIST]: "Blacklist",
  [UserActiveEnum.CUSTOMER_DELETED]: "Deleted By Customer",
}

export declare type UserPhoneType = {
  phoneId?: string
  phoneNumber: string
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

export declare type AdminCompanyType = {
  companyId: string
  companyName: string
  companyDescription: string
  companyEmail: string
  phoneNumber: string
  countryCode: string
  address1: string
  address2: string
  city: string
  province: string
  country: string
  postalCode: string
}

export declare type UserTypeType = {
  userTypeId?: string,
  userType: UserTypeEnum,
}

export const guestUserType : UserTypeType = {
  userType: UserTypeEnum.GUEST
}

export declare type UserType = {
  userId?: string
  firstName: string
  lastName: string
  email: string
  active: UserActiveEnum
  activeNote?: string
  avatarImagePath: string
  addresses: UserAddressType[]
  phones: UserPhoneType[]
  userType: UserTypeType
  reviews: ReviewType[]
  orders: OrderType[]
  cartItems: CartItemType[]
  companies?: AdminCompanyType[]
}

// criteira
export declare type UserCriteria = {
  userId?: string
  firstName: string
  lastName: string
  email: string
  password?: string
}

export declare type UserPhoneCriteria = {
  phoneId?: string
  isSelected: boolean
  phoneNumber: string
  countryCode: string
}

export declare type UserAddressCriteria = {
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

export declare type UserCompanyCriteria = {
  companyId: string
  companyName: string
  companyDescription: string
  companyEmail: string
  phoneNumber: string
  countryCode: string
  address1: string
  address2: string
  city: string
  province: string
  country: string
  postalCode: string
}

// empty

// state 
export const defaultUser: UserType = {
  firstName: "",
  lastName: "",
  email: "",
  avatarImagePath: "",
  active: UserActiveEnum.TEMP,
  activeNote: "",
  addresses: [],
  phones: [],
  reviews: [],
  orders: [],
  cartItems: [],
  userType: guestUserType, 
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

// customer status
export declare type UserStatusAccountDataType = {
  active: UserActiveEnum
  activeNote: string
}

export declare type UserStatusAccountValidationDataType = {
  active: string
  activeNote: string
}

export const defaultUserStatusAccountData = {
  active: UserActiveEnum.TEMP,
  activeNote: "",
}

export const defaultUserStatusAccountValidationData = {
  active: "",
  activeNote: "",
}

export declare type UserStatusCriteria = {
  active: string
  activeNote: string
  userId: string
}

// customer phone
export declare type CustomerPhonesFormDataType = {
  phoneId?: string
  phoneNumber: string
  countryCode: string
  isSelected: boolean
}

export const generateDefaultCustomerPhonesFormData: () => CustomerPhonesFormDataType = () => {
  return {
    phoneId: getNanoId(),
    phoneNumber: "",
    countryCode: "",
    isSelected: false,
  }
}

export declare type CustomerPhonesFormValidationDataType = {
  phoneId?: string
  phoneNumber?: string
  countryCode?: string
  isSelected?: string
}

export const defaultUserAccountValidationPhoneData: CustomerPhonesFormValidationDataType = {
  phoneId: "",
  phoneNumber: "",
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

// admin company form
export declare type AdminCompanyFormDataType = {
  companyId: string
  companyName: string
  companyDescription: string
  companyEmail: string
  phoneNumber: string
  countryCode: string
  address1: string
  address2: string
  city: string
  province: string
  country: string
  postalCode: string
}

export const generateDefaultAdminCompanyFormData: () => AdminCompanyFormDataType = () => {
  return {
    companyId: getNanoId(),
    companyName: "",
    companyDescription: "",
    companyEmail: "",
    phoneNumber: "",
    countryCode: "",
    address1: "",
    address2: "",
    city: "",
    province: "",
    country: "",
    postalCode: "",
  }
}

export declare type AdminCompanyFormValidationDataType = {
  companyName: string,
  companyDescription: string,
  companyEmail: string,
  phoneNumber: string,
  countryCode: string,
  address1: string,
  address2: string,
  city: string,
  province: string,
  country: string,
  postalCode: string,
}

export const defaultAdminCompanyFormValidationData: AdminCompanyFormValidationDataType = {
  companyName: "",
  companyDescription: "",
  companyEmail: "",
  phoneNumber: "",
  countryCode: "",
  address1: "",
  address2: "",
  city: "",
  province: "",
  country: "",
  postalCode: "",
}

// sort
export enum UserSortEnum {
  DATE_DESC = "DATE_DESC",
  DATE_ASC = "DATE_ASC",
  NAME_ASC = "NAME_ASC",
  NAME_DESC = "NAME_DESC",
}
