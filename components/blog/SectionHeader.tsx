export default function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="mb-10 md:mb-12">
      <p className="mb-3 text-xs font-medium tracking-[0.25em] text-muted-foreground">
        {eyebrow}
      </p>

      <h2 className="text-3xl font-black leading-tight md:text-4xl">
        {title}
      </h2>

      <p className="mt-3 max-w-2xl text-sm leading-[2] text-muted-foreground md:text-base">
        {description}
      </p>
    </header>
  );
}