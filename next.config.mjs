/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // The site is deployable as a static export (GitHub Pages), so keep images unoptimized.
    unoptimized: true,
  },
};

export default nextConfig;
