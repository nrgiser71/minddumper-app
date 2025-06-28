import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Reduce preload warnings
  experimental: {
    optimizePackageImports: ['@/components', '@/lib']
  },
  
  // Disable aggressive resource preloading that causes console warnings
  reactStrictMode: true,
  
  // Webpack optimization to reduce CSS preload warnings
  webpack: (config, { dev, isServer }) => {
    if (!isServer && !dev) {
      // Optimize CSS chunking in production to reduce preload warnings
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          default: false,
          vendors: false,
          // Bundle all CSS together to avoid unused preloads
          styles: {
            name: 'styles',
            type: 'css/mini-extract',
            chunks: 'all',
            enforce: true
          }
        }
      }
    }
    return config
  }
};

export default nextConfig;
