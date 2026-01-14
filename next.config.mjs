/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    formats: ['image/webp'],
    deviceSizes: [640, 828, 1200],
    imageSizes: [64, 128, 256],
    minimumCacheTTL: 60,
    unoptimized: process.env.NODE_ENV === 'development', // Skip optimization in dev
  },
};

export default nextConfig;
