import { fetchGraphqlClient } from './graphqlCrud';

const emptyCartQuery = (cartId: string | null) => {
  return `mutation {
    updateCart(id: ${cartId ? `"${cartId}"` : null}, data: { product_details: [], total_cart_cost: 0 }) {
      data {
        id
      }
    }
  }`;
};

export const emptyCart = async (cartId: string | null) => {
  try {
    const { data, error } = await fetchGraphqlClient(
      emptyCartQuery(cartId)
    );

    // console.log('emptycart was called, data:', data);
    // console.log('emptycart was called, error:', error);
    if (!data?.updateCart?.data?.id && error) {
      console.error('Error occurred while emptying cart:', error);
      return null;
    }

    return data.updateCart.data.id as string;
  } catch (err) {
    console.error('Error emptying cart:', err);
    return null;
  }
};
