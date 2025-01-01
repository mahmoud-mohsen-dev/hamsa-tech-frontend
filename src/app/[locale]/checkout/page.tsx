import CheckoutWrapper from '@/components/checkoutPage/CheckoutWrapper';
import { fetchGraphql } from '@/services/graphqlCrud';
import { getShippingQuery } from '@/services/shippingAddress';
import { GetShippingCostResponseType } from '@/types/shippingCostResponseTypes';
import { unstable_setRequestLocale } from 'next-intl/server';

interface PropsType {
  params: { locale: string };
}

async function CheckoutPage({ params: { locale } }: PropsType) {
  unstable_setRequestLocale(locale);

  const { data: shippingCostData, error: shippingCostError } =
    (await fetchGraphql(
      getShippingQuery(locale)
    )) as GetShippingCostResponseType;
  if (shippingCostError || !shippingCostData) {
    console.error(shippingCostError);
  }

  return (
    <div className='container pb-12 pt-5'>
      <CheckoutWrapper
        shippingCostData={shippingCostData?.shippingCosts?.data ?? []}
      />
    </div>
  );
}

export default CheckoutPage;
