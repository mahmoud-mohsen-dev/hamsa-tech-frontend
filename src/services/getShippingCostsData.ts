import { CartDataType } from '@/types/cartResponseTypes';
import {
  feeType,
  shippingCompanyType,
  ShippingCostsDataType,
  shppingConfigDataType,
  weightType
} from '@/types/shippingCostResponseTypes';
import { roundToTwo } from '@/utils/numbersFormating';

function calculateTotalFees(
  feeComponentData: feeType[] | null,
  totalOrderCost: number
): number {
  if (
    !Array.isArray(feeComponentData) ||
    feeComponentData.length === 0
  ) {
    return 0;
  }

  return feeComponentData.reduce((acc, cur) => {
    const includeTheFee =
      cur?.include_the_fee_in_total_shipping_cost ?? false;
    const minOrderPrice =
      cur?.minimum_total_order_price_to_apply_fee ?? 0;
    const addBaseFeesToTotalIncrementFee =
      cur?.add_base_fees_to_total_increment_fee ?? false;
    const incrementAmount = cur?.money_increment_amount ?? 0;
    const extraFeePerIncrement =
      cur?.fixed_extra_fee_per_increment ?? 0;
    const fixedFee = cur?.fixed_fee_amount ?? 0;
    const percentageFee = cur?.percentage_based_fee ?? 0;
    const VAT = cur?.VAT ?? 0;
    const useDifference = cur?.apply_difference_based_fee ?? true;

    let totalFee = 0;

    const difference =
      useDifference ? totalOrderCost - minOrderPrice : totalOrderCost;
    const increments =
      incrementAmount > 0 && difference > 0 ?
        difference / incrementAmount
      : 0;

    if (includeTheFee && totalOrderCost > minOrderPrice) {
      if (increments === 0 && !addBaseFeesToTotalIncrementFee) {
        totalFee = 0;
      } else if (increments > 0) {
        const totalIncrements = Math.ceil(increments);
        const incrementFee = totalIncrements * extraFeePerIncrement;

        const netFees =
          (addBaseFeesToTotalIncrementFee ?
            fixedFee + (totalOrderCost * percentageFee) / 100
          : 0) + incrementFee;

        totalFee = netFees + (netFees * VAT) / 100;
      } else {
        const netFees =
          fixedFee + (totalOrderCost * percentageFee) / 100;
        totalFee = netFees + (netFees * VAT) / 100;
      }

      return acc + totalFee;
    }

    return acc;
  }, 0);
}

function calculateDeliveryAndExtraFeeCosts(
  deliveryCost: number,
  companyStandardWeight: weightType | null,
  cart: CartDataType[] | null
) {
  if (
    !companyStandardWeight?.enable_maximum_weight_fee_for_standard_shipping_in_grams ||
    cart === null ||
    cart.length === 0
  ) {
    return deliveryCost;
  }

  const useDifference =
    companyStandardWeight?.apply_difference_based_fee ?? true;
  const maximumWeight =
    companyStandardWeight?.maximum_weight_for_standard_shipping_in_grams ??
    0;
  const extraFixedFeePerIncrement =
    companyStandardWeight?.fixed_extra_fee_per_increment ?? 0;
  const VAT = companyStandardWeight?.VAT ?? 0;
  const weightIncrement =
    companyStandardWeight?.weight_increment_for_fixed_fee_in_grams ??
    0;

  const totalWeight = cart.reduce((acc, cur) => {
    const productWeight =
      cur?.product?.data?.attributes?.final_package_weight_in_grams ??
      0;
    return acc + productWeight;
  }, 0);

  console.log('totalWeight', totalWeight);

  // const increments =
  //   weightIncrement > 0 && totalWeight > 0 ?
  //     totalWeight / weightIncrement
  //   : 0;

  let totalFee = 0;

  if (totalWeight > maximumWeight) {
    const extraWeight =
      useDifference ? totalWeight - maximumWeight : totalWeight;
    const increments =
      weightIncrement > 0 ? extraWeight / weightIncrement : 0;

    // console.log('difference', difference);
    // console.log('incrementAmount', incrementAmount);
    // console.log('increments', increments);

    if (increments > 0) {
      const totalIncrements = Math.ceil(increments);
      const incrementFee =
        totalIncrements * extraFixedFeePerIncrement;

      totalFee = incrementFee + (incrementFee * VAT) / 100;
    }

    return deliveryCost + totalFee;
  }

  return deliveryCost;
}

