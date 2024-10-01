'use client';

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
// import PageLayout from '@/components-old/PageLayout';
import { Link } from '@/navigation';

type Props = {
  error: Error;
  reset?(): void;
};

export default function Error({ error, reset = () => {} }: Props) {
  const t = useTranslations('Error');

  useEffect(() => {
    console.error(t('metaData.title'));
    console.error(error.message);
  }, [error]);

  // return (
  //   <div className='grid min-h-[500px] place-content-center py-28 text-center'>
  //     {t.rich('heading', {
  //       p: (chunks) => <p className='mt-4'>{chunks}</p>,
  //       retry: (chunks) => (
  //         <Link
  //           href='/'
  //           className='text-black-light underline underline-offset-2'
  //           onClick={() => {
  //             reset();
  //             window.location.reload();
  //           }}
  //           type='button'
  //         >
  //           {chunks}
  //         </Link>
  //       )
  //     })}
  //   </div>
  // );

  return (
    <section className='grid place-content-center md:min-h-screen'>
      <div className='mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16'>
        <div className='mx-auto max-w-screen-sm text-center'>
          <h1 className='text-blue-sky-medium mb-4 text-7xl font-extrabold tracking-tight lg:text-9xl'>
            500
          </h1>
          <p className='mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl'>
            {t('heading')}
          </p>
          <p className='mb-4 text-lg font-light text-gray-500'>
            {t('subHeading')}
          </p>
          <Link
            href='/'
            className='bg-blue-sky-medium hover:bg-primary-800 focus:ring-primary-300 my-4 inline-flex rounded-lg px-5 py-2.5 text-center text-sm font-medium capitalize text-white focus:outline-none focus:ring-4'
            onClick={() => {
              reset();
              window.location.reload();
            }}
          >
            {t('reloadButtonText')}
          </Link>
        </div>
      </div>
    </section>
  );
}
