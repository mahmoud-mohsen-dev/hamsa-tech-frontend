import useSWR from 'swr';

const useWishlist = (wishlistId: string | null, locale: string) => {
  const {
    data: wishlistData,
    mutate,
    isValidating
  } = useSWR(
    wishlistId ? ['wishlist', wishlistId, locale] : null,
    () => fetchWishlistData(wishlistId!),
    {
      revalidateOnFocus: true,
      revalidateIfStale: true,
      revalidateOnReconnect: true
    }
  );

  return { wishlistData, mutate, isValidating };
};

export default useWishlist;
