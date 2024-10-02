export interface FreeShippingAttributesType {
  apply_free_shipping_if_total_cart_cost_equals: number;
  enable: boolean;
}

interface FreeShippingDataType {
  attributes: FreeShippingAttributesType;
}

export interface FreeShippingResponseType {
  data: {
    freeShipping: {
      data: FreeShippingDataType;
    } | null;
  };
  error: string | null;
}
