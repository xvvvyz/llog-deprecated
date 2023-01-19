module.exports = {
  experimental: { appDir: true },
  images: {
    remotePatterns: [
      {
        hostname: 'localhost',
      },
      {
        hostname: 'vbhrtetvnskirfdjhinz.supabase.co',
        pathname: '/storage/v1/object/public/**',
        protocol: 'https',
      },
    ],
  },
  reactStrictMode: true,
};
