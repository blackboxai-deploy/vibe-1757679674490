import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: process.env.NODE_ENV === 'production' && process.env.BUILD_ELECTRON === 'true' ? 'export' : undefined,
  trailingSlash: true,
  images: {
    unoptimized: process.env.BUILD_ELECTRON === 'true',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/photos/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/workspace-*/image/**',
      },
      { 
        protocol: 'https', 
        hostname: 'replicate.delivery', 
        pathname: '/**', 
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
    ],
  },
  assetPrefix: process.env.BUILD_ELECTRON === 'true' ? './' : undefined,
}

export default nextConfig
