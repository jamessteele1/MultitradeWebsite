/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    // For production, add your CDN domain here:
    // { protocol: "https", hostname: "your-cdn.vercel-storage.com" },
  },
};

module.exports = nextConfig;
