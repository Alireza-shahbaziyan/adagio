

export async function addWishList(slug:string) {
  const res = await fetch("/api/wishlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ slug }),
  });
  if (!res.ok) throw new Error("Verification failed");

  return res.json();
}
