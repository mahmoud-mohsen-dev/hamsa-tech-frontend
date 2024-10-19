import WishlistTable from '@/components/wishlist/WishlistTable';
import {
  getTranslations,
  unstable_setRequestLocale
} from 'next-intl/server';

interface PropsType {
  params: { locale: string };
}

async function WishlistPage({ params: { locale } }: PropsType) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('WishlistPage.content');

  return (
    <div className='mx-auto flex flex-col items-center justify-start px-6 font-inter md:min-h-[calc(100vh-160px)]'>
      <div className='w-full'>
        <h2 className='text-4xl font-semibold text-black-medium'>
          {t('title')}
        </h2>
        <h4
          className={`mt-2 font-normal text-gray-medium ${locale === 'ar' ? 'text-2xl' : 'text-lg'}`}
        >
          {t('subTitle', { count: 5 })}
        </h4>
      </div>

      <WishlistTable />
    </div>
  );
}

export default WishlistPage;
