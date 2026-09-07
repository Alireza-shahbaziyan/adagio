import Link from "next/link";
import { CloseIcon } from "@/components/icons";

const NAV_LINKS = [
  { href: "/store", label: "فروشگاه" },
  { href: "/blog", label: "بلاگ" },
  { href: "/store/collections", label: "کالکشن‌ها" },
  { href: "/store/categories", label: "دستبه‌بندی" },
  { href: "/store/order-guide", label: "راهنمای‌خرید" },
  { href: "/about", label: "درباره" },
  { href: "/contact-me", label: "تماس" },
];

interface MobileMenuProps {
  isMember: boolean;
  onClose: () => void;
}

export function MobileMenu({ isMember, onClose }: MobileMenuProps) {
  return (
    <div
      style={{ animation: "fadeInSoft 0.3s ease" }}
      className="fixed inset-0 z-5000 flex flex-col bg-primary-foreground p-6 md:hidden"
    >
      <div className="mb-12 flex items-center justify-between">
        <span
          style={{ direction: "ltr" }}
          className="font-instrument-serif text-[26px] italic text-foreground"
        >
          Adagio
        </span>
        <button
          onClick={onClose}
          className="flex p-2 text-foreground"
          type="button"
        >
          <CloseIcon />
        </button>
      </div>
      {NAV_LINKS.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          onClick={onClose}
          className="border-b border-white/8 py-4.5 text-[28px] font-bold text-foreground"
        >
          {l.label}
        </Link>
      ))}
      {isMember ? (
        <Link
          key={"AS"}
          href={"#"}
          onClick={onClose}
          className="border-b border-white/8 py-4.5 text-[28px] font-bold text-foreground"
        >
          AAA
        </Link>
      ) : (
        <Link
          href="/login"
          onClick={onClose}
          className="pt-6 text-base text-muted-foreground  border-b border-white
               pb-2 w-fit hover:text-primary focus:text-white focus:border-muted-foreground"
        >
          ورود / حساب کاربری
        </Link>
      )}
    </div>
  );
}
