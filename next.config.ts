import type { NextConfig } from "next";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
const backendHostname = backendUrl ? new URL(backendUrl).hostname : "0.0.0.0";
const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["127.0.0.1", "localhost", backendHostname],
  },
};

export default nextConfig;
