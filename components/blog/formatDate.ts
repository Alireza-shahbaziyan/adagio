export function formatDate(date: string | null | undefined) {
  const parsedDate = date ? new Date(date) : null;

  if (!parsedDate || Number.isNaN(parsedDate.getTime())) {
    return "تاریخ نامشخص";
  }

  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(parsedDate);
}
