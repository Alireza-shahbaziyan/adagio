import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/services/auth.service";
import { queryKeys } from "@/lib/queryKeys";


export function useMe() {
  return useQuery({
    queryKey: queryKeys.checkAuth,
    queryFn: getMe,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}