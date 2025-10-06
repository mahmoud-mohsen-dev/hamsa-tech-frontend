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
              alternativeText: string | null;
              url: string;
            };
          };
        };
        stock: number;
        final_package_weight_in_grams: number | null;
        localizations: {
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
                    alternativeText: null | string;
                    url: string;
                  };
                };
              };
              locale: string;
            };
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
        id: string;
        attributes: {
          total_cart_cost: number;
          product_details: CartDataType[];
        };
      } | null;
    };
  };
  error: string | null;
};

export type GetUserCartIdResponseType = {
  data: {
    usersPermissionsUsers: {
      data:
        | [
            {
              id: string;
              attributes: {
                cart: {
                  data: {
                    id: string;
                  } | null;
                };
              } | null;
            }
          ]
        | null;
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

export type UpdateCartWithUserIdOrGuestIdResponseType = {
  data: {
    updateCart: {
      data: {
        id: string;
        attributes: {
          guest_user: {
            data: string | null;
          } | null;
          users_permissions_user: {
            data: {
              id: string | null;
            } | null;
          };
        };
      } | null;
    };
  };
  error: string | null;
};
