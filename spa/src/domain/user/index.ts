import { UserPhoneType } from "./types";

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
