import type { NextApiResponse } from 'next';

export interface CustomerPaymentDetailsType {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  city: string;
  country: string;
  street: string;
  building: string;
  floor: string;
  apartment: string;
  state: string;
}

export interface ItemDetails {
  name: string;
  amount_cost: number;
  description: string;
  quantity: number;
}

export interface PaymentRequest {
  order_id: string;
  total_order_cost: number;
  items: ItemDetails[];
  customerDetails: CustomerPaymentDetailsType;
}

export type PaymentResonseURL = Promise<
  | NextApiResponse<{
      success: boolean;
      paymentUrl: string;
    }>
  | NextApiResponse<{
      success: boolean;
      error: any;
    }>
>;

type addressType = {
  city: string;
  address_1: string;
  zip_code: number;
  address_2: string;
  building: string;
  floor: string;
  apartment: number;
  first_name: string;
  last_name: string;
  delivery_phone: string;
  shipping_cost: {
    data: {
      attributes: {
        governorate: string;
      };
    };
  };
} | null;

export interface PaymentDataType {
  emailOrPhone: string;
  shippingAddressData: addressType;
  billingAddressData: addressType;
  items:
    | {
        product: {
          data: {
            id: string;
            attributes: {
              name: string;
              final_product_price: number;
              description: string;
            };
          };
        };
        quantity: number;
        total_cost: number;
      }[]
    | null;
  order_id: string | null;
  total_order_cost: number | null;
}
