'use client';

import { useMyContext } from '@/context/Store';
import CheckoutCart from './CheckoutCart';
import OrderInfo from './OrderInfo';
import { message, Spin } from 'antd';
import { ShippingCostDataType } from '@/types/shippingCostResponseTypes';
import { FreeShippingAttributesType } from '@/types/freeShippingResponseType';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

function CheckoutWrapper({
  shippingCostData,
  freeShippingData
}: {
  shippingCostData: ShippingCostDataType[] | [];
  freeShippingData: FreeShippingAttributesType | undefined;
}) {
  const {
    loadingMessage,
    errorMessage,
    successMessage,
    setLoadingMessage,
    setErrorMessage,
    setSuccessMessage
  } = useMyContext();
  const t = useTranslations('CheckoutPage.content');
  const [messageApi, contextHolder] = message.useMessage();

  // Effect to handle loading message
  useEffect(() => {
    if (loadingMessage) {
      messageApi.open({
        type: 'loading',
        content: t('form.loading')
      });
    } else {
      messageApi.destroy();
      setLoadingMessage(false);
      setErrorMessage('');
      setSuccessMessage('');
    }
  }, [loadingMessage]);

  // Effect to handle error message
  useEffect(() => {
    if (errorMessage) {
      message.error(errorMessage);
    }
  }, [errorMessage]);

  // Effect to handle success message
  useEffect(() => {
    if (successMessage) {
      messageApi.success(successMessage);
    }
  }, [successMessage]);

  return (
    <>
      {contextHolder}
      {loadingMessage ?
        <div className='container grid min-h-[500px] place-content-center'>
          <Spin size='large' />
        </div>
      : <div className='grid text-black 2xl:mx-10 2xl:grid-cols-checkout'>
          <OrderInfo
            shippingCostData={shippingCostData}
            freeShippingData={freeShippingData}
          />
          <CheckoutCart />
        </div>
      }
    </>
  );
}

export default CheckoutWrapper;
