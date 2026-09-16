'use client'
import Link from "next/link";
import { type LucideIcon } from "lucide-react";

export default function MobileNavLink({
  link,
  icon: Icon,
  value = null,
}: {
  link: string;
  icon: LucideIcon;
  value?: string | null;
}) {
  return (
    <Link
      href={link}
      className="relative flex h-11 w-11 items-center justify-center text-muted-foreground"
    >
      <Icon size={20} />
      {value&&<span className="absolute -top-0.5 -left-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[9px] font-semibold text-primary-foreground">
        {value}
      </span>}
    </Link>
  );
}
