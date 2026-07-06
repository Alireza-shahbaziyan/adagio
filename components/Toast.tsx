"use client";

import { usePathname } from "next/navigation";
import { useAppState } from "@/lib/app-state";

export default function Toast() {
  const { toastMessage, toastVisible } = useAppState();
  const pathname = usePathname();

  if (!toastVisible) return null;

  const bottomClass = pathname?.startsWith("/product")
    ? "bottom-[92px] md:bottom-8"
    : pathname === "/"
    ? "bottom-[86px] md:bottom-8"
    : "bottom-8";

  return (
    <div
      className={`fixed left-1/2 z-[3000] -translate-x-1/2 whitespace-nowrap rounded-full bg-[#F3F3F3] px-7 py-3.5 text-sm text-[#090909] shadow-[0_12px_40px_rgba(0,0,0,0.4)] ${bottomClass}`}
    >
      {toastMessage}
    </div>
  );
}
