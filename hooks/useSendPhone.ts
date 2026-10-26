"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import { loginApi } from "@/services/auth.service";
import { savePhoneNumber } from "@/lib/auth";


export function useSendPhone() {
  const router = useRouter();
  const [isNavigating, startTransition] = useTransition();

  const mutation = useMutation({
    mutationFn: ({ phone }: { phone: string; next?: string | null }) =>
      loginApi({ phone }),

    onSuccess: (_, variables) => {
      savePhoneNumber(variables.phone);

      const next = variables.next;
      const query = next ? `?next=${encodeURIComponent(next)}` : "";

      startTransition(() => {
        router.push(`/login/${variables.phone}${query}`);
      });
    },

    onError: (error) => {
      console.error(error);
    },
  });


  return {
    sendPhone: mutation.mutate,
    isPending: mutation.isPending || isNavigating,
    error: mutation.error,
  };
}