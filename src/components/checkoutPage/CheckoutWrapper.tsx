'use client';

import CheckoutCart from './CheckoutCart';
import OrderInfo from './OrderInfo';
import { Spin } from 'antd';
import { ShippingCostDataType } from '@/types/shippingCostResponseTypes';
import useHandleMessagePopup from '@/hooks/useHandleMessagePopup';

function CheckoutWrapper({
  shippingCostData
}: {
  shippingCostData: ShippingCostDataType[] | [];
}) {
  const { loadingMessage } = useHandleMessagePopup();

  return (
    <>
      {/* {contextHolder} */}
      {loadingMessage ?
        <div className='container grid min-h-[calc(100vh-48px-20px)] place-content-center'>
          <Spin size='large' />
        </div>
      : <div className='grid text-black 2xl:mx-10 2xl:grid-cols-checkout'>
          <OrderInfo shippingCostData={shippingCostData} />
          <CheckoutCart />
        </div>
      }
    </>
  );
}

export default CheckoutWrapper;
