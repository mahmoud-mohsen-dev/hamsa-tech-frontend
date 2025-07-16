export type CouponByCodeNameDataType = {
  id: string;
  attributes: {
    coupon_code: string;
    expiration_date: string;
    start_date: string;
    deduction_value: number;
    deduction_value_by_percent: number | null;
  };
};

export type GetCouponByCodeNameResponseType = {
  data: {
    coupons: {
      data: CouponByCodeNameDataType[];
    };
  } | null;
  error?: string | null;
};

export type CouponDataType = {
  id: string;
  attributes: {
    coupon_code: string;
    expiration_date: string;
    start_date: string;
    deduction_value: number;
    deduction_value_by_percent: number | null;
    image: {
      data: {
        attributes: {
          alternativeText: string | null;
          url: string | null;
        };
      } | null;
    };
  };
};

export type GetCouponResponseType = {
  data: {
    coupons: {
      data: CouponDataType[];
    };
  } | null;
  error?: string | null;
};
