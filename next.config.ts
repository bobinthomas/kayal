import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static export — deployed to Cloudflare Pages (Pages Functions handle forms).
  output: "export",
  turbopack: {
    root: __dirname,
  },
  trailingSlash: true,
  images: {
    // Static export has no image optimizer; assets are pre-optimized via scripts/optimize-images.mjs.
    unoptimized: true,
  },
};

export default nextConfig;
