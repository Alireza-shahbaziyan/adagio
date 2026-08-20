// components/seo/BreadcrumbJsonLd.tsx

import type { Product } from "@/types/singleProduct";

interface Props {
  product: Product;
}

export function BreadcrumbJsonLd({ product }: Props) {
  const jsonLd = {
    "@context": "https://schema.org",

    "@type": "BreadcrumbList",

    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "خانه",
        item: "https://adagiostyle.ir/store/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "تیشرت",
        item: "https://adagiostyle.ir/store/categories/t-shirts",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.title,
        item: `https://adagiostyle.ir/store/products/${product.slug}`,
      },
    ],
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