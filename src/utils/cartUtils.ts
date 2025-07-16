'use client';
import { CartDataType } from '@/types/cartResponseTypes';

export const validateOrder = async ({
  cart,
  subTotalCartCost,
  deliveryCost,
  couponAppliedValue,
  totalOrderCost,
  userId,
  guestUserId,
  shippingAddressId,
  billingAddressId,
  generalErrorMessage,
  invalidProductErrorMessage,
  totalCostErrorMessage
}: {
  cart: CartDataType[];
  subTotalCartCost: number;
  deliveryCost: number;
  couponAppliedValue: number;
  totalOrderCost: number;
  userId: string | null;
  guestUserId: string | null;
  shippingAddressId: string | null;
  billingAddressId: string | null;
  generalErrorMessage: string;
  invalidProductErrorMessage: string;
  totalCostErrorMessage: string;
}) => {
  if (
    !Array.isArray(cart) ||
    cart.length === 0 ||
    typeof subTotalCartCost !== 'number' ||
    typeof deliveryCost !== 'number' ||
    typeof couponAppliedValue !== 'number' ||
    typeof totalOrderCost !== 'number' ||
    (typeof userId !== 'string' && typeof guestUserId !== 'string') ||
    typeof shippingAddressId !== 'string' ||
    typeof billingAddressId !== 'string'
  ) {
    throw new Error(generalErrorMessage);
  }

  console.log(cart);
  const subTotalCartCostValidation = cart
    .map((cartItem) => {
      if (
        typeof cartItem?.product?.data?.attributes
          ?.final_product_price !== 'number' ||
        typeof cartItem?.quantity !== 'number' ||
        cartItem?.quantity <= 0 ||
        typeof cartItem?.total_cost !== 'number'
      ) {
        throw new Error(invalidProductErrorMessage);
      }

      const totalItemCost =
        cartItem.quantity *
        cartItem.product.data.attributes.final_product_price;

      if (totalItemCost !== cartItem.total_cost) {
        throw new Error(invalidProductErrorMessage);
      }
      return cartItem.total_cost;
    })
    .filter((cartItem) => cartItem !== null)
    .reduce((acc, itemCost) => (acc += itemCost), 0);

  //   console.log(subTotalCartCostValidation);

  if (subTotalCartCostValidation !== subTotalCartCost) {
    throw new Error(generalErrorMessage);
  }

  const totalCartCostValidation =
    subTotalCartCostValidation - couponAppliedValue + deliveryCost;

  // console.log('totalCartCostValidation', totalCartCostValidation);
  // console.log('deliveryCost', deliveryCost);
  // console.log('couponAppliedValue', couponAppliedValue);
  // console.log('='.repeat(20));
  // console.log('totalCartCostValidation', totalCartCostValidation);
  // console.log('totalOrderCost', totalOrderCost);

  if (totalCartCostValidation < 0 || totalOrderCost < 0) {
    throw new Error(totalCostErrorMessage);
  }

  if (totalOrderCost !== totalCartCostValidation) {
    throw new Error(generalErrorMessage);
  }

  return true;
};
