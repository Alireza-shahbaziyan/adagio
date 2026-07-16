import WishlistItemCard from "@/components/Wishlist/WishlistItemCard";
import type { WishlistItem } from "@/types/wishlist";

export default function WishlistGrid({ items }: { items: WishlistItem[] }) {
  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => (
        <WishlistItemCard key={item.slug} item={item} />
      ))}
    </div>
  );
}
