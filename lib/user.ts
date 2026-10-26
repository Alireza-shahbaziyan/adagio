type UserNameSource = {
  full_name?: string | null;
  phone?: string | null;
};

/** Phone number formatted for display, keeping a single leading zero. */
export function formatUserPhone(
  phone: string | null | undefined,
): string {
  const value = phone?.trim();
  if (!value) return "";

  return value.startsWith("0") || value.startsWith("+")
    ? value
    : `0${value}`;
}

/** Human-readable name for the Navbar/profile UI, falling back to the phone. */
export function getUserDisplayName(
  user: UserNameSource | null | undefined,
): string {
  const name = user?.full_name?.trim();
  if (name) return name;

  return formatUserPhone(user?.phone) || "پروفایل";
}

/** First letter used by the avatar fallback when there is no image. */
export function getUserInitial(
  user: UserNameSource | null | undefined,
): string {
  const name = user?.full_name?.trim();
  if (name) return name.charAt(0);

  return getUserDisplayName(user).charAt(0);
}
