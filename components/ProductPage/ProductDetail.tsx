"use client";
import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import ProductFooter from "@/components/ProductFooter";
import { useAppState } from "@/lib/app-state";
import { useAddCartItem } from "@/lib/cart";
import { useWishlistToggle } from "@/lib/wishlist";
import { useRecentlyViewed } from "@/lib/hooks";
import { Product } from "@/types/singleProduct";
import type {
  Product as ProductSummary,
  ProductImage,
  ProductVariant,
} from "@/types/products";
import Recommended from "./Recommended";
import ProductBreadcrumb from "./ProductBreadcrumb";
import ProductGallery from "./ProductGallery";
import ProductSizeSelector from "./ProductSizeSelector";
import ProductQuantityStepper from "./ProductQuantityStepper";
import ProductActions from "./ProductActions";
import ProductAccordion from "./ProductAccordion";
import ProductMobileBar from "./ProductMobileBar";

export default function ProductDetail({
  product,
  recommended = [],
}: {
  product: Product;
  recommended?: ProductSummary[];
}) {
  
  const { showToast } = useAppState();
  const addCartItem = useAddCartItem();
  const {
    isWishlisted: wishlisted,
    toggle: toggleWishlist,
    isPending: wishlistPending,
  } = useWishlistToggle(product.slug, product.title);

  const images = useMemo<ProductImage[]>(
    () =>
      [...(product.images ?? [])].sort(
        (a, b) => Number(b.is_primary) - Number(a.is_primary),
      ),
    [product.images],
  );

  const variants = product.variants ?? [];
  const primaryCollection = product.collections?.[0];
  const description = product.description ||"توضیحات این محصول ثبت نشده. ";
  const short_dec = product.short_description ?? "توضیحاتی برای این محصول ثبت نشده."
  const accordionSections = useMemo(() => {
    const sections: { key: string; title: string; content: string }[] = [];
    if (description) {
      sections.push({
        key: "description",
        title: "توضیحات کامل محصول",
        content: description,
      });
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

  const [selectedSize, setSelectedSize] = useState<
    ProductVariant["size_name"] | null
  >(
    () =>
      variants.find((v) => v.is_active && v.stock > 0)?.size_name ??
      variants[0]?.size_name ??
      null,
  );
  const [qty, setQty] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<string | null>(
    accordionSections[0]?.key ?? null,
  );

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

  const handleAddToCart = () => {
    if (!selectedVariant) {
      showToast("این محصول موجود نیست");
      return;
    }
    addCartItem.mutate(
      { sku: selectedVariant.sku, quantity: qty },
      {
        onSuccess: () =>
          showToast(
            `${qty} عدد اضافه شد — ${product.title}، سایز ${selectedVariant.size_name}`,
          ),
        onError: () => showToast("افزودن به سبد خرید ناموفق بود"),
      },
    );
  };

  const handleBuyNow = () => {
    if (!selectedVariant) {
      showToast("این محصول موجود نیست");
      return;
    }
    showToast("این بخش کامل نیست . لطفا از سبد خرید استفاده کنید");
  };

  return (
    <div
      dir="rtl"
      lang="fa"
      className="relative min-h-screen bg-primary-foreground pb-24 text-white md:pb-0"
    >
      <Navbar
        variant="product"
        productWishlisted={wishlisted}
        onToggleProductWishlist={toggleWishlist}
      />

      <div className="mx-auto max-w-350 px-5 pt-8 md:px-16 md:pt-12">
        <ProductBreadcrumb
          collections={product.collections}
          productTitle={product.title}
        />

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-18">
          <ProductGallery images={images} productTitle={product.title} />

          {/* Purchase card */}
          <div className="static md:sticky md:top-[100px]">
            <p className="mb-4 text-xs tracking-[1px] text-muted-foreground">
              {primaryCollection?.title ?? "محصولات"}
            </p>
            <h1 className="mb-5   text-[28px] font-black leading-[1.3] text-foreground md:text-[44px]">
              {product.title}
            </h1>
            <p
              style={{ direction: "ltr", textAlign: "right" }}
              className="mb-7 text-2xl text-foreground"
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
            
              <p className="mb-9 max-w-110 text-[15px] leading-[1.9] text-muted-foreground">
                {short_dec}
              </p>
          

            <ProductSizeSelector
              variants={variants}
              selectedSize={selectedSize}
              onSelectSize={setSelectedSize}
            />

            <ProductQuantityStepper qty={qty} maxQty={maxQty} setQty={setQty} />

            <ProductActions
              selectedVariant={selectedVariant}
              addToCartPending={addCartItem.isPending}
              onAddToCart={handleAddToCart}
              wishlisted={wishlisted}
              wishlistPending={wishlistPending}
              onToggleWishlist={toggleWishlist}
              onBuyNow={handleBuyNow}
            />

            <ProductAccordion
              sections={accordionSections}
              openKey={openAccordion}
              setOpenKey={setOpenAccordion}
            />
          </div>
        </div>
      </div>

      <Recommended recentlyViewed={recentlyViewed} recommended={recommended} />

      <ProductFooter />

      <ProductMobileBar
        wishlisted={wishlisted}
        wishlistPending={wishlistPending}
        onToggleWishlist={toggleWishlist}
        selectedVariant={selectedVariant}
        addToCartPending={addCartItem.isPending}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}
