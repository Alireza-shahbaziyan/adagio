import type { Address } from "@/types/address";

export function findDefault(addresses: Address[]) {
  return addresses.find(address => address.is_default) ?? null;
}