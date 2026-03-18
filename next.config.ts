import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/Keymaker",
  assetPrefix: "/Keymaker/",
  images: { unoptimized: true },
};

export default nextConfig;
