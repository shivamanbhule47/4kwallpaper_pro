/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  async generateMetadata() {
    return {
      metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://4kwallpaper.blog'),
    };
  },
};

module.exports = nextConfig;
