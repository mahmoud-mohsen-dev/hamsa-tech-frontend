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

  return (
    <div className='py-28 text-center'>
      {t.rich('heading', {
        p: (chunks) => <p className='mt-4'>{chunks}</p>,
        retry: (chunks) => (
          <Link
            href='/'
            className='text-black-light underline underline-offset-2'
            onClick={() => {
              reset();
              window.location.reload();
            }}
            type='button'
          >
            {chunks}
          </Link>
        )
      })}
    </div>
  );
}
