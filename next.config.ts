import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: 'https://job-portal-backend-1-yib6.onrender.com/:path*',
      },
    ];
  },
};

export default nextConfig;
