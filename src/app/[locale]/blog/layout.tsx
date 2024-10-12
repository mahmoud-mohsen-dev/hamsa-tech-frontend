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
    namespace: 'BlogPage.metaData'
  });

  return {
    title: t('title'),
    description: t('description')
  };
}

function BlogLayout({ children, params: { locale } }: PropsType) {
  unstable_setRequestLocale(locale);
  return <div className='container py-[100px]'>{children}</div>;
}

export default BlogLayout;
