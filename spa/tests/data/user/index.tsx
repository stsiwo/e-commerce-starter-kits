import { UserAddressType, UserPhoneType, UserType } from "domain/user/types";
import { UserTypeEnum } from "src/app";


export const testPhoneList: UserPhoneType[] = [
  {
    phoneId: "1",
    phone: "102938402938",
    countryCode: "+1",
    isSelected: false,
  },
  {
    phoneId: "2",
    phone: "198374928338",
    countryCode: "+18",
    isSelected: false,
  },
  {
    phoneId: "3",
    phone: "809842093480",
    countryCode: "+22",
    isSelected: false,
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
    isBillingAddress: false,
    isShippingAddress: false,
  },
  {
    addressId: "2",
    address1: "4362 ATLIN ST",
    address2: "Room 435",
    city: "Vancouver",
    province: "BC",
    country: "Canada",
    postalCode: "v5r 2c2",
    isBillingAddress: false,
    isShippingAddress: false,
  },
  {
    addressId: "3",
    address1: "4362 ATLIN ST",
    address2: "Room 435",
    city: "Vancouver",
    province: "BC",
    country: "Canada",
    postalCode: "v5r 2c2",
    isBillingAddress: false,
    isShippingAddress: false,
  },
]

export const testGuestUser: UserType = {
  firstName: "Satoshi",
  lastName: "Iwao",
  avatarImagePath: "",
  email: "",
  userType: UserTypeEnum.GUEST,
  addresses: [],
  orders: [],
  reviews: [],
  phones: [],
  cartItems: []
}

export const testMemberUser: UserType = {
  firstName: "Satoshi",
  lastName: "Iwao",
  avatarImagePath: "",
  email: "satoshi@gmail.com",
  userType: UserTypeEnum.MEMBER,
  addresses: testAddressList,
  phones: testPhoneList,
  orders: [],
  reviews: [],
  cartItems: []
}

export const testAdminUser: UserType = {
  firstName: "Satoshi",
  lastName: "Iwao",
  avatarImagePath: "",
  email: "",
  userType: UserTypeEnum.ADMIN,
  addresses: [],
  phones: [],
  orders: [],
  reviews: [],
  cartItems: []
}


