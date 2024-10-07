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
    <div className='mx-auto flex flex-col items-center justify-center px-6 pt-8 font-inter md:min-h-[calc(100vh-132px)]'>
      <h2>My Wishlist</h2>
      <h4>There are 5 products in this wishlist.</h4>

      <WishlistTable />
    </div>
  );
}

export default WishlistPage;
