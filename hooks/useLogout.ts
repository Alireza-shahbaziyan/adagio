import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "@/services/auth.service";
import { queryKeys } from "@/lib/queryKeys";
import type { User } from "@/types/auth";

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      // Clear the authenticated user first so the Navbar/profile UI flips
      // immediately, then drop data that belongs to the previous session.
      queryClient.setQueryData<User | null>(queryKeys.checkAuth, null);
      queryClient.invalidateQueries({ queryKey: queryKeys.checkAuth });
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
      queryClient.invalidateQueries({ queryKey: queryKeys.bootstrap });
      queryClient.removeQueries({ queryKey: queryKeys.addresses });
      queryClient.removeQueries({ queryKey: queryKeys.wishlist });
    },
  });
}
