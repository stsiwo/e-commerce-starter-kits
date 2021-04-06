import { DomainPaginationType } from "states/types";

export enum FetchStatusEnum {
  INITIAL = "INITIAL",
  FETCHING = "FETCHING",
  FAILED = "FAILED",
  SUCCESS = "SUCCESS",
}

export declare type SortType = {
  key: string
  label: string
}

export type RequestTrackerBaseType = {
  ids: string[]
  pagination?: DomainPaginationType
}

export declare type RequestTrackerType  = {
  [key: string]: RequestTrackerBaseType
}

// TODO: jwt + cookie HttpOnly implmenetation
export enum UserTypeEnum {
  GUEST = "GUEST",
  MEMBER = "MEMBER",
  ADMIN = "ADMIN",
}

export declare type UserType = {
  firstName: string
  lastName: string
  email: string
  avatarImagePath: string 
  userType?: UserTypeEnum
}

export declare type AuthType = {
  isLoggedIn: boolean
  userType: UserTypeEnum
  user?: UserType
}
