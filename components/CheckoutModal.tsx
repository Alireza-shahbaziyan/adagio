"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppState } from "@/lib/app-state";
import { IRAN_PHONE_PATTERN } from "@/lib/auth";
import { useMembership } from "@/hooks/useMembership";

type CheckoutFormValues = {
  name: string;
  phone: string;
  email: string;
  address: string;
  postalCode: string;
};

export default function CheckoutModal({
  open,
  onOpenChange,
  totalPrice,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  totalPrice: number;
}) {
  const { showToast } = useAppState();
  const { isMember, isLoading: isMembershipLoading } = useMembership();
  const [step, setStep] = useState<1 | 2>(1);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    defaultValues: { name: "", phone: "", email: "", address: "", postalCode: "" },
  });

  function handleOpenChange(next: boolean) {
    onOpenChange(next);
    if (!next) {
      setStep(1);
      reset();
    }
  }

  const onSubmitInfo = handleSubmit((data) => {
    console.log(data);
    setStep(2);
  });

  function handlePay() {
    showToast("درگاه پرداخت به‌زودی متصل می‌شود");
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent dir="rtl" className="sm:max-w-md">
        {step === 1 ? (
          <>
            <DialogHeader>
              <DialogTitle>اطلاعات مشتری</DialogTitle>
              <DialogDescription>مرحله ۱ از ۲ — اطلاعات ارسال سفارش را وارد کن.</DialogDescription>
            </DialogHeader>

            <form onSubmit={onSubmitInfo}>
              <FieldGroup>
                <Field data-invalid={!!errors.name}>
                  <FieldLabel htmlFor="checkout-name">نام و نام خانوادگی</FieldLabel>
                  <Input
                    id="checkout-name"
                    aria-invalid={!!errors.name}
                    {...register("name", { required: true })}
                  />
                  {errors.name && <FieldError>نام و نام خانوادگی را وارد کن.</FieldError>}
                </Field>

                <Field data-invalid={!!errors.phone}>
                  <FieldLabel htmlFor="checkout-phone">شماره موبایل</FieldLabel>
                  <Input
                    id="checkout-phone"
                    dir="ltr"
                    inputMode="numeric"
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    aria-invalid={!!errors.phone}
                    {...register("phone", { required: true, pattern: IRAN_PHONE_PATTERN })}
                  />
                  {errors.phone && (
                    <FieldError>شماره موبایل را درست وارد کن، مثلاً ۰۹۱۲۳۴۵۶۷۸۹.</FieldError>
                  )}
                </Field>

                <Field data-invalid={!!errors.email}>
                  <FieldLabel htmlFor="checkout-email">ایمیل</FieldLabel>
                  <Input
                    id="checkout-email"
                    type="email"
                    dir="ltr"
                    aria-invalid={!!errors.email}
                    {...register("email", {
                      required: true,
                      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    })}
                  />
                  {errors.email && <FieldError>یک ایمیل معتبر وارد کن.</FieldError>}
                </Field>

                <Field data-invalid={!!errors.address}>
                  <FieldLabel htmlFor="checkout-address">آدرس</FieldLabel>
                  <Input
                    id="checkout-address"
                    aria-invalid={!!errors.address}
                    {...register("address", { required: true })}
                  />
                  {errors.address && <FieldError>آدرس را وارد کن.</FieldError>}
                </Field>

                <Field data-invalid={!!errors.postalCode}>
                  <FieldLabel htmlFor="checkout-postal">کد پستی</FieldLabel>
                  <Input
                    id="checkout-postal"
                    dir="ltr"
                    inputMode="numeric"
                    aria-invalid={!!errors.postalCode}
                    {...register("postalCode", { required: true, pattern: /^\d{10}$/ })}
                  />
                  {errors.postalCode && <FieldError>کد پستی باید ۱۰ رقم باشد.</FieldError>}
                </Field>
              </FieldGroup>

              <Button type="submit" className="mt-6 w-full rounded-full py-5">
                ادامه به پرداخت
              </Button>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>پرداخت</DialogTitle>
              <DialogDescription>مرحله ۲ از ۲ — مبلغ نهایی سفارش را پرداخت کن.</DialogDescription>
            </DialogHeader>

            <div className="flex flex-col items-center gap-6 py-4">
              <p style={{ direction: "ltr" }} className="text-2xl font-bold text-foreground">
                ${totalPrice}
              </p>
              {isMembershipLoading ? (
                <Skeleton className="h-11 w-full rounded-full" />
              ) : isMember ? (
                <Button onClick={handlePay} className="w-full rounded-full py-5">
                  پرداخت
                </Button>
              ) : (
                <div className="flex w-full flex-col items-center gap-3 text-center">
                  <p className="text-sm text-muted-foreground">
                    برای پرداخت باید وارد حساب کاربری شوی.
                  </p>
                  <Button
                    className="w-full rounded-full py-5"
                    nativeButton={false}
                    render={<Link href="/login">ورود به حساب کاربری</Link>}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
