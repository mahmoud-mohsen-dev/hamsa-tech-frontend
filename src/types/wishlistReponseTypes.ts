export interface WishlistResponseType {
  data: {
    createWishlist: {
      data: {
        id: string;
      } | null;
    };
  } | null;
  error: string | null;
}
