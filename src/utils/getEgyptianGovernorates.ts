import { ShippingCostsDataType } from '@/types/shippingCostResponseTypes';
import { v4 } from 'uuid';
import { capitalize } from './helpers';

export function convertShippingCostsToOptions(
  data: ShippingCostsDataType[],
  locale: string
): { label: string; value: string }[] {
  if (data.length > 0) {
    if (locale === 'ar') {
      return data.map((item) => ({
        label:
          item?.zone_name_in_arabic ?
            item.zone_name_in_arabic
          : 'أخري',
        value:
          item?.zone_name_in_arabic ?
            item?.zone_name_in_arabic
          : 'أخري'
      }));
    }
    return data.map((item) => ({
      label:
        item?.zone_name_in_english ?
          capitalize(item.zone_name_in_english)
        : 'Other',
      value:
        item.zone_name_in_english ?
          item.zone_name_in_english
        : 'Other'
    }));
  }
  return [];
}
