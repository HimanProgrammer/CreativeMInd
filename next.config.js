/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  // Lets a build run into a separate folder (NEXT_DIST_DIR=.next-check npm run build)
  // so it doesn't clobber the .next cache a running dev server is using.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  reactStrictMode: false,
  sassOptions: {
    includePaths: [path.join(__dirname, 'css')],
  },
  trailingSlash: true,
  devIndicators: {
    buildActivity: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;