export const getShippingCosts = ({
  shippingCompanyData,
  shippingConfigData,
  totalOrderCost,
  cart
}: {
  shippingCompanyData: shippingCompanyType | null;
  shippingConfigData: shppingConfigDataType | null;
  totalOrderCost: number;
  cart: CartDataType[] | null;
}): ShippingCostsDataType[] => {
  return (
      Array.isArray(shippingCompanyData?.delivery_zones) &&
        shippingCompanyData?.delivery_zones.length > 0
    ) ?
      shippingCompanyData?.delivery_zones.map((zone) => {
        const deliveryAndExtraFeeCosts =
          calculateDeliveryAndExtraFeeCosts(
            zone?.calculated_delivery_cost || 0,
            shippingCompanyData?.weight ?? null,
            cart
          );

        const totalBankFees = calculateTotalFees(
          shippingCompanyData.bank_fees_for_each_transfer,
          totalOrderCost
        );

        const totalExtraShippingCompanyFeesForCashOnDelivery =
          calculateTotalFees(
            shippingCompanyData.extra_shipping_company_fees_for_cash_on_delivery,
            totalOrderCost
          );

        const totalOtherCompanyFees = calculateTotalFees(
          shippingCompanyData.other_compnay_fees,
          totalOrderCost
        );

        const addToTotalShippingCost =
          shippingConfigData?.add_to_total_shipping_cost ?? 0;
        const deductFromTotalShippingCost =
          shippingConfigData?.deduct_from_total_shipping_cost ?? 0;

        const ordersCount =
          (
            Array.isArray(shippingCompanyData?.orders?.data) &&
            shippingCompanyData?.orders?.data.length > 0
          ) ?
            shippingCompanyData?.orders?.data.reduce(
              (acc, cur, i) =>
                typeof cur?.id === 'string' ? (acc += i + 1) : 0,
              0
            )
          : 0;

        const includeFlyerFee =
          shippingCompanyData?.flyers
            ?.include_flyer_cost_in_total_shipping_cost ?? false;

        const flyerCost =
          (
            includeFlyerFee &&
            typeof shippingCompanyData?.flyers
              ?.average_cost_per_flyer === 'number' &&
            shippingCompanyData?.flyers?.average_cost_per_flyer > 0
          ) ?
            (
              typeof shippingCompanyData?.flyers
                ?.total_flyers_free_every_month === 'number' &&
              ordersCount >
                shippingCompanyData?.flyers
                  ?.total_flyers_free_every_month
            ) ?
              shippingCompanyData.flyers.average_cost_per_flyer
            : 0
          : 0;
        0;

        const totalCost =
          deliveryAndExtraFeeCosts +
          totalBankFees +
          totalExtraShippingCompanyFeesForCashOnDelivery +
          totalOtherCompanyFees +
          flyerCost +
          addToTotalShippingCost -
          deductFromTotalShippingCost;

        console.log(
          JSON.stringify({
            zoneName: zone?.zone_name_in_arabic || '',
            deliveryCost: zone?.calculated_delivery_cost || 0,
            ExtraDeliveryFeeCosts:
              deliveryAndExtraFeeCosts -
              (zone?.calculated_delivery_cost || 0),
            totalBankFees,
            totalExtraShippingCompanyFeesForCashOnDelivery,
            totalOtherCompanyFees,
            flyerCost,
            addToTotalShippingCost,
            deductFromTotalShippingCost,
            totalCost
          })
        );

        return {
          ...zone,
          final_calculated_delivery_cost: roundToTwo(totalCost)
        };
      })
    : [];
};
