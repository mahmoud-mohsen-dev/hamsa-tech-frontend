'use client';
import {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';
import { getIdFromToken, removeCookie } from '@/utils/cookieUtils';
import { AdressType } from '@/types/addressResponseTypes';
import { useRouter } from '@/navigation';
import { clearCartAndId } from '@/services/cart';
import { useMyContext } from './Store';

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
  logout: ({
    setCartId
  }?: {
    setCartId?: React.Dispatch<React.SetStateAction<string | null>>;
  }) => void;
  login: ({ isSignedUp }?: { isSignedUp?: boolean }) => void;
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
  const { setWishlistsData, setCart, setTotalCartCost, setCartId } =
    useMyContext();
  const router = useRouter();
  // const [emailResetPassword, setEmailResetPassword] = useState<
  //   null | string
  // >(null);

  useEffect(() => {
    const id = getIdFromToken();
    setUserId(id);
  }, []);

  const logout = () => {
    // 2. Notify other tabs
    localStorage.setItem('logout', Date.now().toString());

    // Clear client state in store
    removeCookie('token');

    setUserId(null);
    setAddressesData(null);

    setWishlistsData([]); // Todo: View if this makes a problem and it does Clear wishlist data

    clearCartAndId({ setCart, setTotalCartCost, setCartId });

    router.push('/signin');
  };

  const login = ({
    isSignedUp = false
  }: {
    isSignedUp?: boolean;
  } = {}) => {
    // 2. Notify other tabs
    localStorage.setItem('signin', Date.now().toString());

    if (isSignedUp) {
      window.location.pathname = '/products';
    } else {
      router.push('/products');
    }
  };

  return (
    <UserContext.Provider
      value={{
        userId,
        setUserId,
        addressesData,
        setAddressesData,
        otpVerification,
        setOtpVerification,
        logout,
        login
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
