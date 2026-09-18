export function getCsrfToken(cookie: string) {
  const match = cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith("csrftoken="));

  return match?.split("=")[1] ?? "";
}