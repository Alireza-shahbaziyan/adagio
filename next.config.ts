import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 async headers() {
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
  output: "standalone",
  images: {
    remotePatterns: [
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
