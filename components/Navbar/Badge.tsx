export function Badge({ count }: { count: number }) {
  if (!count) return null;
  return (
    <span className="absolute -top-0.5 -left-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[9px] font-semibold text-primary-foreground">
      {count}
    </span>
  );
}
