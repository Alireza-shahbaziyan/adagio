export default function Loading() {
  return (
    <main className="bg-light-in-dark flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border border-white/20 border-t-white" />

        <p className="mt-8 text-sm uppercase tracking-[0.45em] text-white/40">
          Loading
        </p>

        <h1 className="mt-4 text-3xl font-light text-white">
          در حال آماده‌سازی فروشگاه...
        </h1>
      </div>
    </main>
  );
}
