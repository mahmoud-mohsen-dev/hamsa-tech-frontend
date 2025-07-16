import {
  CartDataType,
  CreateCartResponseType,
  GetCartResponseType
} from '@/types/cartResponseTypes';
import { fetchGraphqlClient } from './graphqlCrud';
import { createCartQuery, getCartQuery } from './headerQueries';
import {
  aggregateCartItems,
  modifyCartDataByLocale
} from '@/utils/cartContextUtils';
import {
  removeCartIdFromCookie,
  setCartIdInCookie
} from '@/utils/cookieUtils';

const restCart = ({
  setCart,
  setTotalCartCost
}: {
  setCart: React.Dispatch<React.SetStateAction<CartDataType[]>>;
  setTotalCartCost: React.Dispatch<React.SetStateAction<number>>;
}) => {
  setCart([]);
  setTotalCartCost(0);
};

export const createCart = async ({
  setCart,
  setCartId,
  setTotalCartCost
}: {
  setCart: React.Dispatch<React.SetStateAction<CartDataType[]>>;
  setCartId: React.Dispatch<React.SetStateAction<string | null>>;
  setTotalCartCost: React.Dispatch<React.SetStateAction<number>>;
}) => {
  try {
    restCart({ setCart, setTotalCartCost });
    removeCartIdFromCookie();

    const { data, error }: CreateCartResponseType =
      await fetchGraphqlClient(createCartQuery());

    // if (error || !data || data.createCart.data === null)
    if (data?.createCart?.data?.id) {
      setCartIdInCookie(data.createCart.data.id);
      setCartId(data.createCart.data.id);
    } else {
      console.error(error);
      restCart({ setCart, setTotalCartCost });
      removeCartIdFromCookie();
    }
  } catch (error) {
    console.error('Failed to create cart', error);
  }
};

export const fetchCartData = async ({
  cartId,
  locale,
  setCart,
  setTotalCartCost,
  setIsCartCheckoutLoading,
  setCartId
}: {
  cartId: number | null;
  locale: string;
  setCart: React.Dispatch<React.SetStateAction<CartDataType[]>>;
  setTotalCartCost: React.Dispatch<React.SetStateAction<number>>;
  setIsCartCheckoutLoading: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  setCartId: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  if (!cartId) {
    restCart({ setCart, setTotalCartCost });
    return;
  }
  try {
    setIsCartCheckoutLoading(true);
    const { data, error }: GetCartResponseType =
      await fetchGraphqlClient(getCartQuery(cartId));

    if (error || !data || !data?.cart?.data?.id) {
      console.error('Error fetching cart:', error);
      throw new Error(`Error fetching cart: ${error}`);
    } else {
      if (data?.cart?.data?.attributes?.product_details) {
        const updatedCartData = aggregateCartItems(
          data.cart.data.attributes.product_details
        );

        const localeCart = modifyCartDataByLocale(
          locale,
          updatedCartData
        );

        setCart(localeCart);
        setTotalCartCost(data.cart.data.attributes.total_cart_cost);
      }
    }
  } catch (error) {
    console.error('Failed to fetch cart', error);
    restCart({ setCart, setTotalCartCost });
    removeCartIdFromCookie();
    createCart({ setCart, setCartId, setTotalCartCost });
  } finally {
    setIsCartCheckoutLoading(false);
  }
};

export const countCartItems = (cart: CartDataType[]) => {
  if (cart.length > 0) {
    return cart.reduce((acc, cur) => {
      return (acc += cur.quantity);
    }, 0);
  }
  return 0;
};

const emptyCartQuery = (cartId: string | null) => {
  return `mutation {
    updateCart(id: ${cartId ? `"${cartId}"` : null}, data: { product_details: [], total_cart_cost: 0 }) {
      data {
        id
      }
    }
  }`;
};

export const emptyCart = async ({
  cartId,
  setCart,
  setTotalCartCost
}: {
  cartId: string | null;
  setCart: React.Dispatch<React.SetStateAction<CartDataType[]>>;
  setTotalCartCost: React.Dispatch<React.SetStateAction<number>>;
}) => {
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

    restCart({ setCart, setTotalCartCost });
    return data.updateCart.data.id as string;
  } catch (err) {
    console.error('Error emptying cart:', err);
    return null;
  }
};
