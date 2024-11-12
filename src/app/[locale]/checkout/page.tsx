import CheckoutWrapper from '@/components/checkoutPage/CheckoutWrapper';
import { getFreeShippingData } from '@/services/getFreeShippingData';
import { fetchGraphql } from '@/services/graphqlCrud';
import { FreeShippingResponseType } from '@/types/freeShippingResponseType';
import { GetShippingCostResponseType } from '@/types/shippingCostResponseTypes';
import { unstable_setRequestLocale } from 'next-intl/server';

interface PropsType {
  params: { locale: string };
}

export const getShippingQuery = (locale: string) => {
  return `{
    shippingCosts(locale: "${locale ?? 'en'}", pagination: { pageSize: 100 }, sort: "governorate:asc") {
        data {
            id
            attributes {
                governorate
                delivery_cost
                delivery_duration_in_days
            }
        }
    }
  }`;
};

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
