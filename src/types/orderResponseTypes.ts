// Define the structure of the Shipping Address
type ShippingAddressType = {
  city: string;
  address_1: string;
  address_2: string;
  zip_code: number;
  first_name: string;
  last_name: string;
  delivery_phone: string;
};

// Define the structure of the Product
type ProductType = {
  name: string;
  final_product_price: number;
};

// Define the structure of the Cart Item
type CartItemType = {
  id: string;
  product: {
    data: {
      attributes: ProductType;
    };
  };
  quantity: number;
  total_cost: number;
};

// Define the structure of the Invoice
type InvoiceType = {
  url: string;
  ext: string;
  mime: string;
  size: number;
};

// Define the structure of the Order Attributes
type OrderAttributesType = {
  delivery_status: string;
  payment_status: string;
  subtotal_cart_cost: number;
  total_order_cost: number;
  payment_method: string;
  createdAt: string;
  delivery_cost: number;
  coupon_applied_value: number;
  shipping_address: {
    data: {
      attributes: ShippingAddressType;
    };
  };
  cart: CartItemType[];
  invoice: {
    data: {
      attributes: InvoiceType;
    } | null; // Invoice can be null
  } | null; // Invoice can be null
};

// Define the structure of the overall response
export type GetOrderResponseType = {
  data: {
    order: {
      data: {
        attributes: OrderAttributesType;
      };
    };
  };
  error: string | null; // Error can be a string or null
};

export type OrderInfoType = {
  id: string;
  attributes: {
    delivery_status: string;
    total_order_cost: number;
    payment_method: string;
    payment_status: string;
    delivery_cost: number;
    coupon_applied_value: number;
    subtotal_cart_cost: number | null;
    createdAt: string;
    user: {
      data: {
        id: string;
      } | null;
    } | null;
    guest_user: {
      data: {
        id: string;
      } | null;
    } | null;
    shipping_address: {
      data: {
        attributes: {
          city: string;
          address_1: string;
          zip_code: number;
          address_2: string;
          first_name: string;
          last_name: string;
          delivery_phone: string;
        };
      } | null;
    } | null;
    cart: {
      product: {
        data: {
          id: string;
          attributes: {
            name: string;
            final_product_price: number;
          };
        };
      };
      quantity: number;
      total_cost: number;
      // cost: number;
    }[];
  };
} | null;

export interface CreateOrderResponseType {
  data: {
    createOrder: {
      data: OrderInfoType;
    };
  } | null;
  error: string | null;
}

export type OrderAttributes = {
  delivery_status: string;
  payment_status: string;
  total_order_cost: number;
  payment_method: string;
  createdAt: string;
  user: {
    data: {
      id: string;
    };
  };
};

export type OrderDataType = {
  id: string;
  attributes: OrderAttributes;
};

export type PaginationMeta = {
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
};

export type GetOrdersAuthenticatedResponse = {
  data: {
    orders: {
      data: OrderDataType[];
      meta: {
        pagination: PaginationMeta;
      };
    };
  };
  error: string | null;
};
