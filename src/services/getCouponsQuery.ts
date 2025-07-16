import { generateISODateForGraphQL } from '@/utils/dateHelpers';

export const getCouponsByCodeNameQuery = (name: string): string => {
  return `{
    coupons(
      filters: {
        coupon_code: { eq: "${name}" }
        start_date: { lte: "${generateISODateForGraphQL()}" }
        expiration_date: { gte: "${generateISODateForGraphQL()}" }
      }
      sort: "createdAt:desc"
    ) {
        data {
            id
            attributes {
                coupon_code
                start_date
                expiration_date
                deduction_value
                deduction_value_by_percent
            }
        }
    }
  }`;
};
export const getCouponsQuery = (locale: string): string => {
  return `{
    coupons(
      filters: {
        start_date: { lte: "${generateISODateForGraphQL()}" }
        expiration_date: { gte: "${generateISODateForGraphQL()}" }
      }
      sort: "createdAt:desc"
      locale: "${locale ?? 'ar'}"
    ) {
        data {
            id
            attributes {
                coupon_code
                start_date
                expiration_date
                deduction_value
                deduction_value_by_percent
                image {
                    data {
                        attributes {
                            alternativeText
                            url
                        }
                    }
                }
            }
        }
    }
  }`;
};
