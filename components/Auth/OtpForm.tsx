"use client";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppState } from "@/lib/app-state";
import { ChevronRightIcon } from "@/components/icons";
import { verifyOtpApi } from "@/services/auth.service";
import { useSendPhone } from "@/hooks/useSendPhone";
import { queryKeys } from "@/lib/queryKeys";

const DIGIT_KEYS = ["d0", "d1", "d2", "d3", "d4"] as const;
type DigitKey = (typeof DIGIT_KEYS)[number];
type OtpFormValues = Record<DigitKey, string>;

const RESEND_SECONDS = 2;

export default function OtpForm({ phone }: { phone: string }) {
  const params = useParams<{ phonenumber: string }>();
  const { sendPhone } = useSendPhone();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useAppState();
  const boxRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const submittedCode = useRef<string | null>(null);

  const { register, handleSubmit, setValue, watch, reset } =
    useForm<OtpFormValues>({
      defaultValues: { d0: "", d1: "", d2: "", d3: "", d4: "" },
    });
  const values = watch();
  const code = DIGIT_KEYS.map((k) => values[k]).join("");

  const verifyOtp = useMutation({
    mutationFn: verifyOtpApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.checkAuth });
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
      showToast("وارد شدی. خوش آمدی.");
      router.push("/");
    },
    onError: () => {
      reset();
      submittedCode.current = null;
      boxRefs.current[0]?.focus();
    },
  });

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const onSubmit = handleSubmit((data) => {
    const fullCode = DIGIT_KEYS.map((k) => data[k]).join("");
    if (fullCode.length < 5 || submittedCode.current === fullCode) return;
    submittedCode.current = fullCode;
    verifyOtp.mutate({ phone, code: fullCode });
  });

  useEffect(() => {
    if (code.length === 5) onSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const focusBox = (i: number) => boxRefs.current[i]?.focus();

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const digits = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 5);
    if (!digits) return;
    e.preventDefault();
    digits.split("").forEach((d, i) => setValue(DIGIT_KEYS[i], d));
    focusBox(Math.min(digits.length, 5) - 1);
  };

  const handleResend = () => {
    try {
      if (secondsLeft > 0) return;
      sendPhone({ phone: params.phonenumber });
      showToast("کد دوباره ارسال شد.");
      setSecondsLeft(RESEND_SECONDS);
    } catch (error) {
      console.log(error);
      showToast("خطایی در ارسال دوباره کد پیش آمد . با پشتیبانی تماس بگیرید");
      setSecondsLeft(RESEND_SECONDS);
    }
  };

  return (
    <>
      <Link
        href="/login"
        className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronRightIcon size={14} />
        ویرایش شماره
      </Link>

      <div className="mb-9 text-center">
        <p className="mb-4 text-[11px] tracking-[1px] text-muted-foreground">
          مرحله ۲ از ۲
        </p>
        <h1 className="text-[26px] font-black text-foreground md:text-[34px]">
          کد را وارد کن
        </h1>
        <p className="mt-3 text-[13px] leading-[1.8] text-muted-foreground">
          کد ارسال‌شده به{" "}
          <span
            style={{ direction: "ltr", unicodeBidi: "isolate" }}
            className="font-yekanBakhFontForFarsiChar"
          >
            {phone}
          </span>{" "}
          را وارد کن.
        </p>
      </div>

      <form onSubmit={onSubmit}>
        <div dir="ltr" className="mb-5 flex justify-center gap-3">
          {DIGIT_KEYS.map((key, i) => {
            const field = register(key, { required: true, pattern: /^[0-9]$/ });
            return (
              <input
                key={key}
                {...field}
                ref={(el) => {
                  field.ref(el);
                  boxRefs.current[i] = el;
                }}
                type="tel"
                inputMode="numeric"
                maxLength={1}
                autoFocus={i === 0}
                onChange={(e) => {
                  field.onChange(e);
                  if (e.target.value && i < 4) focusBox(i + 1);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !values[key] && i > 0)
                    focusBox(i - 1);
                }}
                onPaste={handlePaste}
                className="font-yekanBakhFontForFarsiChar h-14 w-12 rounded-2xl border border-white/[0.12] bg-[#181818] text-center text-xl text-foreground outline-none transition-colors focus:border-white/50 md:h-16 md:w-14"
              />
            );
          })}
        </div>

        {verifyOtp.isError && (
          <p className="mb-5 text-center text-xs text-[#e5787e]">
            کد نادرست است. دوباره امتحان کن.
          </p>
        )}

        <button
          type="submit"
          disabled={code.length < 5 || verifyOtp.isPending}
          className="mb-7 flex w-full items-center justify-center rounded-full bg-foreground py-[17px] text-[15px] font-bold text-primary-foreground transition-all hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(243,243,243,0.18)] disabled:opacity-40 disabled:hover:scale-100 disabled:hover:shadow-none"
        >
          {verifyOtp.isPending ? (
            <span className="eq-bars">
              <span />
              <span />
              <span />
              <span />
            </span>
          ) : (
            "تأیید کد"
          )}
        </button>
      </form>

      <p className="text-center text-[13px] text-muted-foreground">
        {secondsLeft > 0 ? (
          <span style={{ direction: "ltr" }} className="inline-block">
            ارسال دوباره کد ({secondsLeft})
          </span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            className="bg-transparent p-0 text-[13px] text-foreground underline"
          >
            ارسال دوباره کد
          </button>
        )}
      </p>
    </>
  );
}
