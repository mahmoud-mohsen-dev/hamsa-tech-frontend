'use client';

import { useEffect } from 'react';
import Loading from '../../loading';
import { useRouter } from '@/navigation';
// import { unstable_setRequestLocale } from 'next-intl/server';

// export default function RootPage({ locale }: { locale: string }) {
export default function RootPage() {
  // unstable_setRequestLocale(locale);
  const router = useRouter();

  useEffect(() => {
    router.push('/downloads/datasheets/page_1'); // Redirect after the component renders
  }, []);

  // The loading indicator will be visible
  return <Loading className='h-[calc(100vh-144px)]' />;
}
