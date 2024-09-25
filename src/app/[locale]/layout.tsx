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
import ConfigAntThemes from '@/components/Theme/ConfigAntThemes';
import Header from '@/components/AppLayout/Header';
import Main from '@/components/AppLayout/Main';
import ErrorComponent from './error';
import Loading from './loading';
import { fetchGraphql } from '@/services/graphqlCrud';
import { LayoutResponse } from '@/types/getIndexLayout';
import Footer from '@/components/AppLayout/Footer';
import ScrollNavbarListener from '@/components/UI/navbar/ScrollNavbarListener';
import { NavbarProductsCategoriesResponseType } from '@/types/getNavbarProductsCategories';

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

export const revalidate = 120; // invalidate every 60 seconds

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

  return {
    title: t('title'),
    description: t('description')
  };
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
        }
      }
    }
  }
}`;

const getQueryNavbarCategoriesProducts = (locale: string) => `{
  categories(locale: "${locale ?? 'en'}") {
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

  // console.log(JSON.stringify(navbarProductsCategoriesData));

  return (
    <html
      className={`${openSans.variable} ${inter.variable}`}
      lang={locale}
      dir={direction}
    >
      <body className='flex h-full flex-col bg-white text-black-light'>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <StoreContextProvider>
            <AntdRegistry>
              <ConfigAntThemes>
                <div
                  className={`content grid min-h-screen grid-cols-1 grid-rows-[1fr_auto] bg-white text-gray-normal`}
                >
                  {(layoutData.error || layoutData.data === null) && (
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
                        productsSubNav={navbarProductsCategoriesData}
                      />
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
          </StoreContextProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
