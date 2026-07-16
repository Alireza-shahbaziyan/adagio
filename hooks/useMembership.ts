import { useMe } from "@/hooks/useMe";

export function useMembership() {
  const { data: user, isLoading, isError } = useMe();
  return {
    user: user ?? null,
    isMember: Boolean(user),
    isGuest: !isLoading && !user,
    isLoading,
    isError,
  };
}
