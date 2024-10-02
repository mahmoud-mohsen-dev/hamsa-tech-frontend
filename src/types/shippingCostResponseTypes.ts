interface ShippingCostAttributesType {
  governorate: string;
  delivery_cost: number;
  delivery_duration_in_days: number;
}

export interface ShippingCostDataType {
  id: string;
  attributes: ShippingCostAttributesType;
}

interface ShippingCostsType {
  data: ShippingCostDataType[];
}

export interface GetShippingCostResponseType {
  data: {
    shippingCosts: ShippingCostsType;
  };
  error: string | null;
}
