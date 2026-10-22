import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML export to out/ — deployable to any static host, no server needed.
  output: "export",
  // Emit /products/export/index.html instead of /products/export.html so plain static hosts resolve URLs.
  trailingSlash: true,
  images: {
    // Images are pre-optimized to WebP by scripts/generate-images.mjs, since static export
    // has no image optimization server.
    unoptimized: true,
  },
  experimental: {
    agentFeedback: true,
  },
  // cacheComponents / partialPrefetching are not used: they rely on Partial Prerendering,
  // which Next.js does not support together with `output: "export"`.
};

export default nextConfig;
