import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
});

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {},
  async rewrites() {
    const rawTarget = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://smb-portal-1.onrender.com';
    const apiTarget = rawTarget.replace(/\/$/, '');
    return [
      {
        source: '/api/:path*',
        destination: `${apiTarget}/:path*`,
      },
    ];
  },
};

export default withPWA(nextConfig);
