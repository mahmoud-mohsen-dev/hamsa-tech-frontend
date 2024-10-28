import createMiddleware from 'next-intl/middleware';
import {
  localePrefix,
  defaultLocale,
  locales,
  pathnames
} from './config';
import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
import { getIdFromTokenArgs } from './utils/cookieUtils';

import { OrdersUserIdResponseType } from './types/orderResponseTypes';
import { fetchGraphqlServerWebAuthenticated } from './services/graphqlCrudServerOnly';

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

const handleI18nRouting = createMiddleware({
  defaultLocale,
  locales,
  localePrefix,
  pathnames
});

// New function to handle order page-specific logic
async function orderPageHandler(
  request: NextRequest,
  locale: string,
  orderId: string
) {
  // Get the user token from cookies
  const token = request.cookies.get('token')?.value;
  console.log('token', token);

  if (!token) {
    request.nextUrl.pathname = `/${locale}/not-found`; // Redirect if no token
    // return NextResponse.redirect(request.nextUrl);
    return request; // Allow the request to proceed
  }

  // Decode the token to get the user ID
  const userId = getIdFromTokenArgs(token);
  console.log('userId', userId);

  // Fetch the order's user ID from GraphQL
  const { data, error } = (await fetchGraphqlServerWebAuthenticated(
    fetchOrderUserIdQuery(orderId)
  )) as OrdersUserIdResponseType;

  const orderUserId =
    data?.order?.data?.attributes?.user?.data?.id ?? null;
  console.log('orderUserId', orderUserId);

  // Check if the user ID matches the order's user ID
  if (
    error ||
    !userId ||
    !orderUserId ||
    Number(orderUserId) !== Number(userId)
  ) {
    request.nextUrl.pathname = `/${locale}/not-found`;
    return request;
    // return NextResponse.redirect(request.nextUrl);
  }

  console.log(request.nextUrl.pathname);

  return request; // Allow the request to proceed
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Exclude API routes from being handled by next-intl middleware
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Regex pattern to match paths like /ar/orders/[orderId] or /en/orders/[orderId]
  const regexPattern = /^\/(ar|en)\/account\/orders\/\d+/;

  const pathnameArr = pathname.split('/');
  const locale = pathnameArr[1]; // Extract locale from the URL

  // Check if the request is for an order page
  const isOrderPage = regexPattern.test(pathname);
  const orderId = pathnameArr[4]; // Extract orderId from the URL
  // Check if the request is for an order page
  if (isOrderPage) {
    console.log('isOrderPage', isOrderPage);
    console.log(pathname);
    console.log(orderId);
    await orderPageHandler(request, locale, orderId);
  }

  // Run next-intl middleware
  const response = handleI18nRouting(request);
  return response;
}

export const config = {
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',

    // Match all locale-prefixed paths
    '/(ar|en)/:path*',

    // Exclude _next, _vercel, API, and static files
    '/((?!_next|_vercel|.*\\..*|api).*)'
  ]
};
