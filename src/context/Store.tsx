// app/MyContext.js
'use client'; // Make this a client component

import { fetchGraphqlClient } from '@/services/graphqlCrud';
import {
  CartDataType,
  updateCartResponseType
} from '@/types/cartResponseTypes';
import {
  aggregateCartItems,
  updateCartInTheBackend
} from '@/utils/cartContextUtils';
import { getCartId } from '@/utils/cookieUtils';
import { createContext, useContext, useState } from 'react';

const MyContext = createContext<{
  productsCount: number;
  setProductsCount: React.Dispatch<React.SetStateAction<number>>;
  currentProductId: string;
  setCurrentProductId: React.Dispatch<React.SetStateAction<string>>;
  nextProductId: string;
  setNextProductId: React.Dispatch<React.SetStateAction<string>>;
  openDrawer: boolean;
  setOpenDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  drawerIsLoading: boolean;
  setDrawerIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  cart: CartDataType[];
  findProductInCart: (productId: string) => CartDataType | undefined;
  setCart: React.Dispatch<React.SetStateAction<CartDataType[]>>;
  incrementCartItem: (
    productId: string,
    setComponentLoader?: React.Dispatch<React.SetStateAction<boolean>>
  ) => Promise<void>;
  decrementCartItem: (
    productId: string,
    setComponentLoader?: React.Dispatch<React.SetStateAction<boolean>>
  ) => Promise<void>;
  updateCartItemQuantity: (
    productId: string,
    quantity: number,
    setComponentLoader?: React.Dispatch<React.SetStateAction<boolean>>
  ) => Promise<void>;
  calculateSubTotalCartCost: () => number;
  calculateTotalCartItems: () => number;
  addToCartIsLoading: string;
  shippingCost: number;
  freeShippingApplied: boolean;
  setFreeShippingApplied: React.Dispatch<
    React.SetStateAction<boolean>
  >;
} | null>(null);

export const StoreContextProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [productsCount, setProductsCount] = useState(0);
  const [currentProductId, setCurrentProductId] = useState('0');
  const [nextProductId, setNextProductId] = useState('0');
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [drawerIsLoading, setDrawerIsLoading] =
    useState<boolean>(false);
  const [cart, setCart] = useState<CartDataType[]>([]);
  const [addToCartIsLoading, setAddToCartIsLoading] =
    useState<string>('');
  const [shippingCost, setShippingCost] = useState(50);
  const [freeShippingApplied, setFreeShippingApplied] =
    useState(false);

  // Utility to find product in the cart
  const findProductInCart = (productId: string) =>
    cart.find((item) =>
      item?.product?.data?.id ?
        item.product.data.id === productId
      : null
    );

  // Function to update the cart in the backend and set the new cart data
  const updateCartContextFromBackend = async (
    productId: string,
    quantity: number,
    setComponentLoader: React.Dispatch<
      React.SetStateAction<boolean>
    > | null = null
  ) => {
    const cartId = getCartId() || ''; // Assuming you have a function to get the cartId

    try {
      if (!!setComponentLoader) {
        console.log('setComponentLoader');
        console.log(!!setComponentLoader);
        setComponentLoader(true);
      }
      setAddToCartIsLoading(productId);
      setDrawerIsLoading(true);
      const { data, error } = await fetchGraphqlClient(
        updateCartInTheBackend(cartId, cart, productId, quantity)
      );

      if (data && !error) {
        const updatedCartItems =
          data?.updateCart?.data?.attributes?.product_details;
        if (updatedCartItems) {
          const updatedCartData =
            aggregateCartItems(updatedCartItems);
          console.log(updatedCartData);
          setCart(updatedCartData); // Update cart context with the response data
          setOpenDrawer(true);
        }
      } else {
        console.error('Failed to update cart in the backend:', error);
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    } finally {
      setDrawerIsLoading(false);
      if (!!setComponentLoader) {
        setComponentLoader(false);
      }
      setAddToCartIsLoading('');
    }
  };

  // Increment the quantity of a product in the cart
  const incrementCartItem = async (
    productId: string,
    setComponentLoader: React.Dispatch<
      React.SetStateAction<boolean>
    > | null = null
  ) => {
    const product = findProductInCart(productId);
    console.log(!!setComponentLoader);
    if (product) {
      await updateCartContextFromBackend(
        productId,
        product.quantity + 1,
        setComponentLoader
      );
    } else {
      await updateCartContextFromBackend(
        productId,
        1,
        setComponentLoader
      );
    }
  };

  // Decrement the quantity of a product in the cart
  const decrementCartItem = async (
    productId: string,
    setComponentLoader: React.Dispatch<
      React.SetStateAction<boolean>
    > | null = null
  ) => {
    const product = findProductInCart(productId);
    if (product && product.quantity > 1) {
      await updateCartContextFromBackend(
        productId,
        product.quantity - 1,

        setComponentLoader
      );
    } else {
      await updateCartContextFromBackend(
        productId,
        0,
        setComponentLoader
      ); // Remove item if quantity is zero
    }
  };

  // Update the quantity of a product directly via input
  const updateCartItemQuantity = async (
    productId: string,
    quantity: number,
    setComponentLoader: React.Dispatch<
      React.SetStateAction<boolean>
    > | null = null
  ) => {
    if (quantity < 0) return; // Prevent negative values
    await updateCartContextFromBackend(
      productId,
      quantity,
      setComponentLoader
    );
  };

  // Calaulate total product qunatites in cart
  const calculateTotalCartItems = () => {
    return cart.reduce((acc, cur) => {
      return (acc += cur?.quantity);
    }, 0);
  };
  // Calaulate the total product costs in cart
  const calculateSubTotalCartCost = () => {
    return cart.reduce((acc, cur) => {
      if (cur?.product?.data?.attributes?.sale_price > 0) {
        return (acc +=
          cur.product.data.attributes.sale_price * cur.quantity);
      } else {
        return (acc +=
          cur?.product?.data?.attributes?.price * cur.quantity || 0);
      }
    }, 0);
  };

  return (
    <MyContext.Provider
      value={{
        productsCount,
        setProductsCount,
        currentProductId,
        setCurrentProductId,
        nextProductId,
        setNextProductId,
        openDrawer,
        setOpenDrawer,
        drawerIsLoading,
        setDrawerIsLoading,
        cart,
        setCart,
        findProductInCart,
        incrementCartItem,
        decrementCartItem,
        updateCartItemQuantity,
        calculateSubTotalCartCost,
        calculateTotalCartItems,
        addToCartIsLoading,
        shippingCost,
        freeShippingApplied,
        setFreeShippingApplied
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => {
  const context = useContext(MyContext);

  if (!context) {
    throw new Error('useMyContext must be used within a MyProvider');
  }

  return context;
};
