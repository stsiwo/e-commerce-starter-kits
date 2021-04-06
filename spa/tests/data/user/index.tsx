import { UserPhoneType, UserAddressType } from "domain/user/types";
import { UserType, UserTypeEnum } from "src/app";

export const testGuestUser: UserType = {
  firstName: "Satoshi",
  lastName: "Iwao",
  avatarImagePath: "",
  email: "",
  userType: UserTypeEnum.GUEST
}

export const testMemberUser: UserType = {
  firstName: "Satoshi",
  lastName: "Iwao",
  avatarImagePath: "",
  email: "satoshi@gmail.com",
  userType: UserTypeEnum.MEMBER
}

export const testAdminUser: UserType = {
  firstName: "Satoshi",
  lastName: "Iwao",
  avatarImagePath: "",
  email: "",
  userType: UserTypeEnum.ADMIN
}



export const testPhoneList: UserPhoneType[] = [
  {
    phoneId: "1",
    phone: "102938402938",
    countryCode: "+1",
  },
  {
    phoneId: "2",
    phone: "198374928338",
    countryCode: "+18",
  },
  {
    phoneId: "3",
    phone: "809842093480",
    countryCode: "+22",
  }
]

export const testAddressList: UserAddressType[] = [
  {
    addressId: "1",
    address1: "4362 ATLIN ST",
    address2: "Room 435",
    city: "Vancouver",
    province: "BC",
    country: "Canada",
    postalCode: "v5r 2c2",
  },
  {
    addressId: "2",
    address1: "4362 ATLIN ST",
    address2: "Room 435",
    city: "Vancouver",
    province: "BC",
    country: "Canada",
    postalCode: "v5r 2c2",
  },
  {
    addressId: "3",
    address1: "4362 ATLIN ST",
    address2: "Room 435",
    city: "Vancouver",
    province: "BC",
    country: "Canada",
    postalCode: "v5r 2c2",
  },
]
