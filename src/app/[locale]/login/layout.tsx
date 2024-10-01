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
    namespace: 'HomePage.metaData'
  });

  return {
    title: t('title'),
    description: t('description')
  };
}

function LoginLayout({ children, params: { locale } }: PropsType) {
  // Enable static rendering
  unstable_setRequestLocale(locale);
  return <section className='container'>{children}</section>;
}

export default LoginLayout;
