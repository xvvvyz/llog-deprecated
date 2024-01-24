/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ['app'],
  },
  images: {
    remotePatterns: [
      {
        hostname: 'localhost',
      },
      {
        // preview
        hostname: 'dpptopbnpbbqamunlkrd.supabase.co',
        pathname: '/storage/v1/object/public/**',
        protocol: 'https',
      },
      {
        // production
        hostname: 'cnawksbzwuxsjkzeczyq.supabase.co',
        pathname: '/storage/v1/object/public/**',
        protocol: 'https',
      },
      {
        hostname: 'api.dicebear.com',
        pathname: '/7.x/shapes/png',
        protocol: 'https',
      },
    ],
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
