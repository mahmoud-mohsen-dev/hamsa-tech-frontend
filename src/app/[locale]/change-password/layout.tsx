import {
  getTranslations,
  unstable_setRequestLocale
} from 'next-intl/server';

interface PropsType {
  children: React.ReactNode;
  params: { locale: string };
}

export async function generateMetadata({
  params: { locale }
}: Omit<PropsType, 'children'>) {
  const t = await getTranslations({
    locale,
    namespace: 'ChangePasswordPage.metaData'
  });

  return {
    title: t('title'),
    description: t('description')
  };
}

function LoginLayout({ children, params: { locale } }: PropsType) {
  // Enable static rendering
  unstable_setRequestLocale(locale);
  return <section className='container py-12'>{children}</section>;
}

export default LoginLayout;
