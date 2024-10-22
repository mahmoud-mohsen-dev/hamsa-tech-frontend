import {
  getTranslations,
  unstable_setRequestLocale
} from 'next-intl/server';

export const revalidate = 120; // invalidate every 60 seconds

type PropsType = {
  children: React.ReactNode;
  params: { locale: string };
};

export async function generateMetadata({
  params: { locale }
}: Omit<PropsType, 'children'>) {
  const t = await getTranslations({
    locale,
    namespace: 'AboutUsPage.metaData'
  });

  return {
    title: t('title'),
    description: t('description')
  };
}

function InvoiceLayout({ children, params: { locale } }: PropsType) {
  unstable_setRequestLocale(locale);
  return <div className='container pb-16 pt-12'>{children}</div>;
}

export default InvoiceLayout;
