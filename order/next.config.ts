import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static export — deployed to Cloudflare Pages (Pages Functions handle the API).
  output: "export",
  turbopack: {
    root: __dirname,
  },
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
