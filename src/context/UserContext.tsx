'use client';
import {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';
import { getIdFromToken } from '@/utils/cookieUtils';
import { AdressType } from '@/types/addressResponseTypes';

const UserContext = createContext<null | {
  userId: string | null;
  setUserId: React.Dispatch<React.SetStateAction<string | null>>;
  addressesData: AdressType[] | null;
  setAddressesData: React.Dispatch<
    React.SetStateAction<AdressType[] | null>
  >;
  otpVerification: string | null;
  setOtpVerification: React.Dispatch<
    React.SetStateAction<string | null>
  >;
}>(null);

export const UserProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [userId, setUserId] = useState<null | string>(null);
  const [addressesData, setAddressesData] = useState<
    null | AdressType[]
  >(null);
  const [otpVerification, setOtpVerification] = useState<
    null | string
  >(null);
  // const [emailResetPassword, setEmailResetPassword] = useState<
  //   null | string
  // >(null);

  useEffect(() => {
    const id = getIdFromToken();
    setUserId(id);
  }, []);

  return (
    <UserContext.Provider
      value={{
        userId,
        setUserId,
        addressesData,
        setAddressesData,
        otpVerification,
        setOtpVerification
      }}
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
