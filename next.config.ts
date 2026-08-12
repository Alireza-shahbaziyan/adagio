import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    // Keep non-production environments out of search results without affecting the live site.
    if (process.env.NODE_ENV === "production") return [];

    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      { source: "/products/:slug", destination: "/store/products/:slug" },
      { source: "/collections/:slug", destination: "/store/collections/:slug" },
      { source: "/wishlist", destination: "/store/wishlist" },
      { source: "/cart", destination: "/store/cart" },
      { source: "/categories", destination: "/store/categories" },
    ];
  },
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "trustseal.enamad.ir",
      },
      {
        protocol: "https",
        hostname: "api.adagiostyle.ir",
      },
      {
        protocol: "http",
        hostname: "api.adagiostyle.ir",
      },
      {
        protocol: "http",
        hostname: "185.110.191.14",
        port: "8008",
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;
