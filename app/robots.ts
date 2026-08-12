import { frontend } from "@/utils/getURL";
import type { MetadataRoute } from "next";


export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/store/cart", "/store/wishlist", "/login", "/api/"],
    },
    sitemap: `${frontend}/sitemap.xml`,
    host: frontend,
  };
}
