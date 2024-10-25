'use client';

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
// import PageLayout from '@/components-old/PageLayout';
import { Link } from '@/navigation';
import useAddColoredNavClass from '@/hooks/useAddColoredNavClass';

type Props = {
  error: Error;
  reset?(): void;
};

export default function Error({ error, reset = () => {} }: Props) {
  const t = useTranslations('Error');
  useAddColoredNavClass();

  useEffect(() => {
    console.error(t('metaData.title'));
    console.error(error.message);
  }, [error]);

  return (
    <section className='error grid min-h-[calc(100vh-48px)] place-content-center py-12 md:min-h-[calc(100vh-64px)]'>
      <div className='mx-auto max-w-screen-xl px-4 lg:px-6'>
        <div className='mx-auto max-w-screen-sm text-center'>
          <h1 className='mb-4 text-7xl font-extrabold tracking-tight text-blue-sky-medium lg:text-9xl'>
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
            className='hover:bg-primary-800 focus:ring-primary-300 my-4 inline-flex rounded-lg bg-blue-sky-medium px-5 py-2.5 text-center text-sm font-medium capitalize text-white focus:outline-none focus:ring-4'
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
