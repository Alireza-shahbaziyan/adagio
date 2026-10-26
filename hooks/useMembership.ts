import { useMe } from "@/hooks/useMe";

export function useMembership() {
  const { data: user, isLoading, isError, refetch } = useMe();
  return {
    user: user ?? null,
    isMember: Boolean(user),
    isGuest: !isLoading && !user,
    isLoading,
    isError,
    refetch,
  };
}
