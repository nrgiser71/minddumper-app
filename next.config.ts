import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Reduce preload warnings
  experimental: {
    optimizePackageImports: ['@/components', '@/lib']
  },
  
  // Disable aggressive resource preloading that causes console warnings
  reactStrictMode: true,
  
  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: true,
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      },
      {
        // Extra security for admin routes
        source: '/admin/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, max-age=0'
          }
        ]
      },
      {
        // API routes security
        source: '/api/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          }
        ]
      }
    ]
  },
  
  // Redirects for waitlist functionality
  async redirects() {
    return [
      {
        source: '/register',
        destination: '/minddump-waitlist',
        permanent: false,
      },
      {
        source: '/waitlist',
        destination: '/minddump-waitlist',
        permanent: false,
      },
      {
        source: '/admin/login',
        destination: '/admin-login',
        permanent: false,
      },
      {
        source: '/login',
        destination: '/admin-login',
        permanent: false,
      },
      {
        source: '/home',
        destination: '/landing',
        permanent: false,
      },
      // Redirect root to waitlist during pre-launch
      {
        source: '/',
        destination: '/minddump-waitlist',
        permanent: false,
      },
    ]
  },
  
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
