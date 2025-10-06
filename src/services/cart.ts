import {
  CartDataType,
  CreateCartResponseType,
  GetCartResponseType,
  GetUserCartIdResponseType
} from '@/types/cartResponseTypes';
import {
  createCartQuery,
  deleteCartQuery,
  emptyCartQuery,
  getCartQuery,
  getUserCartIdQuery
} from './headerQueries';
import {
  aggregateCartItems,
  modifyCartDataByLocale
} from '@/utils/cartContextUtils';
import {
  getCookie,
  getIdFromToken,
  removeCartIdFromCookie,
  setCartIdInCookie,
  setCookie
} from '@/utils/cookieUtils';
import { fetchGraphqlServerWebAuthenticated } from './graphqlCrudServerOnly';

const resetCart = ({
  setCart,
  setTotalCartCost
}: {
  setCart: React.Dispatch<React.SetStateAction<CartDataType[]>>;
  setTotalCartCost: React.Dispatch<React.SetStateAction<number>>;
}) => {
  setCart([]);
  setTotalCartCost(0);
};

const removeCartIdFromApp = ({
  setCartId
}: {
  setCartId?: React.Dispatch<React.SetStateAction<string | null>>;
} = {}) => {
  removeCartIdFromCookie();

  if (typeof setCartId === 'function') {
    setCartId(null);
  }
};

