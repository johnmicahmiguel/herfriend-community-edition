/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      "localhost",
      "res.cloudinary.com",
      "lh3.googleusercontent.com",
      "platform-lookaside.fbsbx.com",
      "avatars.githubusercontent.com",
      "images.unsplash.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  serverExternalPackages: [
    // Include any packages that were previously in serverComponentsExternalPackages
    // For example:
    // 'package-name',
  ],
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
    turbo: {},
  },
  webpack: (config) => {
    config.externals = [...config.externals, "canvas", "jsdom"];
    return config;
  },
};

module.exports = nextConfig;
