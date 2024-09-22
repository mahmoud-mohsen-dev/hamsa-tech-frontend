import { ReactNode, Suspense } from 'react';
import { Open_Sans, Inter } from 'next/font/google';
// import Loading from '../[locale]/loading';
import { getLangDir } from 'rtl-detect';
// import { StoreContextProvider } from '../context/store';

import { NextIntlClientProvider } from 'next-intl';
import {
  getMessages,
  getTranslations,
  unstable_setRequestLocale
} from 'next-intl/server';
// import Navigation from '@/components-old/Navigation';
import { locales } from '@/config';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import ConfigAntThemes from '@/components/Theme/ConfigAntThemes';
import Header from '@/components/AppLayout/Header';
import Main from '@/components/AppLayout/Main';
import { getNavbarItems } from '@/services/navItems';
// import Error from './error';
// import { ResponseGetNavbarLinksService } from '@/types/getNavItems';
import ErrorComponent from './error';
import Loading from './loading';
import { notFound } from 'next/navigation';
import NotFoundPage from './not-found';
import { fetchGraphql } from '@/services/graphqlCrud';
import { LayoutResponse } from '@/types/getIndexLayout';
import Footer from '@/components/AppLayout/Footer';

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

export default async function LocaleLayout({
  children,
  params: { locale }
}: PropsType) {
  unstable_setRequestLocale(locale);

  // Providing all messages to the client
  const messages = await getMessages();
  const direction = getLangDir(locale);

  // try {
  // const response = await fetch(
  //   `${process.env.API_BASE_URL}/api/pages?locale=${locale ?? 'en'}&populate[0]=name&populate[1]=slug&populate[navbar]=*`
  // );

  const layoutData = (await fetchGraphql(
    getQueryLayoutPage(locale)
  )) as LayoutResponse;
  console.log(JSON.stringify(layoutData));
  const layoutAttributes =
    layoutData?.data?.pages?.data[0]?.attributes ?? null;

  if (!layoutData.data === null || layoutData.error) {
    // console.log(JSON.stringify(layoutData));
    console.error('Failed to fetch navbar and footer data'); // Let Next.js handle the error
  }

  return (
    <html
      className={`${openSans.variable} ${inter.variable}`}
      lang={locale}
      dir={direction}
    >
      <body className='flex h-full flex-col bg-white text-black-light'>
        <NextIntlClientProvider
          locale={locale}
          // Make sure to provide at least the messages for `Error`
          messages={messages}
        >
          {/* <Navigation /> */}
          {/* <StoreContextProvider> */}
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
                  <Header navLinks={layoutAttributes.navbar} />
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
          {/* </StoreContextProvider> */}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
