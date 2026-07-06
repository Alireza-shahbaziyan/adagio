"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Product } from "@/lib/products";
import { useAppState } from "@/lib/app-state";
import { HeartIcon } from "@/components/icons";

export default function ProductCard({
  product,
  interactive = false,
  priority = false,
}: {
  product: Product;
  interactive?: boolean;
  priority?: boolean;
}) {
  const { isWishlisted, toggleWishlist, addToCart } = useAppState();
  const [hovered, setHovered] = useState(false);
  const wishlisted = isWishlisted(product.id);

  return (
    <Link
      href={`/product/${product.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="block overflow-hidden rounded-[20px] bg-[#181818]"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#111111]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 90vw, 320px"
          priority={priority}
          className="object-cover transition-transform duration-500 ease-[cubic-bezier(.16,.8,.24,1)]"
          style={{ transform: hovered ? "scale(1.06)" : "scale(1)", filter: "grayscale(0.15)" }}
        />
        {interactive && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product.id, product.name);
            }}
            className="absolute top-3.5 left-3.5 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-[#F3F3F3] backdrop-blur-md"
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
                addToCart(product.name);
              }}
              className="w-full rounded-full bg-[#F3F3F3] py-3 text-[13px] font-bold tracking-[0.3px] text-[#090909]"
            >
              + افزودن سریع
            </button>
          </div>
        )}
      </div>
      <div className="px-1 py-5">
        <p className="mb-1 text-[15px] text-[#F3F3F3]">{product.name}</p>
        <p style={{ direction: "ltr", textAlign: "right" }} className="text-sm text-[#A8A8A8]">
          ${product.price}
        </p>
      </div>
    </Link>
  );
}
