// app/MyContext.js
'use client'; // Make this a client component

import { createContext, useContext, useState } from 'react';

const MyContext = createContext<{
  productsCount: number;
  setProductsCount: React.Dispatch<React.SetStateAction<number>>;
} | null>(null);

export const StoreContextProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [productsCount, setProductsCount] = useState(0);

  return (
    <MyContext.Provider value={{ productsCount, setProductsCount }}>
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
