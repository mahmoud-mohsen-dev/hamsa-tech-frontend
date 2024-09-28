export type CreateCartResponseType = {
  data: {
    createCart: {
      data: {
        id: string;
      };
    };
  };
  error: string | null;
};

export type CartDataType = {
  id: string;
  quantity: number;
  product: {
    data: {
      id: string;
      attributes: {
        name: string;
        price: number;
        sale_price: number;
        image_thumbnail: {
          data: {
            id: string;
            attributes: {
              alternativeText: string;
              url: string;
            };
          };
        };
        stock: number;
        localizations: {
          data: {
            id: string;
          }[];
        };
        locale: string;
      };
    };
  };
};


export type GetCartResponseType = {
  data: {
    cart: {
      data: {
        attributes: {
          product_details: CartDataType[];
        };
      } | null;
    };
  };
  error: string | null;
};

export type updateCartResponseType = {
  data: {
    updateCart: {
      data: {
        attributes: {
          product_details: CartDataType[];
        };
      } | null;
    };
  };
  error: string | null;
};
