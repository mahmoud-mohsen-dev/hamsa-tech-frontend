import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '', // Leave this empty if you're not using a specific port
        pathname: '/**' // Match all paths from this domain
      }
    ]
  }
};

export default withNextIntl(nextConfig);
