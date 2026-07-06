"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { loginApi } from "@/services/auth.service";
import { IRAN_PHONE_PATTERN, savePhoneNumber } from "@/lib/auth";

type PhoneFormValues = {
  phone: string;
};

export default function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PhoneFormValues>({
    defaultValues: { phone: "" },
  });

  const sendPhoneMutation = useMutation({
    mutationFn: loginApi,

    onSuccess: (_, variables) => {
      savePhoneNumber(variables.phone);
      router.push(`/login/${variables.phone}`);
    },

    onError: (error) => {
      console.error(error);
    },
  });

  const onSubmit = handleSubmit(({ phone }) => {
  
    sendPhoneMutation.mutate({ phone });
  });

  return (
    <div className="relative">
      {/* Loading Overlay Card */}
      {sendPhoneMutation.isPending && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="rounded-2xl bg-[#181818] px-6 py-5 text-center shadow-lg border border-white/10">
            <div className="mb-3 h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent mx-auto" />
            <p className="text-sm text-[#F3F3F3]">
              در حال ارسال کد تأیید...
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-9 text-center">
        <p className="mb-4 text-[11px] tracking-[1px] text-[#A8A8A8]">
          اعضای آداجیو
        </p>
        <h1 className="text-[26px] font-black text-[#F3F3F3] md:text-[34px]">
          ورود با شماره موبایل
        </h1>
        <p className="mt-3 text-[13px] leading-[1.8] text-[#A8A8A8]">
          کد یکبارمصرف را برایت پیامک می‌کنیم.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="relative">
        <div className="mb-7">
          <label className="mb-2 block text-xs text-[#A8A8A8]">
            شماره موبایل
          </label>

          <input
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            maxLength={11}
            placeholder="۰۹۱۲۳۴۵۶۷۸۹"
            style={{ textAlign: "right", direction: "ltr" }}
            className="w-full rounded-2xl border border-white/12 bg-[#181818] px-[18px] py-[15px] text-[15px] tracking-[1px] text-[#F3F3F3] outline-none transition-colors focus:border-white/50"
            {...register("phone", {
              required: true,
              pattern: IRAN_PHONE_PATTERN,
            })}
          />

          {errors.phone && (
            <p className="mt-2 text-xs text-[#e5787e]">
              شماره موبایل را درست وارد کن، مثلاً ۰۹۱۲۳۴۵۶۷۸۹.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={sendPhoneMutation.isPending}
          className="mb-6 w-full rounded-full bg-[#F3F3F3] py-[17px] text-[15px] font-bold text-[#090909] transition-all hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(243,243,243,0.18)] disabled:opacity-60"
        >
          {sendPhoneMutation.isPending ? "در حال ارسال..." : "دریافت کد"}
        </button>
      </form>

      <p className="text-center text-[13px] leading-[1.8] text-[#A8A8A8]">
        با ادامه، شرایط استفاده و حریم خصوصی آداجیو را می‌پذیری.
      </p>
    </div>
  );
}