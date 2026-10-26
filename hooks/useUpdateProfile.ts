"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateMe } from "@/services/auth.service";
import { queryKeys } from "@/lib/queryKeys";
import type { UpdateProfilePayload, User } from "@/types/auth";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateMe(payload),
    onSuccess: (user) => {
      // Share the fresh user with every consumer of useMe/useMembership
      // (Navbar, profile page, wishlist gating) immediately.
      queryClient.setQueryData<User | null>(queryKeys.checkAuth, user);
      queryClient.invalidateQueries({ queryKey: queryKeys.bootstrap });
    },
  });
}
