export type CreateCartResponseType = {
  data: {
    createCart: {
      data: {
        id: string;
      } | null;
    };
  };
  error: string | null;
};

export type CartDataType = {
  id: string;
  quantity: number;
  // cost: number;
  total_cost: number;
  product: {
    data: {
      id: string;
      attributes: {
        name: string;
        price: number;
        sale_price: number;
        final_product_price: number;
        description: string;
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
          total_cart_cost: number;
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
          total_cart_cost: number;
          product_details: CartDataType[];
        };
      } | null;
    };
  };
  error: string | null;
};
