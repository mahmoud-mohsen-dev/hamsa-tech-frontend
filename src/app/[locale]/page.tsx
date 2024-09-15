import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { unstable_setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import LocalSwitcher from '@/components/LocalSwitcher';

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'HomePage' });

  return {
    title: t('metadata.title')
  };
}

export default function HomePage({
  params: { locale }
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const t = useTranslations('HomePage');
  return (
    <div>
      <h1>{t('title')}</h1>
      <Link href='/about'>{t('about')}</Link>
      <LocalSwitcher />
    </div>
  );
}
