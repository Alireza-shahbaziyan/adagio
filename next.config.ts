import type { NextConfig } from "next";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
const backendHostname = backendUrl ? new URL(backendUrl).hostname : "0.0.0.0";
const nextConfig: NextConfig = {
  /* config options here */
  // Self-contained server build for Docker — copies only traced files/deps
  // instead of the full node_modules into the runtime image.
  output: "standalone",
  images: {
    domains: ["127.0.0.1", "localhost", backendHostname],
  },
};

export default nextConfig;
