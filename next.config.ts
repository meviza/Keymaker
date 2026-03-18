import type { NextConfig } from "next";

const isGhPages = process.env.NEXT_PUBLIC_BASE_PATH === "/Keymaker";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isGhPages ? "/Keymaker" : "",
  assetPrefix: isGhPages ? "/Keymaker/" : undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
