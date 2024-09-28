// app/MyContext.js
'use client'; // Make this a client component

import { fetchGraphqlClient } from '@/services/graphqlCrud';
import {
  CartDataType,
  updateCartResponseType
} from '@/types/cartResponseTypes';
import { updateCartInTheBackend } from '@/utils/cartContextUtils';
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
  setCart: React.Dispatch<React.SetStateAction<CartDataType[]>>;
  incrementCartItem: (
    productId: string,
    setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>
  ) => void;
  decrementCartItem: (
    productId: string,
    setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>
  ) => void;
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
    useState<boolean>(true);
  const [cart, setCart] = useState<CartDataType[]>([]);

  const updateCartInContext = async (
    productId: string,
    operation: 'increment' | 'decrement',
    setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const cartId = getCartId();
    if (cartId) {
      try {
        if (setIsLoading) setIsLoading(true);
        setDrawerIsLoading(true);
        const { data, error } = (await fetchGraphqlClient(
          updateCartInTheBackend(cartId, cart, productId, operation)
        )) as updateCartResponseType;

        if (data && !error) {
          const updatedCartItems =
            data?.updateCart?.data?.attributes?.product_details ?? [];
          setCart(updatedCartItems); // Update cart context
          setOpenDrawer(true); // Open the cart drawer
        } else {
          console.error('Failed to update cart context', error);
        }
      } catch (error) {
        console.error('Error updating cart:', error);
      } finally {
        if (setIsLoading) {
          setIsLoading(false);
        }
        setDrawerIsLoading(false);
      }
    }
  };

  // Handle incrementing the product quantity
  const incrementCartItem = (
    productId: string,
    setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    updateCartInContext(productId, 'increment', setIsLoading);
  };

  // Handle decrementing the product quantity
  const decrementCartItem = (
    productId: string,
    setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    updateCartInContext(productId, 'decrement', setIsLoading);
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
        incrementCartItem,
        decrementCartItem
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
