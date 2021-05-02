import { UserPhoneType, UserAddressType } from "./types";

/**
 * user domain behaviors
 **/
export function getPrimaryPhone(phones: UserPhoneType[]): UserPhoneType {
  return phones.find((phone: UserPhoneType) => phone.isSelected)
}

export function getPrimaryPhoneId(phones: UserPhoneType[]): string {
  const primary = phones.find((phone: UserPhoneType) => phone.isSelected)

  if (!primary) return null

  return primary.phoneId;
}

export function getShippingAddressId(addresses: UserAddressType[]): string {
  const primary = addresses.find((address: UserAddressType) => address.isShippingAddress)

  if (!primary) return null

  return primary.addressId;
}

export function getBillingAddressId(addresses: UserAddressType[]): string {
  const primary = addresses.find((address: UserAddressType) => address.isBillingAddress)

  if (!primary) return null

  return primary.addressId;
}


