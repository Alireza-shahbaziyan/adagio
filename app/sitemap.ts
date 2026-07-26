import type { MetadataRoute } from "next";

const BASE_URL = "https://adagiostyle.ir";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/about",
    "/contact-me",
    "/store",
    "/store/categories",
    "/store/collections",
    "/store/order-guide",
    "/terms",
  ];

  const staticPages = staticRoutes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.7,
  }));


  const products = await fetch(
    `${process.env.API_URL}/products/`,
    {
      next: {
        revalidate: 3600,
      },
    }
  ).then((res) => res.json());


  const productPages = products.results.map((product: any) => ({
    url: `${BASE_URL}/store/product/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));


 
  const collections = await fetch(
    `${process.env.API_URL}/collections/`,
    {
      next: {
        revalidate: 3600,
      },
    }
  ).then((res) => res.json());


  const collectionPages = collections.results.map(
    (collection: any) => ({
      url: `${BASE_URL}/store/collections/${collection.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })
  );


  return [
    ...staticPages,
    ...productPages,
    ...collectionPages,
  ];
}