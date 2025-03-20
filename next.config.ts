import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  // async redirects() {
  //   return [
  //     {
  //       source: '/login',
  //       destination: '/dashboard',
  //       permanent: false,
  //     },
  //   ];
  // },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ocpggxfbtsykepvdatwz.supabase.co',
        port: '',
        pathname: '/storage/**',
        search: '',
      },
    ],
  },
  serverExternalPackages: ['@react-pdf/renderer'],
};

export default nextConfig;
