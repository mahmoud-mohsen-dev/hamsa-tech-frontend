// import { useTranslations } from 'next-intl';
import PageLayout from '@/components-old/PageLayout';

// Note that `app/[locale]/[...rest]/page.tsx`
// is necessary for this page to render.

export default function NotFoundPage() {
  // const t = useTranslations('NotFoundPage');

  return (
    // <PageLayout title={t('metaData.title')}>
    <PageLayout title={'error 404'}>
      <h3 className='max-w-[460px]'>error</h3>
    </PageLayout>
  );
}
