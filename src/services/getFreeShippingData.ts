import { FreeShippingResponseType } from '@/types/freeShippingResponseType';
import { fetchGraphql, fetchGraphqlClient } from './graphqlCrud';

export const getFreeShippingQuery = () => {
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

export async function getFreeShippingData() {
  try {
    const { data: freeShippingData, error: freeShippingError } =
      (await fetchGraphqlClient(
        getFreeShippingQuery()
      )) as FreeShippingResponseType;
    if (
      freeShippingError ||
      !freeShippingData ||
      !freeShippingData?.freeShipping?.data?.attributes
    ) {
      console.error(freeShippingError);
      return null;
    }

    return freeShippingData.freeShipping.data.attributes;
  } catch (err) {
    console.error(err);
    return null;
  }
}
