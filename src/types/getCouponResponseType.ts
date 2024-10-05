export type CouponDataType = {
  id: string;
  attributes: {
    coupon_code: string;
    expiration_date: string;
    start_date: string;
    deduction_value: number;
    deduction_value_by_percent: number | null;
  };
};

export type GetCouponResponseType = {
  data: {
    offers: {
      data: CouponDataType[];
    };
  } | null;
  error?: string | null;
};
