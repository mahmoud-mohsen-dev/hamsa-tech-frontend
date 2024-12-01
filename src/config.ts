import { Pathnames, LocalePrefix } from 'next-intl/routing';

export const defaultLocale = 'en' as const;
export const locales = ['en', 'ar'] as const;

export const pathnames: Pathnames<typeof locales> = {
  '/': '/',
  '/products': '/products',
  '/offers': '/offers',
  '/blog': '/blog',
  '/blog/page': '/blog/page',
  '/about-us': '/about-us',
  '/support': '/support',
  '/wishlist': '/wishlist',
  '/signin': '/signin',
  '/signup': '/signup',
  '/forget-password': '/forget-password',
  '/change-password': '/change-password',
  '/otp-verification': '/otp-verification',
  '/checkout': '/checkout',
  '/not-found': '/not-found'
};

export const localePrefix: LocalePrefix<typeof locales> = 'always';

export const port = process.env.PORT || 3000;
export const host =
  process.env.BASE_URL ?
    `https://${process.env.BASE_URL}`
  : `http://localhost:${port}`;
