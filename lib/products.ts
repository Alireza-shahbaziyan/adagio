export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  collection: "black" | "white";
};

export const PRODUCTS: Product[] = [
  {
    id: "feather",
    slug: "feather",
    name: "تیشرت پر ساکت",
    price: 68,
    image: "/assets/tee-feather.webp",
    collection: "black",
  },
  {
    id: "silhouette",
    slug: "silhouette",
    name: "تیشرت سایه‌ی هودی",
    price: 68,
    image: "/assets/tee-silhouette.jpg",
    collection: "black",
  },
  {
    id: "collage",
    slug: "collage",
    name: "کلاژ شماره ۰۱",
    price: 72,
    image: "/assets/tee-collage.avif",
    collection: "black",
  },
  {
    id: "newsprint",
    slug: "newsprint",
    name: "تیشرت چاپ آرشیوی",
    price: 72,
    image: "/assets/tee-newsprint.jpg",
    collection: "black",
  },
];

export const COLLECTION_LABEL: Record<Product["collection"], string> = {
  black: "کالکشن مشکی",
  white: "کالکشن سفید",
};

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getOtherProducts(currentId: string): Product[] {
  return PRODUCTS.filter((p) => p.id !== currentId);
}

export const PRODUCT_DESCRIPTION =
  "یک چاپ آرشیوی دست‌چین‌شده، فیت اورسایز، پنبه‌ی سنگین ۱۰۰٪. طوری ساخته شده که مثل عکسی که زیر آفتاب مانده، زیبا کهنه شود.";

export const PRODUCT_ACCORDION = [
  {
    key: "description",
    title: "توضیحات",
    content:
      "یک چاپ آرشیوی دست‌چین‌شده در قابی واحد، روی پنبه‌ی رنگ‌شده‌ی سنگین. فیت جعبه‌ای و اورسایز — طراحی‌شده برای پوشیدن گشاد.",
  },
  {
    key: "material",
    title: "جنس و نگهداری",
    content:
      "پنبه‌ی شانه‌ای سنگین ۱۰۰٪، ۲۴۰ گرم. شستشوی سرد و پشت‌ورو، بدون سفیدکننده، خشک‌کن ملایم. چاپ پایه‌آبی است و به‌مرور زمان عمداً ترک می‌خورد.",
  },
  {
    key: "shipping",
    title: "ارسال و مرجوعی",
    content:
      "ارسال رایگان برای سفارش‌های بالای ۱۰۰ دلار. تحویل طی ۳ تا ۶ روز کاری. کالای پوشیده‌نشده تا ۳۰ روز قابل مرجوع است.",
  },
];

export const SIZES = ["S", "M", "L", "XL", "XXL"];
