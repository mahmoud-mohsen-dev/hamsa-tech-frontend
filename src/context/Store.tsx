// app/MyContext.js
'use client'; // Make this a client component

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
        setDrawerIsLoading
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
