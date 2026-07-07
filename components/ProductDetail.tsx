"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Reveal from "@/components/Reveal";
import ProductFooter from "@/components/ProductFooter";
import { ChevronDownIcon, HeartIcon } from "@/components/icons";
import { useAppState } from "@/lib/app-state";
import { useRecentlyViewed } from "@/lib/hooks";
import { Product } from "@/types/singleProduct";
import type {
  Product as ProductSummary,
  ProductImage,
  ProductVariant,
} from "@/types/products";

export default function ProductDetail({
  product,
  recommended = [],
}: {
  product: Product;
  recommended?: ProductSummary[];
}) {
  const { isWishlisted, toggleWishlist, addToCart, showToast } = useAppState();

  const images = useMemo<ProductImage[]>(
    () =>
      [...(product.images ?? [])].sort(
        (a, b) => Number(b.is_primary) - Number(a.is_primary),
      ),
    [product.images],
  );

  const variants = product.variants ?? [];
  const primaryCollection = product.collections?.[0];
  const description = product.description || product.short_description;

  const accordionSections = useMemo(() => {
    const sections: { key: string; title: string; content: string }[] = [];
    if (description) {
      sections.push({ key: "description", title: "توضیحات", content: description });
    }
    if (product.tags?.length) {
      sections.push({
        key: "tags",
        title: "برچسب‌ها",
        content: product.tags.map((t) => t.title).join("، "),
      });
    }
    return sections;
  }, [description, product.tags]);

  const [activeImageId, setActiveImageId] = useState<number | null>(
    images[0]?.id ?? null,
  );
  const [isZooming, setIsZooming] = useState(false);
  const [zoom, setZoom] = useState({ x: 50, y: 50 });
  const [selectedSize, setSelectedSize] = useState<ProductVariant["size_name"] | null>(
    () =>
      variants.find((v) => v.is_active && v.stock > 0)?.size_name ??
      variants[0]?.size_name ??
      null,
  );
  const [qty, setQty] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<string | null>(
    accordionSections[0]?.key ?? null,
  );

  const activeImage = images.find((i) => i.id === activeImageId) ?? images[0];
  const wishlisted = isWishlisted(product.id.toString());
  const selectedVariant =
    variants.find((v) => v.size_name === selectedSize) ?? variants[0];
  const maxQty = selectedVariant ? Math.max(1, selectedVariant.stock) : 1;

  useEffect(() => {
    setQty((q) => Math.min(q, maxQty));
  }, [maxQty]);

  const recentlyViewed = useRecentlyViewed(
    useMemo(
      () => ({
        id: product.id,
        slug: product.slug,
        title: product.title,
        image: images[0]?.image ?? null,
      }),
      [product.id, product.slug, product.title, images],
    ),
  );

  const handleZoomMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setZoom({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleAddToCart = () => {
    if (!selectedVariant) {
      showToast("این محصول موجود نیست");
      return;
    }
    addToCart(
      product.title,
      qty,
      `${qty} عدد اضافه شد — ${product.title}، سایز ${selectedVariant.size_name}`,
    );
  };

  const handleBuyNow = () => {
    if (!selectedVariant) {
      showToast("این محصول موجود نیست");
      return;
    }
    showToast("در حال انتقال به تسویه‌حساب…");
  };

  return (
    <div
      dir="rtl"
      lang="fa"
      className="relative min-h-screen bg-[#090909] pb-24 text-white md:pb-0"
    >
      <Navbar
        variant="product"
        productWishlisted={wishlisted}
        onToggleProductWishlist={() => toggleWishlist(product.id.toString(), product.title)}
      />

      <div className="mx-auto max-w-[1400px] px-5 pt-8 md:px-16 md:pt-12">
        <div className="mb-10 flex flex-wrap items-center gap-2 text-[13px] text-[#A8A8A8] md:mb-14">
          <Link href="/" className="text-[#A8A8A8]">
            خانه
          </Link>
          <span>/</span>
          <Link href="/#categories" className="text-[#A8A8A8]">
            {primaryCollection?.title ?? "محصولات"}
          </Link>
          <span>/</span>
          <span className="text-[#F3F3F3]">{product.title}</span>
        </div>

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-18">
          {/* Gallery */}
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
                  alt={activeImage.alt_text || product.title}
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
                  <p className="z-[1] text-[13px] text-[#5a5a5a]">
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
                        alt={img.alt_text || img.caption || product.title}
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

          {/* Purchase card */}
          <div className="static md:sticky md:top-[100px]">
            <p className="mb-4 text-xs tracking-[1px] text-[#A8A8A8]">
              {primaryCollection?.title ?? "محصولات"}
            </p>
            <h1 className="mb-5   text-[28px] font-black leading-[1.3] text-[#F3F3F3] md:text-[44px]">
              {product.title}
            </h1>
            <p
              style={{ direction: "ltr", textAlign: "right" }}
              className="mb-7 text-2xl text-[#F3F3F3]"
            >
              {selectedVariant ? (
                <>
                  ${selectedVariant.price}
                  {selectedVariant.compare_price != null &&
                    selectedVariant.compare_price > selectedVariant.price && (
                      <span className="ms-2 text-base text-[#6b6b6b] line-through">
                        ${selectedVariant.compare_price}
                      </span>
                    )}
                </>
              ) : (
                "ناموجود"
              )}
            </p>
            {description && (
              <p className="mb-9 max-w-[440px] text-[15px] leading-[1.9] text-[#A8A8A8]">
                {description}
              </p>
            )}

            {variants.length > 0 && (
              <div className="mb-8">
                <div className="mb-3.5 flex items-center justify-between">
                  <span className="text-[13px] text-[#F3F3F3]">سایز</span>
                  <Link href="#" className="text-[13px] text-[#A8A8A8] underline">
                    راهنمای سایز
                  </Link>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {variants.map((variant) => {
                    const active = selectedSize === variant.size_name;
                    const disabled = !variant.is_active || variant.stock <= 0;
                    return (
                      <button
                        key={variant.id}
                        disabled={disabled}
                        onClick={() => setSelectedSize(variant.size_name)}
                        style={{
                          direction: "ltr",
                          background: active ? "#F3F3F3" : "transparent",
                          color: active
                            ? "#090909"
                            : disabled
                              ? "#4a4a4a"
                              : "#F3F3F3",
                          borderColor: active
                            ? "#F3F3F3"
                            : "rgba(255,255,255,0.25)",
                          opacity: disabled ? 0.5 : 1,
                          cursor: disabled ? "not-allowed" : "pointer",
                        }}
                        className="min-w-12 rounded-full border px-4 py-3 text-sm transition-colors"
                      >
                        {variant.size_name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mb-7 flex items-center gap-4">
              <span className="text-[13px] text-[#F3F3F3]">تعداد</span>
              <div className="flex items-center overflow-hidden rounded-full border border-white/15">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="flex h-[42px] w-[42px] items-center justify-center bg-transparent text-lg text-[#F3F3F3]"
                >
                  −
                </button>
                <span className="w-8 text-center text-[15px] text-[#F3F3F3]">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                  className="flex h-[42px] w-[42px] items-center justify-center bg-transparent text-lg text-[#F3F3F3]"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mb-4 flex flex-wrap gap-3">
              <button
                onClick={handleAddToCart}
                disabled={!selectedVariant}
                style={{
                  opacity: selectedVariant ? 1 : 0.5,
                  cursor: selectedVariant ? "pointer" : "not-allowed",
                }}
                className="min-w-[180px] flex-1 rounded-full bg-[#F3F3F3] px-7 py-[18px] text-[15px] font-bold text-[#090909] transition-transform hover:scale-[1.02]"
              >
                افزودن به سبد خرید
              </button>
              <button
                onClick={() => toggleWishlist(product.id.toString(), product.title)}
                className="flex h-14 w-14 items-center justify-center rounded-full border border-white/25 bg-transparent text-[#F3F3F3] transition-colors hover:bg-white/[0.08]"
              >
                <HeartIcon filled={wishlisted} />
              </button>
            </div>
            <button
              onClick={handleBuyNow}
              disabled={!selectedVariant}
              style={{
                opacity: selectedVariant ? 1 : 0.5,
                cursor: selectedVariant ? "pointer" : "not-allowed",
              }}
              className="mb-10 w-full rounded-full border border-white/30 bg-transparent px-7 py-[18px] text-[15px] font-bold text-[#F3F3F3] transition-colors hover:border-white/60 hover:bg-white/[0.08]"
            >
              همین حالا بخرید
            </button>

            {accordionSections.length > 0 && (
              <div className="border-t border-white/[0.08]">
                {accordionSections.map((a) => {
                  const isOpen = openAccordion === a.key;
                  return (
                    <div key={a.key} className="border-b border-white/[0.08]">
                      <button
                        onClick={() => setOpenAccordion(isOpen ? null : a.key)}
                        className="flex w-full items-center justify-between py-5 text-right text-sm text-[#F3F3F3]"
                      >
                        {a.title}
                        <span
                          className="inline-flex transition-transform"
                          style={{
                            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                          }}
                        >
                          <ChevronDownIcon />
                        </span>
                      </button>
                      <div
                        className="grid transition-[grid-template-rows] duration-400 ease-in-out"
                        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                      >
                        <div className="overflow-hidden">
                          <p className="mb-5 text-sm leading-[1.9] text-[#A8A8A8]">
                            {a.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {recommended.length > 0 && (
        <Reveal>
          <section className="mx-auto max-w-[1400px] px-5 pt-20 md:px-16 md:pt-32">
            <h2 className="mb-10   text-[26px] font-black text-[#F3F3F3] md:text-[40px]">
              پیشنهاد می‌کنیم
            </h2>
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {recommended.map((p) => {
                const image = p.images?.[0]?.image;
                const price = p.variants?.[0]?.price;
                return (
                  <Link
                    key={p.id}
                    href={`/product/${p.slug}`}
                    className="group block overflow-hidden rounded-[20px] bg-[#181818]"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-[#111111]">
                      {image && (
                        <Image
                          src={image}
                          alt={p.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        />
                      )}
                    </div>
                    <div className="p-[18px]">
                      <p className="mb-1 text-[15px] text-[#F3F3F3]">{p.title}</p>
                      <p
                        style={{ direction: "ltr", textAlign: "right" }}
                        className="text-sm text-[#A8A8A8]"
                      >
                        {price != null ? `$${price}` : ""}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        </Reveal>
      )}

      {recentlyViewed.length > 0 && (
        <Reveal>
          <section className="mx-auto max-w-[1400px] px-5 pt-16 md:px-16 md:pt-24">
            <h2 className="mb-8   text-[22px] font-black text-[#F3F3F3] md:text-[30px]">
              بازدیدهای اخیر
            </h2>
            <div className="flex gap-5 overflow-x-auto pb-2">
              {recentlyViewed.map((p) => (
                <Link
                  key={p.id}
                  href={`/product/${p.slug}`}
                  className="flex-[0_0_140px]"
                >
                  <div className="relative mb-2.5 aspect-[4/5] overflow-hidden rounded-[14px] bg-[#111111]">
                    {p.image && (
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        sizes="140px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <p className="text-[13px] text-[#A8A8A8]">{p.title}</p>
                </Link>
              ))}
            </div>
          </section>
        </Reveal>
      )}

      <ProductFooter />

      {/* Mobile sticky purchase bar */}
      <div
        className="fixed inset-x-0 bottom-0 z-[1000] flex gap-3 border-t border-white/[0.08] bg-[#111111]/95 px-4 backdrop-blur-xl md:hidden"
        style={{
          paddingTop: 12,
          paddingBottom: "calc(12px + env(safe-area-inset-bottom))",
        }}
      >
        <button
          onClick={() => toggleWishlist(product.id.toString(), product.title)}
          className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-white/20 bg-transparent text-[#F3F3F3]"
        >
          <HeartIcon size={18} filled={wishlisted} />
        </button>
        <button
          onClick={handleAddToCart}
          disabled={!selectedVariant}
          style={{
            opacity: selectedVariant ? 1 : 0.5,
            cursor: selectedVariant ? "pointer" : "not-allowed",
          }}
          className="flex-1 rounded-full bg-[#F3F3F3] text-[15px] font-bold text-[#090909]"
        >
          افزودن به سبد · {selectedVariant ? `$${selectedVariant.price}` : "ناموجود"}
        </button>
      </div>
    </div>
  );
}
