import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Other Next.js config options...
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "apneajyhbpncbciasirk.supabase.co",
      },
    ],
  },
  webpack(config) {
    config.resolve.fullySpecified = false;
    config.resolve.extensionAlias = {
      ".js": [".ts", ".js"],
    };
    return config;
  },
};

export default nextConfig;
