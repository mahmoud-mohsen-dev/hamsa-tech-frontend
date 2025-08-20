import { ReactNode, Suspense } from 'react';
import { Open_Sans, Inter } from 'next/font/google';
import { getLangDir } from 'rtl-detect';
import { StoreContextProvider } from '../../context/Store';
import { NextIntlClientProvider } from 'next-intl';
import {
  getMessages,
  getTranslations,
  unstable_setRequestLocale
} from 'next-intl/server';
import { locales } from '@/config';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import ConfigAntThemes from '@/lib/ConfigAntThemes';
import Header from '@/components/AppLayout/Header';
import Main from '@/components/AppLayout/Main';
import ErrorComponent from './error';
import Loading from './loading';
import { fetchGraphql } from '@/services/graphqlCrud';
import { LayoutResponse } from '@/types/getIndexLayout';
import Footer from '@/components/AppLayout/Footer';
import ScrollNavbarListener from '@/components/UI/navbar/ScrollNavbarListener';
import { NavbarProductsCategoriesResponseType } from '@/types/getNavbarProductsCategories';
import AppDrawer from '@/components/UI/cart/AppDrawer';
import SWRConfigProvider from '@/lib/SWRConfigProvider';
// import { getProductsQuery } from '@/services/products';
// import { ProductsResponseType } from '@/types/getProducts';
import { UserProvider } from '@/context/UserContext';
import Script from 'next/script';
import ChatwootWidget from '@/components/UI/ChatwootWidget';
import { BlogContextProvider } from '@/context/BlogContext';
import MessageContextComponent from '@/components/UI/MessageContextComponent';
// import ChatwootWidget from '@/components/UI/ChatwootWidget';

const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
  //👇 Add variable to our object
  variable: '--font-opensans'
});

//👇 Configure the object for our second font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

type PropsType = {
  children: ReactNode;
  params: { locale: string };
};

export const revalidate = 60; // invalidate every 60 seconds

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale }
}: Omit<PropsType, 'children'>) {
  const t = await getTranslations({
    locale,
    namespace: 'HomePage.metaData'
  });

  const siteUrl = process.env.BASE_URL || 'https://hamsatech-eg.com'; // Base URL of your site
  // const faviconUrl = `${siteUrl}/favicon.ico`;
  const isArabic = locale === 'ar';
  const wideImgUrl = `${siteUrl}/icons/social-meta-tag-img-wide-${isArabic ? 'ar' : 'en'}.png`;

  const openGraph = {
    type: 'website',
    title: t('title'),
    description: t('description'),
    url: `${siteUrl}/${locale}`,
    images: [
      {
        url: wideImgUrl,
        width: 1200,
        height: 630,
        alt:
          isArabic ?
            'Hamsa Tech - Quality Surveillance and Technology Solutions'
          : 'همسة تك - أنظمة مراقبة وحلول تكنولوجيا عالية الجودة'
      },
      {
        url: `${siteUrl}/icons/social-meta-tag-img-rectangle.png`,
        width: 1000,
        height: 1000,
        alt:
          isArabic ?
            'Hamsa Tech - Quality Surveillance and Technology Solutions'
          : 'همسة تك - أنظمة مراقبة وحلول تكنولوجيا عالية الجودة'
      }
    ],
    locale: isArabic ? 'ar_EG' : 'en_US',
    siteName: isArabic ? 'همسة تك' : 'Hamsa Tech'
  };

  const twitter = {
    card: 'summary_large_image',
    site: '@hamsa_tech', // Your Twitter handle
    title: t('title'),
    description: t('description'),
    image: wideImgUrl,
    imageAlt: t('title')
  };

  const metadata = {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    alternates: {
      canonical: isArabic ? `${siteUrl}/ar` : `${siteUrl}/en`,
      languages: {
        en: `${siteUrl}/en`,
        ar: `${siteUrl}/ar`
      }
    },
    openGraph: openGraph,
    twitter: twitter,
    robots: 'index, follow',
    googlebot: 'index, follow',
    canonical: `${siteUrl}/${locale}`
  };

  return metadata;
}

const getQueryLayoutPage = (locale: string) => `{
  pages(locale: "${locale ?? 'en'}") {
    data {
      attributes {
        navbar {
                ... on ComponentLinkLink {
                    id
                    name
                    slug
                }
        }
        footer {
          description
          contact_us_phone
          contact_us_email
          social_links {
            id
            url
            icon
          }
          quick_links {
            id
            name
            slug
          }
          terms {
              id
              name
              slug
          }
        }
      }
    }
  }
}`;

