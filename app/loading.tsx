'use client'
export default function Loading() {
  return (
    <main className="bg-light-in-dark flex min-h-screen items-center justify-center overflow-hidden">
      <div className="text-center">
        {/* Animated Loader */}
        <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
          <div className="absolute inset-0 animate-ping rounded-full border border-white/20" />

          <div className="h-12 w-12 animate-spin rounded-full border border-white/20 border-t-white" />

          <div className="absolute h-2 w-2 animate-pulse rounded-full bg-white" />
        </div>

        {/* Text */}
        <p className="mt-10 animate-pulse text-xs uppercase tracking-[0.5em] text-white/40">
          در حال بارگذاری
        </p>

        <h1 className="mt-5 animate-[fadeIn_1.2s_ease-in-out] text-3xl font-light text-white">
          آماده‌سازی تجربه شما...
        </h1>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}