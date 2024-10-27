export type OrderSummaryType = {
  id: string;
  attributes: {
    total_order_cost: number;
    payment_method: 'card' | 'cash_on_delivery' | string;
    payment_status: 'pending' | 'paid' | string;
    createdAt: string;
    guest_user: {
      data: {
        id: string;
      } | null;
    };
    user: {
      data: {
        id: string;
      } | null;
    };
    shipping_address: {
      data: {
        attributes: {
          shipping_cost: {
            data: {
              attributes: {
                delivery_duration_in_days: number;
              };
            };
          };
        };
      } | null;
    };
    invoice: {
      data: {
        attributes: {
          name: string;
          url: string;
        };
      } | null;
    };
  };
};

export type GetOrderSummaryByIdType = {
  data: {
    order: {
      data: OrderSummaryType | null;
    };
  };
  error?: string | null;
};

export type CallCallbackResponseType = {
  data: {
    message: string;
    orderId: string;
    status: string;
  } | null;
  error: {
    message: string;
    error: unknown;
  } | null;
};
