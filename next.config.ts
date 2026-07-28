import type { NextConfig } from "next";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
const backendHostname = backendUrl ? new URL(backendUrl).hostname : "0.0.0.0";
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
    domains: ["127.0.0.1", "localhost", backendHostname],
  },
};

export default nextConfig;
