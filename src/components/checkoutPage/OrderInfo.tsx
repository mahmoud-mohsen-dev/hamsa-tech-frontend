'use client';

import { Button, ConfigProvider, Form } from 'antd';
import AddressFormItems from './AddressFormItems';
import BillingAddress from './BillingAddress';
import PaymentMethods from './PaymentMethods';
import Contact from './Contact';
import { useTranslations } from 'next-intl';
import ShippingCost from './ShippingCost';
import { useForm } from 'antd/es/form/Form';
import { ShippingCostDataType } from '@/types/shippingCostResponseTypes';
import { FreeShippingAttributesType } from '@/types/freeShippingResponseType';
import { useEffect } from 'react';
import { useMyContext } from '@/context/Store';

function OrderInfo({
  shippingCostData,
  freeShippingData
}: {
  shippingCostData: ShippingCostDataType[] | [];
  freeShippingData: FreeShippingAttributesType | undefined;
}) {
  const [form] = useForm();
  const { setFreeShippingAt } = useMyContext();
  const t = useTranslations('CheckoutPage.content');
  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
  };

  useEffect(() => {
    if (
      typeof freeShippingData === 'object' &&
      freeShippingData.apply_free_shipping_if_total_cart_cost_equals &&
      freeShippingData.enable
    ) {
      setFreeShippingAt(freeShippingData);
    }
  }, [freeShippingData]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1677ff',
          colorBorder: '#dedede',
          colorTextPlaceholder: '#9b9b9bbd',
          borderRadius: 4,
          lineWidth: 1
        },
        components: {
          Input: {
            activeShadow: '0 0 0 3px rgba(5, 145, 255, 0.1)',
            paddingBlock: 10,
            paddingInline: 15
          },
          Checkbox: {
            borderRadiusSM: 4
          },
          Select: {
            controlHeight: 46
          }
        }
      }}
    >
      <Form
        name='order-info'
        onFinish={onFinish}
        colon={false}
        form={form}
        initialValues={{
          sendNewsLetter: false,
          shippingDetailsCountry: 'egypt',
          billingDetailsCountry: 'egypt',
          paymentMethod: 'card',
          billingMethod: 'same'
        }}
      >
        {/* Deliver Section */}
        <Contact />
        {/* Deliver Section */}
        <h2 className='mt-4 text-xl font-semibold'>
          {t('deliveryTitle')}
        </h2>
        <AddressFormItems
          name='shippingDetails'
          shippingCostData={shippingCostData}
        />

        {/* Shipping Cost*/}
        <ShippingCost />

        {/* Payment Methods*/}
        <PaymentMethods form={form} />
        {/* Billing Address */}
        <BillingAddress form={form} />
        <Button
          type='primary'
          htmlType='submit'
          className='mt-3 w-full capitalize'
          style={{
            paddingBlock: '20px',
            fontSize: '16px',
            lineHeight: '24px',
            fontWeight: '600',
            borderRadius: 2
          }}
        >
          {t('submitButtonText')}
        </Button>
      </Form>
    </ConfigProvider>
  );
}

export default OrderInfo;
