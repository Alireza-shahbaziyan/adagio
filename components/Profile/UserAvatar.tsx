"use client";

import { useEffect, useState } from "react";

import { UserIcon } from "@/components/icons";
import { getUserInitial } from "@/lib/user";
import { cn } from "@/lib/utils";
import type { User } from "@/types/auth";

interface UserAvatarProps {
  user: Pick<User, "full_name" | "avatar"> | null | undefined;
  size?: number;
  className?: string;
}

/**
 * Renders a user's avatar with a graceful fallback when the URL is missing
 * or the image fails to load. A plain <img> is intentional here: avatars are
 * user-supplied URLs, and <img> cannot crash the page on an unconfigured host
 * the way next/image can. `onError` swaps in initials/the user icon.
 */
export function UserAvatar({ user, size = 32, className }: UserAvatarProps) {
  const src = user?.avatar?.trim() ?? "";
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  const showImage = Boolean(src) && !failed;
  const initial = getUserInitial(user);

  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-[#222222] text-foreground",
        className,
      )}
      style={{ width: size, height: size }}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          width={size}
          height={size}
          onError={() => setFailed(true)}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover"
        />
      ) : initial ? (
        <span
          className="font-bold leading-none"
          style={{ fontSize: Math.max(11, Math.round(size * 0.4)) }}
        >
          {initial}
        </span>
      ) : (
        <UserIcon size={Math.round(size * 0.55)} />
      )}
    </span>
  );
}
