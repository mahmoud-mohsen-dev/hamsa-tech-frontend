import {
  getTranslations,
  unstable_setRequestLocale
} from 'next-intl/server';

type PropsType = {
  children: React.ReactNode;
  params: { locale: string };
};

export const revalidate = 60; // invalidate every 60 seconds
// export function generateStaticParams() {
//   //   return locales.map((locale) => ({ locale }));
// }

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

function layout({ children, params: { locale } }: PropsType) {
  // Enable static rendering
  unstable_setRequestLocale(locale);
  return <div>{children}</div>;
}

export default layout;
