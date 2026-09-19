import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { logout } from "@/services/auth.service";
import { queryKeys } from "@/lib/queryKeys";

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>logout(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.logout });
      queryClient.invalidateQueries({ queryKey: ["logout-error"] });
    },
  });
}