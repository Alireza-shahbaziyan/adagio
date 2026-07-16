"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useWishlistToggle } from "@/lib/wishlist";
import { HeartIcon } from "@/components/icons";
import { Product } from "@/types/products";

export default function ProductCard({
  product,
  interactive = false,
  priority = false,
}: {
  product: Product;
  interactive?: boolean;
  priority?: boolean;
}) {
  const { isWishlisted: wishlisted, toggle: toggleWishlist } =
    useWishlistToggle(product.slug, product.title);
  const [hovered, setHovered] = useState(false);

  if (!product) return null;
  const image = product?.images?.[0]?.image || "/placeholder.jpg";
  const imageAlt = product?.images?.[0]?.alt_text || "Image.jpg";

  return (
    <Link
      href={`/product/${product.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="block overflow-hidden rounded-[20px] bg-[#181818] hover:bg-zinc-800"
    >
      <div className="relative aspect-4/5 overflow-hidden bg-[#111111]">
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 90vw, 320px"
          priority={priority}
          className="object-cover transition-transform duration-500 ease-[cubic-bezier(.16,.8,.24,1)]"
          style={{
            transform: hovered ? "scale(1.06)" : "scale(1)",
            filter: "grayscale(0.15)",
          }}
        />
        {interactive && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist();
            }}
            className="absolute top-3.5 left-3.5 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-foreground backdrop-blur-md"
          >
            <HeartIcon size={16} filled={wishlisted} />
          </button>
        )}
        {interactive && (
          <div
            className="absolute inset-x-3 bottom-3 transition-all duration-300 ease-out"
            style={{
              opacity: hovered ? 1 : 0,
              transform: hovered ? "translateY(0)" : "translateY(12px)",
              pointerEvents: hovered ? "auto" : "none",
            }}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // addToCart(product?.title || "");
                console.log(e);
              }}
              className="w-full rounded-full bg-foreground py-3 text-[13px] font-bold tracking-[0.3px] text-primary-foreground"
            >
              + افزودن سریع
            </button>
          </div>
        )}
      </div>
      <div className="px-1 py-5">
        <p className="mb-1 text-[15px] text-foreground ">{product?.title}</p>
        <p
          style={{ direction: "ltr", textAlign: "right" }}
          className="text-sm text-muted-foreground"
        >
          ${product?.variants?.[0]?.price || 0}
        </p>
      </div>
    </Link>
  );
}
