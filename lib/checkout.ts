"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import {
  getOrders,
  getOrder,
  cancelOrder,
  updateOrderAddress,
  addOrderItem,
  updateOrderItem,
  removeOrderItem,
  getPaymentGateways,
  payOrder,
} from "@/services/orders.service";
import type { PaymentGateway } from "@/types/checkout";

export function useOrders(status?: string) {
  return useQuery({
    queryKey: [...queryKeys.orders, { status }],
    queryFn: () => getOrders(status),
  });
}

export function useOrder(token: string) {
  return useQuery({
    queryKey: queryKeys.order(token),
    queryFn: () => getOrder(token),
    enabled: !!token,
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (token: string) => cancelOrder(token),
    onSuccess: (_data, token) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders });
      queryClient.invalidateQueries({ queryKey: queryKeys.order(token) });
    },
  });
}

export function useUpdateOrderAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      token,
      address_id,
    }: {
      token: string;
      address_id: number;
    }) => updateOrderAddress(token, address_id),
    onSuccess: (_data, { token }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.order(token) });
    },
  });
}

export function useAddOrderItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      token,
      sku,
      quantity,
    }: {
      token: string;
      sku: string;
      quantity: number;
    }) => addOrderItem(token, sku, quantity),
    onSuccess: (_data, { token }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.order(token) });
    },
  });
}

export function useUpdateOrderItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      token,
      itemId,
      quantity,
    }: {
      token: string;
      itemId: string;
      quantity: number;
    }) => updateOrderItem(token, itemId, quantity),
    onSuccess: (_data, { token }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.order(token) });
    },
  });
}

export function useRemoveOrderItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ token, itemId }: { token: string; itemId: string }) =>
      removeOrderItem(token, itemId),
    onSuccess: (_data, { token }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.order(token) });
    },
  });
}

export function usePaymentGateways() {
  return useQuery<PaymentGateway[]>({
    queryKey: queryKeys.gateways,
    queryFn: getPaymentGateways,
  });
}

export function usePayOrder() {
  return useMutation({
    mutationFn: ({
      token,
      gateway_id,
    }: {
      token: string;
      gateway_id: number;
    }) => payOrder(token, gateway_id),
  });
}
