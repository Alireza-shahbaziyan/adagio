"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  // FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "@/components/icons";
import { useAppState } from "@/lib/app-state";
import { IRAN_PHONE_PATTERN } from "@/lib/auth";
import { useCreateAddress, useUpdateAddress } from "@/lib/addresses";
import { useProvinces, useCities } from "@/lib/locations";
import type { Address, AddressPayload } from "@/types/address";

// Solid (non-transparent) background is deliberate: Chrome/Edge render a native
// <select>'s popup list using its own background-color, and "transparent" falls
// back to a white popup even though the closed control looks dark.
const selectClassName =
  "h-8 w-full min-w-0 appearance-none rounded-lg border border-input bg-[#111111] px-2.5 py-1 text-base text-foreground transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm";

function Select({
  className,
  children,
  disabled,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        disabled={disabled}
        className={selectClassName + " " + (className ?? "")}
        {...props}
      >
        {children}
      </select>
      <span
        className={
          "pointer-events-none absolute inset-y-0 left-2.5 flex items-center text-muted-foreground" +
          (disabled ? " opacity-50" : "")
        }
      >
        <ChevronDownIcon size={14} />
      </span>
    </div>
  );
}

export default function AddressForm({
  address,
  onSuccess,
}: {
  address?: Address;
  onSuccess: () => void;
}) {
  const { showToast } = useAppState();
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const { data: provinces } = useProvinces();
  const isEdit = !!address;
  const isPending = createAddress.isPending || updateAddress.isPending;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddressPayload>({
    defaultValues: address ?? {
      title: "",
      recipient_name: "",
      phone: "",
      province: 0,
      city: 0,
      postal_code: "",
      address_line: "",
      is_default: false,
    },
  });

  const provinceId = watch("province");
  const { data: cities, isLoading: citiesLoading } = useCities(
    provinceId || null,
  );
  // watch() can report `undefined` for one tick before settling on the real
  // defaultValue on mount, which fires this effect twice — comparing against
  // the true initial province (rather than "is this the first run") stops
  // that phantom transition from wiping out a prefilled edit-mode city.
  const initialProvinceId = useRef(address?.province ?? 0);

  useEffect(() => {
    if (!provinceId || provinceId === initialProvinceId.current) return;
    setValue("city", 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provinceId]);

  const onSubmit = handleSubmit((data) => {
    if (isEdit) {
      updateAddress.mutate(
        { id: address.id, payload: data },
        {
          onSuccess: () => {
            showToast("آدرس ذخیره شد");
            onSuccess();
          },
          onError: (err) => showToast(err.message),
        },
      );
    } else {
      createAddress.mutate(data, {
        onSuccess: () => {
          showToast("آدرس اضافه شد");
          onSuccess();
        },
        onError: (err) => showToast(err.message),
      });
    }
  });

  return (
    <form onSubmit={onSubmit}>
      <FieldGroup>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field data-invalid={!!errors.title}>
            <FieldLabel htmlFor="address-title">عنوان آدرس</FieldLabel>
            <Input
              id="address-title"
              autoComplete="off"
              placeholder="خانه، محل کار…"
              aria-invalid={!!errors.title}
              {...register("title", { required: true })}
            />
            {errors.title && <FieldError>عنوان را وارد کن.</FieldError>}
          </Field>

          <Field data-invalid={!!errors.recipient_name}>
            <FieldLabel htmlFor="address-recipient">
              نام تحویل‌گیرنده
            </FieldLabel>
            <Input
            autoComplete="off"
              id="address-recipient"
              aria-invalid={!!errors.recipient_name}
              {...register("recipient_name", { required: true })}
            />
            {errors.recipient_name && (
              <FieldError>نام تحویل‌گیرنده را وارد کن.</FieldError>
            )}
          </Field>
        </div>

        <Field data-invalid={!!errors.phone}>
          <FieldLabel htmlFor="address-phone">شماره موبایل</FieldLabel>
          <Input
          autoComplete="off"
            id="address-phone"
            dir="ltr"
            inputMode="numeric"
            placeholder="۰۹۱۲۳۴۵۶۷۸۹"
            aria-invalid={!!errors.phone}
            className="font-yekanBakhFontForFarsiChar tracking-[0.5px]"
            {...register("phone", {
              required: true,
              pattern: IRAN_PHONE_PATTERN,
            })}
          />
          {errors.phone && (
            <FieldError>
              شماره موبایل را درست وارد کن، مثلاً ۰۹۱۲۳۴۵۶۷۸۹.
            </FieldError>
          )}
        </Field>

        {/* <FieldSeparator /> */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field data-invalid={!!errors.province}>
            <FieldLabel htmlFor="address-province">استان</FieldLabel>
            <Select
              id="address-province"
              aria-invalid={!!errors.province}
              {...register("province", { required: true, valueAsNumber: true })}
            >
              <option value={0} disabled>
                انتخاب کن
              </option>
              {provinces?.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
            {errors.province && <FieldError>استان را انتخاب کن.</FieldError>}
          </Field>

          <Field data-invalid={!!errors.city}>
            <FieldLabel htmlFor="address-city">شهر</FieldLabel>
            <Select
              id="address-city"
              aria-invalid={!!errors.city}
              disabled={!provinceId || citiesLoading}
              {...register("city", { required: true, valueAsNumber: true })}
            >
              <option value={0} disabled>
                {provinceId ? "انتخاب کن" : "ابتدا استان"}
              </option>
              {cities?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
            {errors.city && <FieldError>شهر را انتخاب کن.</FieldError>}
          </Field>
        </div>

        <Field data-invalid={!!errors.postal_code}>
          <FieldLabel htmlFor="address-postal">کد پستی</FieldLabel>
          <Input
            id="address-postal"
            dir="ltr"
            inputMode="numeric"
            aria-invalid={!!errors.postal_code}
            className="font-yekanBakhFontForFarsiChar tracking-[0.5px]"
            {...register("postal_code", {
              required: true,
              pattern: /^\d{10}$/,
            })}
          />
          {errors.postal_code && (
            <FieldError>کد پستی باید ۱۰ رقم باشد.</FieldError>
          )}
        </Field>

        <Field data-invalid={!!errors.address_line}>
          <FieldLabel htmlFor="address-line">آدرس کامل</FieldLabel>
          <Textarea
            id="address-line"
            aria-invalid={!!errors.address_line}
            {...register("address_line", { required: true })}
          />
          {errors.address_line && (
            <FieldError>آدرس کامل را وارد کن.</FieldError>
          )}
        </Field>

        <label
          htmlFor="address-default"
          className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-input px-3 py-2.5 has-checked:border-ring has-checked:bg-ring/5"
        >
          <input
            id="address-default"
            type="checkbox"
            className="h-4 w-4 accent-foreground"
            {...register("is_default")}
          />
          <span className="text-sm">به‌عنوان آدرس پیش‌فرض ذخیره شود</span>
        </label>
      </FieldGroup>

      <Button
        type="submit"
        disabled={isPending}
        className="mt-6 w-full rounded-full py-5"
      >
        {isPending ? "در حال ذخیره…" : "ذخیره آدرس"}
      </Button>
    </form>
  );
}
