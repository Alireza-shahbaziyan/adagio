
"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { useAppState } from "@/lib/app-state";
import { IRAN_PHONE_PATTERN } from "@/lib/auth";
import { useCreateAddress, useUpdateAddress } from "@/lib/addresses";
import { useCities, useProvinces } from "@/lib/locations";

import type { Address, AddressPayload } from "@/types/address";

import Select from "./Select";

interface AddressFormProps {
  address?: Address;
  onSuccess: () => void;
}

const EMPTY_ADDRESS: AddressPayload = {
  title: "",
  recipient_name: "",
  phone: "",
  province: 0,
  city: 0,
  postal_code: "",
  address_line: "",
  is_default: false,
};

export default function AddressForm({
  address,
  onSuccess,
}: AddressFormProps) {
  const { showToast } = useAppState();

  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();

  const { data: provinces } = useProvinces();

  const isEdit = Boolean(address);
  const isPending =
    createAddress.isPending || updateAddress.isPending;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddressPayload>({
    defaultValues: address ?? EMPTY_ADDRESS,
  });

  const provinceId = watch("province");

  const {
    data: cities,
    isLoading: citiesLoading,
  } = useCities(provinceId || null);

  /**
   * Keeps the original province so changing the province after
   * initialization resets the city, while edit mode keeps its
   * existing city during the initial render.
   */
  const initialProvinceId = useRef(address?.province ?? 0);

  useEffect(() => {
    if (!provinceId) {
      setValue("city", 0);
      return;
    }

    if (provinceId === initialProvinceId.current) {
      return;
    }

    setValue("city", 0);
  }, [provinceId, setValue]);

  const onSubmit = handleSubmit((data) => {
    if (isEdit && address) {
      updateAddress.mutate(
        {
          id: address.id,
          payload: data,
        },
        {
          onSuccess: () => {
            showToast("آدرس ذخیره شد");
            onSuccess();
          },
          onError: (error) => {
            showToast(error.message);
          },
        },
      );

      return;
    }

    createAddress.mutate(data, {
      onSuccess: () => {
        showToast("آدرس اضافه شد");
        onSuccess();
      },
      onError: (error) => {
        showToast(error.message);
      },
    });
  });

  return (
    <form onSubmit={onSubmit} noValidate>
      <FieldGroup>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 pt-5">
          <Field data-invalid={Boolean(errors.title)}>
            <FieldLabel htmlFor="address-title">
              عنوان آدرس
            </FieldLabel>

            <Input
              id="address-title"
              autoComplete="off"
              placeholder="خانه، محل کار…"
              aria-invalid={Boolean(errors.title)}
              {...register("title", {
                required: true,
              })}
            />

            {errors.title && (
              <FieldError>
                عنوان را وارد کن.
              </FieldError>
            )}
          </Field>

          <Field data-invalid={Boolean(errors.recipient_name)}>
            <FieldLabel htmlFor="address-recipient">
              نام تحویل‌گیرنده
            </FieldLabel>

            <Input
              id="address-recipient"
              autoComplete="name"
              aria-invalid={Boolean(errors.recipient_name)}
              {...register("recipient_name", {
                required: true,
              })}
            />

            {errors.recipient_name && (
              <FieldError>
                نام تحویل‌گیرنده را وارد کن.
              </FieldError>
            )}
          </Field>
        </div>

        <Field data-invalid={Boolean(errors.phone)}>
          <FieldLabel htmlFor="address-phone">
            شماره موبایل
          </FieldLabel>

          <Input
            id="address-phone"
            dir="ltr"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="۰۹۱۲۳۴۵۶۷۸۹"
            aria-invalid={Boolean(errors.phone)}
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

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
          <Field data-invalid={Boolean(errors.province)}>
            <FieldLabel htmlFor="address-province">
              استان
            </FieldLabel>

            <Select
              id="address-province"
              aria-invalid={Boolean(errors.province)}
              {...register("province", {
                required: true,
                valueAsNumber: true,
                validate: (value) =>
                  value > 0 || "استان را انتخاب کن.",
              })}
            >
              <option className="pb-2 pt-1 px-0.5" value={0} disabled>
                انتخاب کن
              </option>

              {provinces?.map((province) => (
                <option
                    className="py-1 p-0.5 text-xs md:text-sm"
                  key={province.id}
                  value={province.id}
                >
                  {province.name}
                </option>
              ))}
            </Select>

            {errors.province && (
              <FieldError>
                {errors.province.message ?? "استان را انتخاب کن."}
              </FieldError>
            )}
          </Field>

          <Field data-invalid={Boolean(errors.city)}>
            <FieldLabel htmlFor="address-city">
              شهر
            </FieldLabel>

            <Select
              id="address-city"
              disabled={!provinceId || citiesLoading}
              aria-invalid={Boolean(errors.city)}
              {...register("city", {
                required: true,
                valueAsNumber: true,
                validate: (value) =>
                  value > 0 || "شهر را انتخاب کن.",
              })}
            >
              <option value={0} disabled>
                {!provinceId
                  ? "ابتدا استان"
                  : citiesLoading
                    ? "در حال دریافت شهرها…"
                    : "انتخاب کن"}
              </option>

              {cities?.map((city) => (
                <option
                  key={city.id}
                  value={city.id}
                >
                  {city.name}
                </option>
              ))}
            </Select>

            {errors.city && (
              <FieldError>
                {errors.city.message ?? "شهر را انتخاب کن."}
              </FieldError>
            )}
          </Field>
        </div>

        <Field data-invalid={Boolean(errors.postal_code)}>
          <FieldLabel htmlFor="address-postal">
            کد پستی
          </FieldLabel>

          <Input
            id="address-postal"
            dir="ltr"
            inputMode="numeric"
            autoComplete="postal-code"
            aria-invalid={Boolean(errors.postal_code)}
            className="font-yekanBakhFontForFarsiChar tracking-[0.5px]"
            {...register("postal_code", {
              required: true,
              pattern: {
                value: /^\d{10}$/,
                message: "کد پستی باید ۱۰ رقم باشد.",
              },
            })}
          />

          {errors.postal_code && (
            <FieldError>
              {errors.postal_code.message ??
                "کد پستی باید ۱۰ رقم باشد."}
            </FieldError>
          )}
        </Field>

        <Field data-invalid={Boolean(errors.address_line)}>
          <FieldLabel htmlFor="address-line">
            آدرس کامل
          </FieldLabel>

          <Textarea
            id="address-line"
            autoComplete="street-address"
            aria-invalid={Boolean(errors.address_line)}
            {...register("address_line", {
              required: true,
            })}
          />

          {errors.address_line && (
            <FieldError>
              آدرس کامل را وارد کن.
            </FieldError>
          )}
        </Field>
{/* 
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

          <span className="text-sm">
            به‌عنوان آدرس پیش‌فرض ذخیره شود
          </span>
        </label> */}
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

