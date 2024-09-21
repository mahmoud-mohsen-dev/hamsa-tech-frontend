import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['freshcart.codescandy.com', 'res.cloudinary.com']
  }
};

export default withNextIntl(nextConfig);
