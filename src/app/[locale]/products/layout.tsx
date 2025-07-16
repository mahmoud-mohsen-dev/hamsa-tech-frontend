import {
  getTranslations,
  unstable_setRequestLocale
} from 'next-intl/server';

export const revalidate = 60; // invalidate every 60 seconds

interface PropsType {
  children: React.ReactNode;
  params: { locale: string };
}

export async function generateMetadata({
  params: { locale }
}: Omit<PropsType, 'children'>) {
  const t = await getTranslations({
    locale,
    namespace: 'ProductsPage.metaData'
  });

  return {
    title: t('title'),
    description: t('description')
  };
}

export default async function ProductsLayout({
  children,
  params: { locale }
}: PropsType) {
  // Enable static rendering
  unstable_setRequestLocale(locale);
  return (
    <section className='mx-auto mt-5 max-w-[1900px]'>
      {children}
    </section>
  );
}
