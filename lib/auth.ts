const PHONE_STORAGE_KEY = "adagio_phone_number";

export const IRAN_PHONE_PATTERN = /^09\d{9}$/;

export function savePhoneNumber(phone: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PHONE_STORAGE_KEY, phone);
}

export function getSavedPhoneNumber(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(PHONE_STORAGE_KEY);
}
