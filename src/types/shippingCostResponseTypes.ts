export interface deliveryZoneType {
  zone_name_in_arabic: string | null;
  zone_name_in_english: string | null;
  id: string | null;
  minimum_delivery_duration_in_days: number | null;
  maximum_delivery_duration_in_days: number | null;
  calculated_delivery_cost: number | null;
}

export interface feeType {
  id: string | null;
  include_the_fee_in_total_shipping_cost: boolean | null;
  minimum_total_order_price_to_apply_fee: number | null;
  fixed_fee_amount: number | null;
  percentage_based_fee: number | null;
  comment: string | null;
  money_increment_amount: number | null;
  fixed_extra_fee_per_increment: number | null;
  VAT: number | null;
  add_base_fees_to_total_increment_fee: boolean | null;
  apply_difference_based_fee: boolean | null;
}

interface flyersType {
  include_flyer_cost_in_total_shipping_cost: boolean | null;
  total_flyers_free_every_month: number | null;
  average_cost_per_flyer: number | null;
}

export interface weightType {
  enable_maximum_weight_fee_for_standard_shipping_in_grams:
    | boolean
    | null;
  maximum_weight_for_standard_shipping_in_grams: number | null;
  volumetric_weight_applied_if_needed: boolean | null;
  volumetric_weight_applied_if_needed_in_grams: number | null;
  fixed_extra_fee_per_increment: number | null;
  weight_increment_for_fixed_fee_in_grams: number | null;
  VAT: number | null;
  apply_difference_based_fee: boolean | null;
}

interface orderType {
  id: string | null;
}

export interface shippingCompanyType {
  delivery_zones: deliveryZoneType[] | null;
  cash_on_delivery_cost: number | null;
  include_cash_on_delivery_in_total_shipping_cost: boolean | null;
  bank_fees_for_each_transfer: feeType[] | null;
  extra_shipping_company_fees_for_cash_on_delivery: feeType[] | null;
  flyers: flyersType | null;
  weight: weightType | null;
  shipping_company_name: string | null;
  other_compnay_fees: feeType[] | null;
  orders: { data: orderType[] | null } | null;
}

interface defaultShippingCompanyType {
  data: {
    id: string | null;
    attributes: shippingCompanyType | null;
  } | null;
}

export interface shppingConfigDataType {
  default_shipping_company: defaultShippingCompanyType | null;
  add_to_total_shipping_cost: number | null;
  deduct_from_total_shipping_cost: number | null;
  enable_checkout: boolean | null;
}

interface shippingConfigDataType {
  shippingConfig: {
    data: {
      attributes: shppingConfigDataType | null;
    } | null;
  } | null;
}

export interface GetShippingCostResponseType {
  // data: {
  //   shippingCosts: ShippingCostsType;
  // };
  data: shippingConfigDataType;
  error: string | null;
}

export interface ShippingCostsDataType {
  final_calculated_delivery_cost?: number;
  zone_name_in_arabic: string | null;
  zone_name_in_english: string | null;
  id: string | null;
  minimum_delivery_duration_in_days: number | null;
  maximum_delivery_duration_in_days: number | null;
  calculated_delivery_cost: number | null;
}
