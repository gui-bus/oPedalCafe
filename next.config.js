/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects() {
    return [
      {
        source: "/",
        destination: "/login",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        hostname: 'localhost',
      },
    ],
  },
};

module.exports = nextConfig;
