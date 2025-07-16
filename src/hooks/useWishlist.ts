import { fetchWishlistData } from '@/services/wishlist';
import { WishlistsDataType } from '@/types/wishlistReponseTypes';
import useSWR from 'swr';

const useWishlist = ({
  wishlistId,
  locale,
  setIsWishlistLoading,
  setWishlistsData
}: {
  wishlistId: string | null;
  locale: string;
  setIsWishlistLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setWishlistsData: React.Dispatch<
    React.SetStateAction<WishlistsDataType>
  >;
}) => {
  const {
    data: wishlistData,
    mutate,
    isValidating
  } = useSWR(
    wishlistId ? ['wishlist', wishlistId, locale] : null,
    () =>
      fetchWishlistData({
        locale,
        setIsWishlistLoading,
        setWishlistsData
      }),
    {
      revalidateOnFocus: true,
      revalidateIfStale: true,
      revalidateOnReconnect: true
    }
  );

  return { wishlistData, mutate, isValidating };
};

export default useWishlist;
