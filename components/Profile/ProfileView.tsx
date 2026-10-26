"use client";

import { useState } from "react";
import Link from "next/link";
import { ImageIcon, PhoneIcon, UserRoundIcon } from "lucide-react";

import { UserAvatar } from "@/components/Profile/UserAvatar";
import ProfileForm from "@/components/Profile/ProfileForm";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMembership } from "@/hooks/useMembership";
import { formatUserPhone, getUserDisplayName } from "@/lib/user";

function ProfileCardSkeleton() {
  return (
    <div className="rounded-[20px] border border-white/8 bg-[#111111] p-5 md:p-7">
      <div className="flex items-center gap-4">
        <Skeleton className="h-20 w-20 shrink-0 rounded-full bg-[#1d1d1d]" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-5 w-40 bg-[#1d1d1d]" />
          <Skeleton className="h-4 w-28 bg-[#1d1d1d]" />
        </div>
      </div>
      <div className="mt-7 space-y-3">
        {[0, 1, 2].map((row) => (
          <Skeleton key={row} className="h-14 w-full rounded-xl bg-[#181818]" />
        ))}
      </div>
    </div>
  );
}

function GuestPrompt() {
  return (
    <div className="rounded-[20px] border border-white/8 bg-[#111111] px-6 py-16 text-center md:px-10">
      <p className="mb-3 text-lg font-bold text-foreground">
        برای مشاهده پروفایل وارد شو
      </p>
      <p className="mx-auto mb-8 max-w-md text-sm leading-6 text-muted-foreground">
        با ورود به حساب کاربری می‌توانی نام و تصویر پروفایل خود را ویرایش کنی.
      </p>
      <Link
        href="/login?next=%2Fprofile"
        className="inline-flex h-11 items-center justify-center rounded-full border border-white/25 px-7 text-sm text-foreground transition-colors hover:border-white/60 hover:bg-white/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      >
        ورود به حساب کاربری
      </Link>
    </div>
  );
}

export default function ProfileView() {
  const { user, isMember, isLoading, isError, refetch } = useMembership();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <section
      aria-labelledby="profile-title"
      className="mx-auto max-w-3xl px-5 pb-20 pt-6 md:px-16 md:pt-20"
    >
      <h1
        id="profile-title"
        className="mb-8 text-[28px] font-black leading-[1.15] text-foreground md:text-[44px]"
      >
        پروفایل من
      </h1>

      {isLoading ? (
        <ProfileCardSkeleton />
      ) : isError ? (
        <div className="rounded-[20px] border border-white/8 bg-[#111111] px-6 py-16 text-center md:px-10">
          <p className="mb-3 text-lg font-bold text-foreground">
            دریافت اطلاعات حساب ناموفق بود
          </p>
          <p className="mx-auto mb-8 max-w-md text-sm leading-6 text-muted-foreground">
            مشکلی در ارتباط با سرور پیش آمد. لطفاً دوباره تلاش کن.
          </p>
          <Button
            type="button"
            onClick={() => refetch()}
            className="h-11 rounded-full px-7 text-sm"
          >
            تلاش دوباره
          </Button>
        </div>
      ) : !isMember || !user ? (
        <GuestPrompt />
      ) : isEditing ? (
        <ProfileForm
          user={user}
          onCancel={() => setIsEditing(false)}
          onSaved={() => setIsEditing(false)}
        />
      ) : (
        <div className="rounded-[20px] border border-white/8 bg-[#111111] p-5 md:p-7">
          <div className="flex flex-wrap items-center gap-4">
            <UserAvatar user={user} size={76} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-lg font-bold text-foreground">
                {getUserDisplayName(user)}
              </p>
              <p
                dir="ltr"
                className="mt-1 truncate text-start text-sm text-muted-foreground"
              >
                {formatUserPhone(user.phone)}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="h-10 shrink-0 rounded-full px-5 text-sm"
            >
              ویرایش پروفایل
            </Button>
          </div>

          <dl className="mt-7 divide-y divide-white/8 overflow-hidden rounded-xl border border-white/8">
            <div className="flex items-center gap-3 px-4 py-4">
              <dt className="flex w-32 shrink-0 items-center gap-2 text-xs text-muted-foreground">
                <UserRoundIcon size={15} aria-hidden="true" />
                نام کامل
              </dt>
              <dd className="min-w-0 flex-1 truncate text-sm text-foreground">
                {user.full_name?.trim() || "تنظیم نشده"}
              </dd>
            </div>

            <div className="flex items-center gap-3 px-4 py-4">
              <dt className="flex w-32 shrink-0 items-center gap-2 text-xs text-muted-foreground">
                <PhoneIcon size={15} aria-hidden="true" />
                شماره موبایل
              </dt>
              <dd
                dir="ltr"
                className="min-w-0 flex-1 truncate text-start text-sm text-foreground"
              >
                {formatUserPhone(user.phone) || "—"}
              </dd>
            </div>

            <div className="flex items-center gap-3 px-4 py-4">
              <dt className="flex w-32 shrink-0 items-center gap-2 text-xs text-muted-foreground">
                <ImageIcon size={15} aria-hidden="true" />
                تصویر پروفایل
              </dt>
              <dd
                dir="ltr"
                className="min-w-0 flex-1 truncate text-start text-sm text-foreground"
              >
                {user.avatar?.trim() || "تنظیم نشده"}
              </dd>
            </div>
          </dl>
        </div>
      )}
    </section>
  );
}
