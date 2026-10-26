import type { ComponentProps, ReactNode } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

const NAV_ACTION_CLASS =
  "relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-white/8 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 active:bg-white/12 disabled:pointer-events-none disabled:opacity-40";

type NavActionLinkProps = Omit<ComponentProps<typeof Link>, "aria-label"> & {
  label: string;
  children: ReactNode;
};

export function NavActionLink({
  label,
  className,
  children,
  ...props
}: NavActionLinkProps) {
  return (
    <Link
      aria-label={label}
      className={cn(NAV_ACTION_CLASS, className)}
      {...props}
    >
      {children}
    </Link>
  );
}

type NavActionButtonProps = Omit<
  ComponentProps<"button">,
  "aria-label" | "type"
> & {
  label: string;
  children: ReactNode;
};

export function NavActionButton({
  label,
  className,
  children,
  ...props
}: NavActionButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(NAV_ACTION_CLASS, className)}
      {...props}
    >
      {children}
    </button>
  );
}

export { NAV_ACTION_CLASS };
