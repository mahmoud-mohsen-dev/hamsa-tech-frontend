import { MetadataRoute } from 'next';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  return {
    name: 'My Awesome Web App',
    short_name: 'MyApp',
    description: 'An awesome web app for users',
    start_url: '/index.html',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        type: 'image/png',
        sizes: '192x192'
      },
      {
        src: '/icons/icon-512x512.png',
        type: 'image/png',
        sizes: '512x512'
      }
    ]
  };
}
