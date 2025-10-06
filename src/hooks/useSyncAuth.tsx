import { useMyContext } from '@/context/Store';
import { useUser } from '@/context/UserContext';
import { useRouter } from '@/navigation';
import { clearCartAndId } from '@/services/cart';
import { getIdFromToken, removeCookie } from '@/utils/cookieUtils';
import { useEffect } from 'react';

export function useSyncAuth({
  setCartId
}: {
  setCartId: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const router = useRouter();
  const { setUserId, setAddressesData } = useUser();
  const { setWishlistsData, setCart, setTotalCartCost } =
    useMyContext();

  useEffect(() => {
    const syncLogout = (event: StorageEvent) => {
      if (event.key === 'logout') {
        // Clear client state if you store user info in React state
        console.log('logout was called');
        removeCookie('token');

        setUserId(null);
        setAddressesData(null);

        setWishlistsData([]); // Todo: View if this makes a problem and it does Clear wishlist data

        clearCartAndId({ setCart, setTotalCartCost, setCartId });

        router.push('/signin'); // Use router to redirect to the login page
      }
    };

    window.addEventListener('storage', syncLogout);
    return () => window.removeEventListener('storage', syncLogout);
  }, [router]);

  useEffect(() => {
    const syncSignin = (event: StorageEvent) => {
      if (event.key === 'signin') {
        const userId = getIdFromToken();

        setUserId(userId);

        router.push('/products'); // Use router to redirect to the products page
      }
    };

    window.addEventListener('storage', syncSignin);
    return () => window.removeEventListener('storage', syncSignin);
  }, [router]);

  return null;
}
