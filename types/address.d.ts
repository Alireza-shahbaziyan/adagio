export interface Address {
  id: number;
  title: string;
  recipient_name: string;
  phone: string;
  province: number;
  city: number;
  postal_code: string;
  address_line: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export type AddressPayload = Omit<Address, "id" | "created_at" | "updated_at">;
