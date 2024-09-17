import { useTranslations } from 'next-intl';
// import PageLayout from '@/components-old/PageLayout';
import { Link } from '@/navigation';

// Note that `app/[locale]/[...rest]/page.tsx`
// is necessary for this page to render.

export default function NotFoundPage() {
  const t = useTranslations('NotFoundPage');

  return (
    // <PageLayout title={t('metaData.title')}>
    <div className='mx-auto flex min-h-[500px] max-w-[460px] flex-col items-center justify-center'>
      <h2 className='text-xl font-bold text-black-medium'>
        {t('heading')}
      </h2>
      <h3 className='font-semiboldbold mt-3 text-lg text-black-light'>
        {t('subHeading')}
      </h3>
      <Link
        href='/'
        className='mx-auto mt-5 w-fit rounded-sm bg-blue-accent px-4 py-2 text-base font-bold capitalize text-white'
      >
        {t('linkText')}
      </Link>
    </div>
  );
}
