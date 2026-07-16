"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductImage } from "@/types/products";

export default function ProductGallery({
  images,
  productTitle,
}: {
  images: ProductImage[];
  productTitle: string;
}) {
  const [activeImageId, setActiveImageId] = useState<number | null>(
    images[0]?.id ?? null,
  );
  const [isZooming, setIsZooming] = useState(false);
  const [zoom, setZoom] = useState({ x: 50, y: 50 });

  const activeImage = images.find((i) => i.id === activeImageId) ?? images[0];

  const handleZoomMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setZoom({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div
        onMouseMove={handleZoomMove}
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        className="relative aspect-[4/5] cursor-zoom-in overflow-hidden rounded-[20px] bg-[#111111]"
      >
        {activeImage ? (
          <Image
            src={activeImage.image}
            alt={activeImage.alt_text || productTitle}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
            className="object-cover"
            style={{
              transform: isZooming ? "scale(1.7)" : "scale(1)",
              transformOrigin: `${zoom.x}% ${zoom.y}%`,
              transition: isZooming
                ? "transform 0.1s ease-out"
                : "transform 0.4s ease",
            }}
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: "linear-gradient(160deg, #1c1c1c, #0d0d0d)",
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(135deg, rgba(243,243,243,0.05) 0px, rgba(243,243,243,0.05) 2px, transparent 2px, transparent 14px)",
              }}
            />
            <p className="z-1 text-[13px] text-[#5a5a5a]">
              تصویری برای این محصول ثبت نشده است
            </p>
          </div>
        )}
      </div>
      {images.length > 0 && (
        <div className="flex gap-3">
          {images.map((img) => (
            <button
              key={img.id}
              onClick={() => setActiveImageId(img.id)}
              style={{
                border:
                  activeImageId === img.id
                    ? "2px solid #F3F3F3"
                    : "1px solid rgba(255,255,255,0.15)",
              }}
              className="h-[92px] w-[76px] shrink-0 overflow-hidden rounded-xl bg-[#111111] p-0"
            >
              <div className="relative h-full w-full">
                <Image
                  src={img.image}
                  alt={img.alt_text || img.caption || productTitle}
                  fill
                  sizes="76px"
                  className="object-cover"
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
