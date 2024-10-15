import createMiddleware from 'next-intl/middleware';
import {
  localePrefix,
  defaultLocale,
  locales,
  pathnames
} from './config';
import { NextResponse } from 'next/server';
import { getIdFromTokenArgs } from './utils/cookieUtils';
import { fetchGraphqlByArgsToken } from './services/graphqlCrud';
import { OrdersUserIdResponseType } from './types/orderResponseTypes';

function fetchOrderUserIdQuery(orderId: string) {
  return `
        {
          order(id: ${orderId}) {
            data {
              attributes {
                user {
                  data {
                    id
                  }
                }
              }
            }
          }
        }
      `;
}

export async function middleware(request: any) {
  const pathname = request.nextUrl.pathname;
  // Regex pattern to match paths like /ar/orders/[orderId] or /en/orders/[orderId]
  const regexPattern = /^\/(ar|en)\/orders\/\d+/;

  const pathnameArr = pathname.split('/');
  // console.log(pathnameArr);
  const locale = pathnameArr[1]; // Extract locale from the URL
  // const ordersParamsString = pathnameArr[2];

  // Check if the request is for an order page
  const isOrderPage = regexPattern.test(pathname);
  const orderId = pathnameArr[3]; // Extract orderId from the URL
  // console.log('isOrderPage: ' + isOrderPage);
  // console.log('pathname: ' + pathname);
  // console.log('orderId: ' + orderId);

  // Check if the request is for an order page
  if (isOrderPage) {
    // Get the user token from cookies
    const token: {
      name: string;
      value: string;
    } | null = request.cookies.get('token');
    // console.log('token: ' + JSON.stringify(token));
    if (!token?.value) {
      return NextResponse.redirect(
        new URL(`/${locale}/not-found`, request.url)
      ); // Redirect if no token
    }

    // Decode the token to get the user ID
    const userId = getIdFromTokenArgs(token?.value ?? null); // Implement this function to decode the token
    // console.log('userId:', userId);

    // Fetch the order's user ID from GraphQL
    const { data, error } = (await fetchGraphqlByArgsToken(
      fetchOrderUserIdQuery(orderId),
      token?.value ?? null
    )) as OrdersUserIdResponseType;
    const orderUserId =
      data?.order?.data?.attributes?.user?.data?.id ?? null;
    // console.log('orderUserId:', orderUserId);
    // console.log(Number(userId));
    // console.log(Number(orderUserId));
    // console.log(Number(userId) === Number(orderUserId));

    // Check if userId matches the order's user ID
    if (
      error ||
      userId === null ||
      orderUserId === null ||
      Number(orderUserId) !== Number(userId)
    ) {
      return NextResponse.redirect(
        new URL(`/${locale}/not-found`, request.url)
      ); // Redirect if not authorized
    }
    // If everything matches, allow the request to proceed
    // console.log('User ID matches, proceeding to the order page');
  }
  // If all checks pass, allow the request to proceed
  return NextResponse.next();
}

export default createMiddleware({
  defaultLocale,
  locales,
  localePrefix,
  pathnames
});

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
