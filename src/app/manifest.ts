import { MetadataRoute } from 'next';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  return {
    name: 'Hamsa Tech',
    short_name: 'Hamsa',
    description:
      'Hamsa Tech Store for selling surveillance cameras · Barcode and cashier devices · Sound systems · Networks · Fingerprint device · Surveillance cameras · Barcode and cashier devices.',
    start_url: '/index.html',
    display: 'standalone',
    theme_color: '#ffffff',
    background_color: '#ffffff',
    icons: [
      {
        src: '/icons/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icons/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }
    ]
  };
}
