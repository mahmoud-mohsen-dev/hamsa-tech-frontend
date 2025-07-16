'use client';

import CheckoutCart from './CheckoutCart';
import OrderInfo from './OrderInfo';
import { Spin } from 'antd';
import useHandleMessagePopup from '@/hooks/useHandleMessagePopup';
import {
  GetShippingCostResponseType,
  shippingCompanyType,
  shppingConfigDataType
} from '@/types/shippingCostResponseTypes';
// import { deliveryZoneType } from '@/types/shippingCostResponseTypes';

function CheckoutWrapper({
  shippingConfigData
}: {
  shippingConfigData: shppingConfigDataType | null;
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
          <OrderInfo shippingConfigData={shippingConfigData} />
          <CheckoutCart />
        </div>
      }
    </>
  );
}

export default CheckoutWrapper;
