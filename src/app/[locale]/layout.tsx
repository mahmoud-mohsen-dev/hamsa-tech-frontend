import { ReactNode, Suspense } from 'react';
import { Open_Sans, Inter } from 'next/font/google';
import Loading from '../loading';
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
  // Enable static rendering
  unstable_setRequestLocale(locale);

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  const { data, error } = await getNavbarItems(locale);
  // const { data, error } = await fetchNavItems();
  if (error) {
    console.error(error);
  } else {
    console.log(data);
    // setNavItems(data);
  }

  return (
    <html
      className={`${openSans.variable} ${inter.variable}`}
      lang={locale}
      dir={locale === 'ar' ? 'rtl' : 'lfr'}
    >
      <body className='flex h-full flex-col'>
        <NextIntlClientProvider messages={messages}>
          {/* <Navigation /> */}
          {/* <StoreContextProvider> */}
          <AntdRegistry>
            <ConfigAntThemes>
              <div
                className={`content grid min-h-screen grid-cols-1 grid-rows-[1fr_auto] bg-white text-gray-normal`}
              >
                <Header />
                {/* <Suspense fallback={<Loading />}> */}
                <Main>{children}</Main>
                {/* </Suspense> */}
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
