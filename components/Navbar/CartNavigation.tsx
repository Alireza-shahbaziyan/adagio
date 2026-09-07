import Link from "next/link";

interface CartNavigationLink {
    label:string
    href: string;
}
interface CartNavigationProps {
    items : CartNavigationLink[];
}

export default function CartNavigation({ items }: CartNavigationProps) {
  return (
     <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-20">
        <nav className="my-4 border-b border-white/10 pb-3">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="
                group inline-flex items-center gap-2
                rounded-lg px-3 py-2
                text-sm font-medium
                text-white/60
                transition-all duration-200
                hover:bg-white/5
                hover:text-white
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-white/30
              "
            >
              <span>{item.label}</span>
              <svg
                aria-hidden="true"
                className="
    h-4 w-4
    transition-transform duration-200
    group-hover:translate-x-1
  "
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 5l-7 7 7 7"
                />
              </svg>
            </Link>
          ))}
          </nav>
      </div>
  )
}
