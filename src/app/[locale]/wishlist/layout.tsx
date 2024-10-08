import {
  getTranslations,
  unstable_setRequestLocale
} from 'next-intl/server';

export const revalidate = 120; // invalidate every 60 seconds

interface PropsType {
  children: React.ReactNode;
  params: { locale: string };
}

export async function generateMetadata({
  params: { locale }
}: Omit<PropsType, 'children'>) {
  const t = await getTranslations({
    locale,
    namespace: 'WishlistPage.metaData'
  });

  return {
    title: t('title'),
    description: t('description')
  };
}

function WishlistLayout({ children, params: { locale } }: PropsType) {
  unstable_setRequestLocale(locale);
  return (
    <section className='container py-[80px] pt-[120px]'>
      {children}
    </section>
  );
}

export default WishlistLayout;
