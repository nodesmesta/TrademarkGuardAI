import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use standalone output to avoid webpack bundling issues on Vercel
  output: 'standalone',
  
  images: {
    remotePatterns: [
      { hostname: 'brightdata.com' },
      { hostname: 'kiro.dev' },
      { hostname: 'aimlapi.com' },
      { hostname: 'triggerware.ai' },
      { hostname: 'lablab.ai' },
    ],
  },

  // Disable webpack build cache to avoid corrupted cache issues
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.cache = false;
    }
    // Allow pdfjs-dist worker to be loaded as a static asset
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
    };
    return config;
  },
  
  // Add empty turbopack config to silence warning
  turbopack: {},
};

export default nextConfig;
