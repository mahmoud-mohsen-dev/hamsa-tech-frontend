import createMiddleware from 'next-intl/middleware';
import {
  localePrefix,
  defaultLocale,
  locales,
  pathnames
} from './config';

export default createMiddleware({
  defaultLocale,
  locales,
  localePrefix,
  pathnames
});

// export default function customMiddleware(request: any) {
//   // Get the pathname from the request
//   const pathname = request.nextUrl.pathname;

//   // Use the default next-intl middleware
//   const intlMiddleware = createMiddleware({
//     defaultLocale,
//     locales,
//     localePrefix,
//     pathnames
//   });

//   // Add the pathname as a custom header
//   const response = intlMiddleware(request);
//   response.headers.set('x-pathname', pathname);

//   return response;
// }

export const config = {
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',

    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    '/(ar|en)/:path*',

    // Enable redirects that add missing locales
    // (e.g. `/pathnames` -> `/en/pathnames`)
    '/((?!_next|_vercel|.*\\..*).*)'
  ]
};
