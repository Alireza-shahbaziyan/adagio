export function StructuredData({ data }: { data: Record<string, unknown> }) {
  if (!data || Object.keys(data).length === 0) {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}