export interface CreateOrderResponseType {
  data: {
    createOrder: {
      data: {
        id: string;
      } | null;
    };
  } | null;
  error: string | null;
}
