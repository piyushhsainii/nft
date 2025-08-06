import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  resolve: {
    fullySpecified: false,
    extensionAlias: {
      ".js": [".ts", ".js"],
    },
  },
};

export default nextConfig;
