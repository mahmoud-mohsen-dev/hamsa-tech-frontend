import {
  getTranslations,
  unstable_setRequestLocale
} from 'next-intl/server';

// export const revalidate = 120; // invalidate every 60 seconds

type PropsType = {
  children: React.ReactNode;
  params: { locale: string };
};

export async function generateMetadata({
  params: { locale }
}: Omit<PropsType, 'children'>) {
  const t = await getTranslations({
    locale,
    namespace: 'AccountLayoutPage.AddressPage.metaData'
  });

  return {
    title: t('title'),
    description: t('description')
  };
}

function InvoiceLayout({ children, params: { locale } }: PropsType) {
  unstable_setRequestLocale(locale);
  return <div className='h-full'>{children}</div>;
}

export default InvoiceLayout;
