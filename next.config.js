/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ['app'],
  },
  experimental: {
    appDir: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: 'localhost',
      },
      {
        hostname: 'wclvpnzwnnxesdichytr.supabase.co',
        pathname: '/storage/v1/object/public/**',
        protocol: 'https',
      },
      {
        hostname: 'cnawksbzwuxsjkzeczyq.supabase.co',
        pathname: '/storage/v1/object/public/**',
        protocol: 'https',
      },
    ],
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
