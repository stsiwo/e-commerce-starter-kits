import {
  guestUserType,
  UserActiveEnum,
  UserAddressType,
  UserPhoneType,
  UserType,
} from "domain/user/types";
import { UserTypeEnum } from "src/app";

export const testPhoneList: UserPhoneType[] = [
  {
    phoneId: "1",
    phoneNumber: "102938402938",
    countryCode: "+1",
    isSelected: false,
    version: null,
  },
  {
    phoneId: "2",
    phoneNumber: "198374928338",
    countryCode: "+18",
    isSelected: false,
    version: null,
  },
  {
    phoneId: "3",
    phoneNumber: "809842093480",
    countryCode: "+22",
    isSelected: false,
    version: null,
  },
];

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
    version: null,
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
    version: null,
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
    version: null,
  },
];

export const testGuestUser: UserType = {
  firstName: "Satoshi",
  lastName: "Iwao",
  avatarImagePath: "",
  active: UserActiveEnum.TEMP,
  email: "",
  userType: guestUserType,
  addresses: [],
  orders: [],
  reviews: [],
  phones: [],
  cartItems: [],
  version: null,
};

export const testMemberUser: UserType = {
  userId: TEST_MEMBER_USER_ID,
  firstName: "Satoshi",
  lastName: "Iwao",
  avatarImagePath: "",
  email: TEST_MEMBER_EMAIL,
  active: UserActiveEnum.TEMP,
  userType: {
    userTypeId: "2",
    userType: UserTypeEnum.MEMBER,
  },
  addresses: testAddressList,
  phones: testPhoneList,
  orders: [],
  reviews: [],
  cartItems: [],
  version: null,
};

export const testAdminUser: UserType = {
  userId: TEST_ADMIN_USER_ID,
  firstName: "Satoshi",
  lastName: "Iwao",
  avatarImagePath: "",
  active: UserActiveEnum.TEMP,
  email: TEST_ADMIN_EMAIL,
  userType: {
    userTypeId: "1",
    userType: UserTypeEnum.ADMIN,
  },
  addresses: [],
  phones: [],
  orders: [],
  reviews: [],
  cartItems: [],
  version: null,
};
