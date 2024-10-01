import { useTranslations } from 'next-intl';
// import PageLayout from '@/components-old/PageLayout';
import { Link } from '@/navigation';

// Note that `app/[locale]/[...rest]/page.tsx`
// is necessary for this page to render.

export default function NotFoundPage() {
  const t = useTranslations('NotFoundPage');

  // return (
  //   // <PageLayout title={t('metaData.title')}>
  //   <div className='mx-auto flex min-h-[500px] max-w-[460px] flex-col items-center justify-center'>
  //     <h2 className='text-xl font-bold text-black-medium'>
  //       {t('heading')}
  //     </h2>
  //     <h3 className='font-semiboldbold mt-3 text-lg text-black-light'>
  //       {t('subHeading')}
  //     </h3>
  //     <Link
  //       href='/'
  //       className='mx-auto mt-5 w-fit rounded-sm bg-blue-accent px-4 py-2 text-base font-bold capitalize text-white'
  //     >
  //       {t('linkText')}
  //     </Link>
  //   </div>
  // );

  return (
    <section className='grid place-content-center bg-white md:min-h-screen'>
      <div className='mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16'>
        <div className='mx-auto max-w-screen-sm text-center'>
          <h1 className='text-blue-sky-medium mb-4 text-7xl font-extrabold tracking-tight lg:text-9xl'>
            404
          </h1>
          <p className='mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl'>
            {t('heading')}
          </p>
          <p className='mb-4 text-lg font-light text-gray-500'>
            {t('subHeading')}
          </p>
          <Link
            href='/'
            className='bg-primary-600 hover:bg-primary-800 focus:ring-primary-300 bg-blue-sky-medium my-4 inline-flex rounded-lg px-5 py-2.5 text-center text-sm font-medium capitalize text-white focus:outline-none focus:ring-4'
          >
            {t('linkText')}
          </Link>
        </div>
      </div>
    </section>
  );
}
