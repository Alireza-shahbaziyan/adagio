import { createOrders } from "@/services/orders.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";

type CreateOrderVariables = {
  addressId: number;
  customerNote: string;
};

export function useCreateOrders() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ addressId, customerNote }: CreateOrderVariables) =>
      createOrders(addressId, customerNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders });
    },
  });
}