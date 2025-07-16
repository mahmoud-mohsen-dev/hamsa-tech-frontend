import CheckoutWrapper from '@/components/checkoutPage/CheckoutWrapper';
import { fetchGraphqlServerWebAuthenticated } from '@/services/graphqlCrudServerOnly';
import { getShippingQuery } from '@/services/shippingAddress';
import { GetShippingCostResponseType } from '@/types/shippingCostResponseTypes';
import { unstable_setRequestLocale } from 'next-intl/server';

interface PropsType {
  params: { locale: string };
}

async function CheckoutPage({ params: { locale } }: PropsType) {
  unstable_setRequestLocale(locale);

  const { data: shippingCostData, error: shippingCostError } =
    (await fetchGraphqlServerWebAuthenticated(
      getShippingQuery()
    )) as GetShippingCostResponseType;
  if (shippingCostError || !shippingCostData) {
    console.error(shippingCostError);
  }

  const shippingConfigData =
    shippingCostData?.shippingConfig?.data?.attributes ?? null;

  console.log(JSON.stringify(shippingConfigData));

  return (
    <div className='container pb-12 pt-5'>
      <CheckoutWrapper shippingConfigData={shippingConfigData} />
    </div>
  );
}

export default CheckoutPage;
