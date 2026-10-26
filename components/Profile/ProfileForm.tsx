"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/Profile/UserAvatar";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import { useAppState } from "@/lib/app-state";
import { ApiClientError } from "@/lib/api-client";
import { getUserDisplayName } from "@/lib/user";
import type { User } from "@/types/auth";

const MAX_AVATAR_URL_LENGTH = 2048;
const MAX_FULL_NAME_LENGTH = 80;

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

const profileSchema = z.object({
  full_name: z
    .string()
    .max(
      MAX_FULL_NAME_LENGTH,
      `نام کامل نمی‌تواند بیشتر از ${MAX_FULL_NAME_LENGTH} کاراکتر باشد.`,
    ),
  avatar: z
    .string()
    .max(
      MAX_AVATAR_URL_LENGTH,
      "آدرس تصویر بیش از حد طولانی است.",
    )
    .refine(
      (value) => value.trim() === "" || isHttpUrl(value.trim()),
      "آدرس تصویر باید یک لینک معتبر با http:// یا https:// باشد.",
    ),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  user: User;
  onCancel: () => void;
  onSaved: () => void;
}

export default function ProfileForm({
  user,
  onCancel,
  onSaved,
}: ProfileFormProps) {
  const { showToast } = useAppState();
  const updateProfile = useUpdateProfile();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: user.full_name ?? "",
      avatar: user.avatar ?? "",
    },
  });

  const fullName = watch("full_name");
  const avatar = watch("avatar");
  const isPending = updateProfile.isPending;

  const onSubmit = handleSubmit((values) => {
    if (isPending) return;

    clearErrors("root.server");
    updateProfile.mutate(
      {
        full_name: values.full_name.trim(),
        avatar: values.avatar.trim(),
      },
      {
        onSuccess: () => {
          showToast("پروفایل با موفقیت به‌روزرسانی شد");
          onSaved();
        },
        onError: (error) => {
          if (error instanceof ApiClientError) {
            for (const [field, messages] of Object.entries(
              error.fieldErrors ?? {},
            )) {
              const message = messages[0];
              if (!message) continue;

              if (field === "full_name" || field === "avatar") {
                setError(field, { type: "server", message });
              } else {
                setError("root.server", { type: "server", message });
              }
            }

            showToast(error.message);
            return;
          }

          setError("root.server", {
            type: "server",
            message: "ذخیره پروفایل ناموفق بود. دوباره تلاش کن.",
          });
        },
      },
    );
  });

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-[20px] border border-white/8 bg-[#111111] p-5 md:p-7"
    >
      <div className="mb-6 flex items-center gap-4">
        <UserAvatar
          user={{ full_name: fullName, avatar: avatar }}
          size={64}
        />
        <div className="min-w-0">
          <p className="text-sm font-bold text-foreground">تصویر پروفایل</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            آدرس اینترنتی تصویر را وارد کن؛ اگر خالی باشد، حرف اول نام نمایش
            داده می‌شود.
          </p>
        </div>
      </div>

      <FieldGroup>
        <Field data-invalid={Boolean(errors.full_name)}>
          <FieldLabel htmlFor="profile-full-name">نام کامل</FieldLabel>
          <Input
            id="profile-full-name"
            autoComplete="name"
            placeholder="نام و نام خانوادگی"
            aria-invalid={Boolean(errors.full_name)}
            disabled={isPending}
            className="h-11 rounded-xl px-3"
            {...register("full_name")}
          />
          {errors.full_name && (
            <FieldError>{errors.full_name.message}</FieldError>
          )}
        </Field>

        <Field data-invalid={Boolean(errors.avatar)}>
          <FieldLabel htmlFor="profile-avatar">آدرس تصویر پروفایل</FieldLabel>
          <div className="flex gap-2">
            <Input
              id="profile-avatar"
              dir="ltr"
              inputMode="url"
              autoComplete="url"
              placeholder="https://example.com/avatar.jpg"
              aria-invalid={Boolean(errors.avatar)}
              disabled={isPending}
              className="h-11 rounded-xl px-3 text-start"
              {...register("avatar")}
            />
            {avatar.trim() && (
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                onClick={() =>
                  setValue("avatar", "", {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
                className="h-11 shrink-0 rounded-xl px-3 text-xs"
              >
                حذف تصویر
              </Button>
            )}
          </div>
          <FieldDescription>
            این فیلد فقط آدرس تصویر را می‌پذیرد؛ آپلود فایل در این صفحه وجود
            ندارد.
          </FieldDescription>
          {errors.avatar && <FieldError>{errors.avatar.message}</FieldError>}
        </Field>

        <Field>
          <FieldLabel htmlFor="profile-phone">شماره موبایل</FieldLabel>
          <Input
            id="profile-phone"
            dir="ltr"
            value={user.phone}
            readOnly
            disabled
            className="h-11 rounded-xl px-3 text-start"
          />
          <FieldDescription>
            شماره موبایل حساب {getUserDisplayName(user)} قابل ویرایش نیست.
          </FieldDescription>
        </Field>
      </FieldGroup>

      {errors.root?.server?.message && (
        <p
          role="alert"
          className="mt-4 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          {errors.root.server.message}
        </p>
      )}

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
        <Button
          type="submit"
          disabled={isPending}
          className="h-11 flex-1 rounded-full text-sm font-bold"
        >
          {isPending ? "در حال ذخیره…" : "ذخیره تغییرات"}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={onCancel}
          className="h-11 flex-1 rounded-full text-sm"
        >
          انصراف
        </Button>
      </div>
    </form>
  );
}