export const clearCartAndId = ({
  setCart,
  setTotalCartCost,
  setCartId
}: {
  setCart: React.Dispatch<React.SetStateAction<CartDataType[]>>;
  setTotalCartCost: React.Dispatch<React.SetStateAction<number>>;
  setCartId?: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  resetCart({ setCart, setTotalCartCost });
  removeCartIdFromApp({ setCartId });
};

export const createCart = async ({
  setCartId
}: {
  setCart: React.Dispatch<React.SetStateAction<CartDataType[]>>;
  setCartId: React.Dispatch<React.SetStateAction<string | null>>;
  setTotalCartCost: React.Dispatch<React.SetStateAction<number>>;
  retryCount?: number;
  maxRetries?: number;
}): Promise<{ data: string | null; error: string | null }> => {
  try {
    const cartId = getCookie('cartId');

    if (cartId) return { data: cartId, error: null };

    const { data, error }: CreateCartResponseType =
      await fetchGraphqlServerWebAuthenticated(createCartQuery());

    if (data?.createCart?.data?.id) {
      setCartIdInCookie(data.createCart.data.id);
      setCartId(data.createCart.data.id);

      return { data: data.createCart.data.id, error: null };
    } else {
      console.error(error);
      throw new Error(`Error creating cart: ${error}`);
    }
  } catch (error) {
    console.error('Failed to create cart', error);
    return {
      data: null,
      error: 'Failed to create cart'
    };
    // }
  }
};

export const fetchCartData = async ({
  cartId,
  locale,
  setCart,
  setTotalCartCost,
  setIsCartCheckoutLoading,
  setCartId,
  retryCount = 0,
  maxRetries = 3
}: {
  cartId: string | null;
  locale: string;
  setCart: React.Dispatch<React.SetStateAction<CartDataType[]>>;
  setTotalCartCost: React.Dispatch<React.SetStateAction<number>>;
  setIsCartCheckoutLoading: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  setCartId: React.Dispatch<React.SetStateAction<string | null>>;
  retryCount?: number;
  maxRetries?: number;
}): Promise<{
  data: {
    cart: CartDataType[];
    totalCartCost: number;
  } | null;
  error: string | null;
}> => {
  if (!cartId) {
    throw new Error('No cart id found');
  }

  setIsCartCheckoutLoading(true);

  try {
    const { data, error }: GetCartResponseType =
      await fetchGraphqlServerWebAuthenticated(getCartQuery(cartId));

    if (error || !data || !data?.cart?.data?.id) {
      console.error('Invalid cart response:', error);
      throw new Error(error ?? 'Invalid cart response');
    }

    const productDetails =
      data.cart.data.attributes?.product_details ?? [];
    const convertedCartData = aggregateCartItems(productDetails);
    const cloudCart = modifyCartDataByLocale(
      locale,
      convertedCartData
    );
    const totalCartCost =
      data.cart.data.attributes?.total_cart_cost ?? 0;

    setCart(cloudCart);
    setTotalCartCost(data.cart.data.attributes.total_cart_cost);

    return {
      data: {
        cart: cloudCart,
        totalCartCost
      },
      error: null
    };
  } catch (err) {
    console.error('Failed to fetch cart', err);

    return {
      data: { cart: [], totalCartCost: 0 },
      error: 'Failed to fetch or create cart'
    };
  } finally {
    setIsCartCheckoutLoading(false);
  }
};

export const fetchUserCartData = async ({
  locale,
  setCart,
  setTotalCartCost,
  setIsCartCheckoutLoading,
  setCartId
}: {
  locale: string;
  setCart: React.Dispatch<React.SetStateAction<CartDataType[]>>;
  setTotalCartCost: React.Dispatch<React.SetStateAction<number>>;
  setIsCartCheckoutLoading: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  setCartId: React.Dispatch<React.SetStateAction<string | null>>;
}): Promise<{
  data: {
    cart: CartDataType[];
    totalCartCost: number;
  } | null;
  error: string | null;
}> => {
  try {
    setIsCartCheckoutLoading(true);

    const userId = getIdFromToken();

    if (!userId) {
      throw new Error('No user ID found in token');
    }

    // Get user’s cart ID
    const {
      data: userCartIdData,
      error: userCartIdError
    }: GetUserCartIdResponseType =
      await fetchGraphqlServerWebAuthenticated(
        getUserCartIdQuery(userId)
      );
    const userCartId =
      userCartIdData?.usersPermissionsUsers?.data?.[0]?.attributes
        ?.cart?.data?.id ?? null;

    if (userCartIdError || !userCartId) {
      console.error(
        'Error occurred while fetching user cart:',
        userCartIdError ?? null
      );
      console.error(userCartIdError ?? null);
      console.error('userCartId:', userCartId ?? null);
      throw new Error(
        userCartIdError ?? 'Error occurred while fetching user cart'
      );
    }

    console.log('userCartId:', userCartId);

    // ✅ Reuse fetchCartData instead of duplicating logic
    const { data: cartResponseData, error: cartResponseError } =
      await fetchCartData({
        cartId: userCartId,
        locale,
        setCart,
        setTotalCartCost,
        setIsCartCheckoutLoading,
        setCartId
        // retryCount,
        // maxRetries
      });

    if (cartResponseError || !cartResponseData) {
      console.error(cartResponseError);
      throw new Error('Error occurred while fetching user cart');
    }

    console.log('cartResponseData:', cartResponseData);

    setCookie('cartId', userCartId);
    setCartId(userCartId);

    return {
      data: cartResponseData,
      error: null
    };
  } catch (err) {
    console.error('Failed to fetch user cart', err);

    return {
      data: { cart: [], totalCartCost: 0 },
      error: 'Failed to fetch or create user cart'
    };
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
    if (!cartId) {
      console.error('No cart id provided to emptyCart');
      return {
        data: null,
        error: 'No cart id provided to emptyCart'
      };
    }

    const { data, error } = await fetchGraphqlServerWebAuthenticated(
      emptyCartQuery(cartId)
    );

    if (!data?.updateCart?.data?.id || error) {
      console.error('Error occurred while emptying cart:', error);
      return {
        data: null,
        error: 'Error occurred while emptying cart'
      };
    }

    resetCart({ setCart, setTotalCartCost });
    return { data: data.updateCart.data.id as string, error: null };
  } catch (err) {
    console.error('Error emptying cart:', err);
    return {
      data: null,
      error: 'Error occurred while emptying cart'
    };
  }
};

export const removeCart = async ({
  setCart,
  setCartId,
  setTotalCartCost
}: {
  setCart: React.Dispatch<React.SetStateAction<CartDataType[]>>;
  setCartId: React.Dispatch<React.SetStateAction<string | null>>;
  setTotalCartCost: React.Dispatch<React.SetStateAction<number>>;
}) => {
  try {
    const cartId = getCookie('cartId');
    if (!cartId) {
      resetCart({ setCart, setTotalCartCost });
      setCartId(null);

      return {
        data: null,
        error: 'No cart id found'
      };
    }

    const { data, error } = await fetchGraphqlServerWebAuthenticated(
      deleteCartQuery(cartId)
    );

    if (!data?.deleteCart?.data?.id || error) {
      throw new Error(`Error occurred while deleting cart: ${error}`);
    }

    return {
      data: data.deleteCart.data.id as string,
      error: null
    };
  } catch (err) {
    console.error('Error deleting cart:', err);

    return {
      data: null,
      error: 'Error occurred while deleting cart'
    };
  } finally {
    clearCartAndId({ setCart, setTotalCartCost, setCartId });
  }
};
