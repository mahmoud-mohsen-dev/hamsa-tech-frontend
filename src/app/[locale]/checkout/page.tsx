import CheckoutCart from '@/components/checkoutPage/CheckoutCart';
import OrderInfo from '@/components/checkoutPage/OrderInfo';
import { unstable_setRequestLocale } from 'next-intl/server';

interface PropsType {
  params: { locale: string };
}

function CheckoutPage({ params: { locale } }: PropsType) {
  unstable_setRequestLocale(locale);

  return (
    <div className='container'>
      <div className='grid-cols-checkout mx-20 grid text-black'>
        <OrderInfo />
        <CheckoutCart />
      </div>
    </div>
  );
}

export default CheckoutPage;
