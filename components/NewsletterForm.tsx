"use client";

import { useAppState } from "@/lib/app-state";

export default function NewsletterForm() {
  const { showToast } = useAppState();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        showToast("ایمیلت ثبت شد.");
        (e.target as HTMLFormElement).reset();
      }}
      className="mx-auto flex max-w-[480px] flex-wrap justify-center gap-3"
    >
      <input
        type="email"
        placeholder="ایمیل شما"
        required
        style={{ textAlign: "right" }}
        className="min-w-[240px] flex-1 rounded-full border border-white/[0.12] bg-[#181818] px-6 py-4.5 text-[15px] text-foreground outline-none"
      />
      <button
        type="submit"
        className="rounded-full bg-foreground px-9 py-4.5 text-[15px] font-bold text-primary-foreground transition-transform hover:scale-[1.04]"
      >
        عضویت
      </button>
    </form>
  );
}
