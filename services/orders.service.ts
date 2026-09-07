import type { Order, OrdersListResponse, PaymentGateway, PayOrderResponse } from "@/types/checkout";
import { apiRequest } from "@/lib/api-client";



export async function createOrders(
  addressId: number,
  customerNote: string,
): Promise<Order> {
  return apiRequest<Order>("/api/orders", {
    method: "POST",
    body: JSON.stringify({
      address_id: addressId,
      customer_note: customerNote,
    }),
  });
}

export async function getOrders(status?: string): Promise<OrdersListResponse> {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  const query = params.toString();
  return apiRequest<OrdersListResponse>(`/api/orders${query ? `?${query}` : ""}`);
}

export async function getOrder(token: string): Promise<Order> {
  return apiRequest<Order>(`/api/orders/${token}`);
}

export async function updateOrderAddress(
  token: string,
  addressId: number,
): Promise<Order> {
  return apiRequest<Order>(`/api/orders/${token}/address`, {
    method: "PATCH",
    body: JSON.stringify({ address_id: addressId }),
  });
}

export async function cancelOrder(token: string): Promise<Order> {
  return apiRequest<Order>(`/api/orders/${token}/cancel`, {
    method: "POST",
  });
}

export async function addOrderItem(
  token: string,
  sku: string,
  quantity: number,
): Promise<Order> {
  return apiRequest<Order>(`/api/orders/${token}/items`, {
    method: "POST",
    body: JSON.stringify({ sku, quantity }),
  });
}

export async function updateOrderItem(
  token: string,
  itemId: string,
  quantity: number,
): Promise<Order> {
  return apiRequest<Order>(`/api/orders/${token}/items/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
}

export async function removeOrderItem(
  token: string,
  itemId: string,
): Promise<Order> {
  return apiRequest<Order>(`/api/orders/${token}/items/${itemId}`, {
    method: "DELETE",
  });
}

export async function getPaymentGateways(): Promise<PaymentGateway[]> {
  return apiRequest<PaymentGateway[]>("/api/checkout/gateways");
}

export async function payOrder(
  token: string,
  gatewayId: number,
): Promise<PayOrderResponse> {
  return apiRequest<PayOrderResponse>(`/api/orders/${token}/pay`, {
    method: "POST",
    body: JSON.stringify({ gateway_id: gatewayId }),
  });
}