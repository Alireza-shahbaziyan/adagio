"use client";

import { usePathname } from "next/navigation";
import { useAppState } from "@/lib/app-state";
import { CloseIcon } from "@/components/icons";

/**
 * Shared toast used by `useAppState().showToast`.
 *
 * Long Persian messages (product titles, quantities, sizes) must wrap instead
 * of overflowing the viewport, so the pill keeps a shrink-to-fit width capped
 * below the screen width (including mobile safe-area insets) and lets the text
 * wrap on its own.
 */
export default function Toast() {
  const { toastMessage, toastVisible, hideToast } = useAppState();
  const pathname = usePathname();

  if (!toastVisible) return null;

  const bottomClass = pathname?.startsWith("/product")
    ? "bottom-[92px] md:bottom-8"
    : pathname === "/"
      ? "bottom-[86px] md:bottom-8"
      : "bottom-8";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed left-1/2 z-[3000] flex w-fit min-w-0 max-w-[calc(100vw_-_2rem_-_env(safe-area-inset-left)_-_env(safe-area-inset-right))] -translate-x-1/2 items-start gap-3 rounded-2xl bg-foreground px-5 py-3.5 text-sm leading-6 text-primary-foreground shadow-[0_12px_40px_rgba(0,0,0,0.4)] ${bottomClass}`}
    >
      <p className="min-w-0 flex-1 whitespace-normal break-words [overflow-wrap:anywhere]">
        {toastMessage}
      </p>
      <button
        type="button"
        onClick={hideToast}
        aria-label="بستن پیام"
        className="-me-1.5 -mt-1 flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full opacity-70 transition-opacity hover:opacity-100"
      >
        <CloseIcon size={14} />
      </button>
    </div>
  );
}
