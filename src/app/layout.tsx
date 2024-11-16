import { ReactNode } from 'react';
import '@/styles/globals.css';

export async function generateMetadata() {
  const siteUrl = process.env.BASE_URL || 'https://hamsatech-eg.com'; // Base URL of your site
  const faviconUrl = `${siteUrl}/favicon.ico`;
  const metaObject = {
    title: 'Hamsa Tech Store',
    description:
      'Explore Hamsa Tech for high-quality security systems, surveillance cameras, POS solutions, access control devices, and more, with tailored solutions from trusted brands.',
    keywords:
      'hamsa tech, security systems, surveillance cameras, POS solutions, access control, Hikvision, Ezviz, Zkteco, smart security, home security, business security, technology solutions'
  };

  const openGraph = {
    type: 'website',
    title: metaObject.title,
    description: metaObject.description,
    url: `${siteUrl}`,
    images: [
      {
        url: faviconUrl,
        width: 1200,
        height: 630,
        alt: 'Hamsa Tech - Quality Surveillance and Technology Solutions'
      }
    ],
    site_name: 'Hamsa Tech'
  };

  const twitter = {
    card: 'summary_large_image',
    site: '@hamsa_tech', // Your Twitter handle
    title: metaObject.title,
    description: metaObject.description,
    image: faviconUrl,
    imageAlt: metaObject.title
  };

  const metadata = {
    title: metaObject.title,
    description: metaObject.description,
    keywords: metaObject.keywords,
    alternates: {
      // canonical: isArabic ? `${siteUrl}/ar` : `${siteUrl}/en`,
      languages: {
        en: `${siteUrl}/en`,
        ar: `${siteUrl}/ar`
      }
    },
    openGraph: openGraph,
    twitter: twitter,
    robots: 'index, follow',
    googlebot: 'index, follow'
    // canonical: `${siteUrl}/${locale}`
  };

  return metadata;
}

type Props = {
  children: ReactNode;
};

// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.
export default function RootLayout({ children }: Props) {
  return children;
}
