'use client';

import { Button, ConfigProvider, Form } from 'antd';
import AddressFormItems from './AddressFormItems';
import BillingAddress from './BillingAddress';
import PaymentMethods from './PaymentMethods';
import Contact from './Contact';
import { useTranslations } from 'next-intl';
import ShippingCost from './ShippingCost';

function OrderInfo() {
  const t = useTranslations('CheckoutPage.content');
  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1677ff',
          colorBorder: '#d9d9d9c8',
          colorTextPlaceholder: '#9b9b9bbd',
          borderRadius: 4,
          lineWidth: 2
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
        <AddressFormItems name='shippingDetails' />

        {/* Shipping Cost*/}
        <ShippingCost />

        {/* Payment Methods*/}
        <PaymentMethods />
        {/* Billing Address */}
        <BillingAddress />
        <Button
          type='primary'
          htmlType='submit'
          className='mt-3 w-full'
          style={{
            paddingBlock: '20px',
            fontSize: '16px',
            lineHeight: '24px',
            fontWeight: '600'
          }}
        >
          {t('submitButtonText')}
        </Button>
      </Form>
    </ConfigProvider>
  );
}

export default OrderInfo;
