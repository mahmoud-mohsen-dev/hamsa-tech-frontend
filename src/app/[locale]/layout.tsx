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
import { ResponseGetNavbarLinksService } from '@/types/getNavItems';
import ErrorComponent from './error';
import Loading from './loading';
import { notFound } from 'next/navigation';
import NotFoundPage from './not-found';

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

export default async function LocaleLayout({
  children,
  params: { locale }
}: PropsType) {
  unstable_setRequestLocale(locale);

  // Providing all messages to the client
  const messages = await getMessages();
  const direction = getLangDir(locale);

  // try {
  const response = await fetch(
    `${process.env.API_BASE_URL}/api/pages?locale=${locale ?? 'en'}&populate[0]=name&populate[1]=slug&populate[navbar]=*`
  );
  if (!response.ok) {
    console.error('Failed to fetch navbar data'); // Let Next.js handle the error
  }
  const navLinksData: ResponseGetNavbarLinksService =
    await response.json();

  // const { data: navLinks, error: errorNavLinks } =
  //   await getNavbarItems(locale);

  // if (errorNavLinks || navLinks === null) {
  //   throw new Error('Error fetching nav items');
  //   // console.log('='.repeat(20));
  //   // console.error(error);
  //   // console.error(JSON.stringify(navLinks));
  //   // console.log('='.repeat(20));
  //   // return <NotFoundPage />;
  // }
  // console.log('layout nav links data');
  // console.log(JSON.stringify(navLinksData));

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
                {(navLinksData.error ||
                  navLinksData.data === null) && (
                  <ErrorComponent
                    error={
                      navLinksData.error?.message ||
                      ('Error fetching nav items' as any)
                    }
                  />
                )}
                {navLinksData.data && (
                  <Header navLinks={navLinksData.data} />
                )}
                <Suspense fallback={<Loading />}>
                  <Main>{children}</Main>
                </Suspense>
                {/* <Footer /> */}
              </div>
            </ConfigAntThemes>
          </AntdRegistry>
          {/* </StoreContextProvider> */}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
