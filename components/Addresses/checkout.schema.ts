import * as z from "zod/mini";
import { IRAN_PHONE_PATTERN } from "@/lib/auth";

export const checkoutSchema = z.object({
  name: z
    .string()
    .check(z.trim(), z.minLength(6, "نام و نام خانوادگی کامل را وارد کنید.")),

  phone: z
    .string()
    .check(z.trim(), z.regex(IRAN_PHONE_PATTERN, "شماره موبایل معتبر نیست.")),

  email: z
    .string()
    .check(z.trim(), z.email("ایمیل معتبر نیست.")),

  address: z
    .string()
    .check(z.trim(), z.minLength(5, "آدرس را وارد کنید.")),

  postalCode: z
    .string()
    .check(z.trim(), z.regex(/^\d{10}$/, "کد پستی باید ۱۰ رقم باشد.")),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;