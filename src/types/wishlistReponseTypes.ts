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
export interface createWishlistLocalizationResponseType {
  data: {
    createWishlistLocalization: {
      data: {
        id: string;
        attributes: {
          locale: 'en';
          localizations: {
            data:
              | [
                  {
                    id: string;
                    attributes: {
                      locale: 'ar';
                    };
                  }
                ]
              | null;
          };
        };
      } | null;
    };
  } | null;
  error: string | null;
}

export interface WishlistDataType {
  id: string;
  attributes: {
    name: string;
    price: number;
    sale_price: number;
    image_thumbnail: {
      data: {
        attributes: {
          alternativeText: string;
          url: string;
        };
      };
    };
    stock: number;
    locale: string;
    localizations: {
      data: [
        {
          id: string;
          attributes: {
            locale: string;
          };
        }
      ];
    };
  };
}

export type WishlistsDataType = WishlistDataType[];

export interface GetWishlistDataType {
  data: {
    wishlist: {
      data: {
        id: string;
        attributes: {
          products: {
            data: WishlistsDataType | null;
          };
        };
      };
    };
  } | null;
  error: null | string;
}

export interface UpdateWishlistDataType {
  data: {
    updateWishlist: {
      data: {
        id: string;
        attributes: {
          products: {
            data: WishlistsDataType | null;
          };
        };
      } | null;
    };
  } | null;
  error: string | null;
}
