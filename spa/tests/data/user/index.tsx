import { UserPhoneType, UserAddressType } from "domain/user/types";

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
