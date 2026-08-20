
import type { Product } from "@/types/singleProduct";

interface ProductJsonLdProps {
  product: Product;
}

export function ProductJsonLd({
  product,
}: ProductJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",

    name: product.title,

    description: product.description,

    url: `https://adagiostyle.ir/store/products/${product.slug}`,

    image: product.images
      .filter((image) => image.is_primary || image.media_kind === "gallery")
      .map((image) => image.image),

    brand: {
      "@type": "Brand",
      name: "ADAGIO",
    },

    category: "تیشرت",

    offers: {
      "@type": "AggregateOffer",

      url: `https://adagiostyle.ir/store/products/${product.slug}`,

      priceCurrency: "IRR",

      lowPrice: Math.min(
        ...product.variants
          .filter((variant) => variant.is_active)
          .map((variant) => variant.price)
      ),

      highPrice: Math.max(
        ...product.variants
          .filter((variant) => variant.is_active)
          .map((variant) => variant.price)
      ),

      offerCount: product.variants.filter(
        (variant) => variant.is_active
      ).length,

      availability:
        product.variants.some(
          (variant) =>
            variant.is_active && variant.stock > 0
        )
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd),
      }}
    />
  );
}