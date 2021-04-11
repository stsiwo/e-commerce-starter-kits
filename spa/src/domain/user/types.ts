import { UserTypeEnum } from "src/app";
import { ReviewType } from "domain/review/type";
import { OrderType } from "domain/order/types";

export declare type UserPhoneType = {
  phoneId: string
  phone: string
  countryCode: string
}

export declare type UserAddressType = {
  addressId: string
  address1: string
  address2: string
  city: string
  province: string
  country: string
  postalCode: string
}

export declare type UserType = {
  firstName: string
  lastName: string
  email: string
  avatarImagePath: string 
  addresses?: UserAddressType[]
  phones?: UserPhoneType[]
  userType?: UserTypeEnum
  reviews?: ReviewType[]
  orders?: OrderType[]
}

// empty

// state 
export const defaultUser: UserType = {
  firstName: "",
  lastName: "",
  email: "",
  avatarImagePath:"",
  addresses: [],
  phones: [],
  reviews: [], 
  orders: [],
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
