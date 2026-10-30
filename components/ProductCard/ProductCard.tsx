"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useWishlistToggle } from "@/lib/wishlist";
import { HeartIcon } from "@/components/icons";
import { Product } from "@/types/products";
import ProductCardDec from "./ProductCardDec";
import checkAvailable from "@/utils/availbleProduct";

export default function ProductCard({
  product,

  priority = false,
}: {
  product: Product;
  interactive?: boolean;
  priority?: boolean;
}) {
  const { isWishlisted: wishlisted, toggle: toggleWishlist } =
    useWishlistToggle(product.slug, product.title);


  if (!product) return null;
  const image = product?.images?.[0]?.image || "/placeholder.jpg";
  const imageAlt = product?.images?.[0]?.alt_text || "Image.jpg";
  // console.log(product?.variants[0].size_name)

  const invalidProduct = !checkAvailable(product?.variants);
  
  return (
    <Link
      href={`/store/products/${product.slug}`}
      className="block overflow-hidden rounded-[20px] bg-card hover:bg-zinc-800"
    >
      <div className="relative aspect-4/5 overflow-hidden bg-[#111111]">
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 90vw, 320px"
          priority={priority}
          className="object-cover scale(1.06) transition-transform duration-500 ease-[cubic-bezier(.16,.8,.24,1)]"
   
        />
       
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
        
        
       
      </div>
      <ProductCardDec
        variant={product.variants}
        isvalid={invalidProduct}
        title={product.title ?? "نامی ثبت نشده"}
      />
    </Link>
  );
}
