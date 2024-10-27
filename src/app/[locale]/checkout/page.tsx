import CheckoutCart from '@/components/checkoutPage/CheckoutCart';
import CheckoutWrapper from '@/components/checkoutPage/CheckoutWrapper';
import OrderInfo from '@/components/checkoutPage/OrderInfo';
import { fetchGraphql } from '@/services/graphqlCrud';
import { FreeShippingResponseType } from '@/types/freeShippingResponseType';
import { GetShippingCostResponseType } from '@/types/shippingCostResponseTypes';
import { unstable_setRequestLocale } from 'next-intl/server';

interface PropsType {
  params: { locale: string };
}

const getShippingQuery = (locale: string) => {
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

const getFreeShippingQuery = () => {
  return `{
    freeShipping {
        data {
            attributes {
                apply_free_shipping_if_total_cart_cost_equals
                enable
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

  const { data: freeShippingData, error: freeShippingError } =
    (await fetchGraphql(
      getFreeShippingQuery()
    )) as FreeShippingResponseType;
  if (freeShippingError || !freeShippingData) {
    console.error(freeShippingError);
  }

  return (
    <div className='container pb-12 pt-5'>
      <CheckoutWrapper
        shippingCostData={shippingCostData?.shippingCosts?.data ?? []}
        freeShippingData={
          freeShippingData?.freeShipping?.data?.attributes
        }
      />
    </div>
  );
}

export default CheckoutPage;