const getQueryNavbarCategoriesProducts = (locale: string) => `{
  categories(locale: "${locale ?? 'en'}", sort: "order:asc") {
    data {
      id
      attributes {
        name
        slug
        sub_categories {
            data {
                id
                attributes {
                    name
                    slug 
                    image {
                        data {
                            attributes {
                                url
                                alternativeText
                            }
                        }
                    }
                }
            }
        }
      }
    }
  }
}`;

export default async function LocaleLayout({
  children,
  params: { locale }
}: PropsType) {
  unstable_setRequestLocale(locale);

  // Providing all messages to the client
  const messages = await getMessages();
  const direction = getLangDir(locale);

  const layoutData = (await fetchGraphql(
    getQueryLayoutPage(locale)
  )) as LayoutResponse;
  // console.log(JSON.stringify(layoutData));
  const layoutAttributes =
    layoutData?.data?.pages?.data[0]?.attributes ?? null;

  if (!layoutData.data === null || layoutData.error) {
    // console.log(JSON.stringify(layoutData));
    console.error('Failed to fetch navbar and footer data'); // Let Next.js handle the error
  }

  const navbarProductsCategoriesResponse = (await fetchGraphql(
    getQueryNavbarCategoriesProducts(locale)
  )) as NavbarProductsCategoriesResponseType;
  // console.log(JSON.stringify(layoutData));
  const navbarProductsCategoriesData =
    navbarProductsCategoriesResponse?.data?.categories?.data ?? null;
  const navbarProductsCategoryError =
    navbarProductsCategoriesResponse?.error ?? null;

  if (
    navbarProductsCategoriesData === null ||
    navbarProductsCategoryError
  ) {
    console.log(navbarProductsCategoryError);
    console.error('Failed to fetch navbar products categories data'); // Let Next.js handle the error
  }

  // const { data: productsData, error: productsError } =
  //   (await fetchGraphql(
  //     getProductsQuery(
  //       `locale: "${locale ?? 'en'}" , pagination: { page: 1, pageSize: 20 }`
  //     )
  //   )) as ProductsResponseType;

  // if (productsError || !productsData) {
  //   console.log('Error fetching products');
  //   console.error(productsError);
  // }

  // console.log(JSON.stringify(productsData));

  // console.log(JSON.stringify(navbarProductsCategoriesData));

  return (
    <html
      className={`${openSans.variable} ${inter.variable}`}
      lang={locale}
      dir={direction}
    >
      {/* <head>
        <link
          rel='icon'
          type='image/png'
          href='/icons/favicon-48x48.png'
          sizes='48x48'
        />
        <link
          rel='icon'
          type='image/svg+xml'
          href='/icons/favicon.svg'
        />
        <link rel='shortcut icon' href='/icons/favicon.ico' />
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/icons/apple-touch-icon.png'
        />
        <meta
          name='apple-mobile-web-app-title'
          content='Hamsa Tech'
        />
        <link rel='manifest' href='/src/app/site.webmanifest' />
      </head> */}
      <body className='flex h-full flex-col bg-white text-black-light'>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <StoreContextProvider
            initialProductsData={
              // (
              //   productsData?.products?.data &&
              //   productsData?.products?.data.length > 0
              // ) ?
              //   productsData?.products?.data
              // : []
              []
            }
          >
            <BlogContextProvider>
              <UserProvider>
                <SWRConfigProvider>
                  <AntdRegistry>
                    <ConfigAntThemes>
                      <div
                        className={`content grid min-h-screen grid-cols-1 grid-rows-[1fr_auto] bg-white text-gray-normal`}
                      >
                        {(layoutData.error ||
                          layoutData.data === null) && (
                          <ErrorComponent
                            error={
                              layoutData.error ||
                              ('Error fetching nav items' as any)
                            }
                          />
                        )}
                        {layoutAttributes.navbar && (
                          <>
                            <ScrollNavbarListener />
                            <Header
                              navLinks={layoutAttributes.navbar}
                              productsSubNav={
                                navbarProductsCategoriesData
                              }
                            />
                            <AppDrawer />
                            <MessageContextComponent />
                          </>
                        )}
                        <Suspense fallback={<Loading />}>
                          <Main>{children}</Main>
                        </Suspense>
                        {layoutAttributes.footer && (
                          <Footer data={layoutAttributes.footer} />
                        )}
                      </div>
                    </ConfigAntThemes>
                  </AntdRegistry>
                </SWRConfigProvider>
              </UserProvider>
            </BlogContextProvider>
          </StoreContextProvider>
        </NextIntlClientProvider>
      </body>
      <ChatwootWidget />

      {process.env.UMAMI_URL && process.env.UMAMI_WEBSITE_ID && (
        <Script
          defer
          src={process.env.UMAMI_URL}
          data-website-id={process.env.UMAMI_WEBSITE_ID}
        />
      )}
    </html>
  );
}
