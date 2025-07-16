import {
  getTranslations,
  unstable_setRequestLocale
} from 'next-intl/server';

type PropsType = {
  children: React.ReactNode;
  params: { locale: string };
};

export const revalidate = 30; // invalidate every 60 seconds

export async function generateMetadata({
  params: { locale }
}: Omit<PropsType, 'children'>) {
  const t = await getTranslations({
    locale,
    namespace: 'CheckoutPage.metaData'
  });

  return {
    title: t('title'),
    description: t('description')
  };
}

function layout({ children, params: { locale } }: PropsType) {
  unstable_setRequestLocale(locale);
  return <div>{children}</div>;
}

export default layout;
