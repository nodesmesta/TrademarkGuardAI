import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use standalone output to avoid webpack bundling issues on Vercel
  output: 'standalone',
  
  // Disable webpack build cache to avoid corrupted cache issues
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.cache = false;
    }
    return config;
  },
  
  // Add empty turbopack config to silence warning
  turbopack: {},
};

export default nextConfig;
