import { PaginatedResponse } from "./response";

export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "cancelled"
  | "expired"
  | string;

export type ShippingStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | string;

export interface PaymentGateway {
  id: number;
  title: string;
  badge: string | null;
  description: string | null;
  min_amount: number | null;
  max_amount: number | null;
}

export interface OrderAddress {
  id: number;
  title: string;
  recipient_name: string;
  phone: string;
  province: number;
  city: number;
  postal_code: string;
  address_line: string;
}

export interface OrderItem {
  sku: string;
  product_title: string;
  size: string;
  quantity: number;
  price: number;
}

export interface Order {
  token: string;
  order_number: string;
  status: OrderStatus;
  shipping_status: ShippingStatus;
  subtotal_amount: number;
  shipping_amount: number;
  discount_amount: number;
  total_amount: number;
  tracking_code: string | null;
  shipping_company: string | null;
  customer_note: string;
  expires_at: string | null;
  paid_at: string | null;
  is_payable: boolean;
  is_expired: boolean;
  created_at: string;
  address: OrderAddress;
  items: OrderItem[];
}

export interface CreateOrderRequest {
  address_id: number;
  customer_note: string;
}

export interface PayOrderRequest {
  gateway_id: number;
}

export interface PayOrderResponse {
  redirect_url: string;
}

export interface ApiError {
  status: number;
  message: string;
  code?: string;
  fieldErrors?: Record<string, string[]>;
}

export type OrdersListResponse = PaginatedResponse<Order>