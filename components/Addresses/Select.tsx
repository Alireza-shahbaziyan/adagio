import { ChevronDownIcon } from "@/components/icons";


const selectClassName =
  "h-8 w-full min-w-0  appearance-none rounded-lg border border-input bg-[#111111] px-2.5 py-1 text-base text-foreground transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm";

export default function Select({
  className,
  children,
  disabled,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        disabled={disabled}
        className={selectClassName + " " + (className ?? "")}
        {...props}
      >
        {children}
      </select>
      <span
        className={
          "pointer-events-none absolute inset-y-0 left-2.5 flex items-center text-muted-foreground" +
          (disabled ? " opacity-50" : "")
        }
      >
        <ChevronDownIcon size={14} />
      </span>
    </div>
  );
}