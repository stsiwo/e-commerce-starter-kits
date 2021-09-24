import { UserAddressType, UserPhoneType, UserType } from "./types";

/**
 * user domain behaviors
 **/

export function findAddress(
  addresses: UserAddressType[],
  targetId: string
): UserAddressType {
  const primary = addresses.find(
    (address: UserAddressType) => address.addressId == targetId
  );
  return primary;
}

export function findPhone(
  phones: UserPhoneType[],
  targetId: string
): UserPhoneType {
  return phones.find((phone: UserPhoneType) => phone.phoneId == targetId);
}
export function getPrimaryPhone(phones: UserPhoneType[]): UserPhoneType {
  return phones.find((phone: UserPhoneType) => phone.isSelected);
}

export function getPrimaryPhoneId(phones: UserPhoneType[]): string {
  const primary = phones.find((phone: UserPhoneType) => phone.isSelected);

  if (!primary) return null;

  return primary.phoneId;
}

export function getShippingAddressId(addresses: UserAddressType[]): string {
  const primary = addresses.find(
    (address: UserAddressType) => address.isShippingAddress
  );

  if (!primary) return null;

  return primary.addressId;
}

export function getShippingAddress(
  addresses: UserAddressType[]
): UserAddressType {
  const primary = addresses.find(
    (address: UserAddressType) => address.isShippingAddress
  );

  if (!primary) return null;

  return primary;
}

export function getBillingAddressId(addresses: UserAddressType[]): string {
  const primary = addresses.find(
    (address: UserAddressType) => address.isBillingAddress
  );

  if (!primary) return null;

  return primary.addressId;
}

export function getBillingAddress(
  addresses: UserAddressType[]
): UserAddressType {
  const primary = addresses.find(
    (address: UserAddressType) => address.isBillingAddress
  );

  if (!primary) return null;

  return primary;
}
export function toAddressString(address: UserAddressType): string {
  return `${address.address1} ${address.address2} ${address.city} ${address.province} ${address.country} ${address.postalCode}`;
}

export function toAddressStringWithNewLine(address: UserAddressType): string {
  return `${address.address1} ${address.address2}\n${address.city}, ${address.province} ${address.postalCode}\n${address.country}`;
}

export function toCompanyAddressStringWithNewLine(
  address1: string,
  address2: string,
  city: string,
  province: string,
  postalCode: string,
  country: string
): string {
  return `${address1} ${address2}<br />${city}, ${province} ${postalCode}<br />${country}`;
}

export function toPhoneString(phone: UserPhoneType): string {
  return `${phone.countryCode} ${phone.phoneNumber}`;
}

export function toPhoneStringWithoutSpace(phone: UserPhoneType): string {
  return `${phone.countryCode}${phone.phoneNumber}`;
}

export function toFullNameStringOfUser(user: UserType): string {
  return `${user.firstName} ${user.lastName}`;
}

export function toFullNameString(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`;
}
