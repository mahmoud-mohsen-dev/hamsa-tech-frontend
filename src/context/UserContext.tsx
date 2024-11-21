'use client';
import {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';
import { getIdFromToken } from '@/utils/cookieUtils';
import { AdressesType } from '@/types/addressResponseTypes';

const UserContext = createContext<null | {
  userId: string | null;
  setUserId: React.Dispatch<React.SetStateAction<string | null>>;
  addressesData: AdressesType[] | null;
  setAddressesData: React.Dispatch<
    React.SetStateAction<AdressesType[] | null>
  >;
}>(null);

export const UserProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [userId, setUserId] = useState<null | string>(null);
  const [addressesData, setAddressesData] = useState<
    null | AdressesType[]
  >(null);

  useEffect(() => {
    const id = getIdFromToken();
    setUserId(id);
  }, []);

  return (
    <UserContext.Provider
      value={{ userId, setUserId, addressesData, setAddressesData }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useMyContext must be used within a MyProvider');
  }

  return context;
};
