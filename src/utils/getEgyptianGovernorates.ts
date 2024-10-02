import { ShippingCostDataType } from '@/types/shippingCostResponseTypes';

export function convertShippingCostsToOptions(
  data: ShippingCostDataType[]
): { label: string; value: string }[] {
  if (data.length > 0) {
    return data.map((item) => ({
      label: item.attributes.governorate,
      value: item.attributes.governorate
    }));
  }
  return [];
}
