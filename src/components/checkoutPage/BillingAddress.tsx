import { Collapse, Form, Radio } from 'antd';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import type { CollapseProps } from 'antd';
import AddressFormItems from './AddressFormItems';

function BillingAddress() {
  const [billingAddressValue, setPaymentBillingValue] =
    useState('same');
  const t = useTranslations('CheckoutPage.content');
  const onCollapseBillingAddressChange = (key: string | string[]) => {
    if (Array.isArray(key) && key[0]) {
      setPaymentBillingValue(key[0]);
    }
  };

  const getPaymentAddressItems: () => CollapseProps['items'] = () => [
    {
      key: 'same',
      label: (
        <Radio value='same' style={{ width: '100%' }}>
          {t('sameAsDeliveryTitle')}
        </Radio>
      ),
      style: {
        backgroundColor:
          billingAddressValue === 'same' ? '#f2f7ff' : '#fafafa'
      },
      showArrow: false,
      className: 'same'
    },
    {
      key: 'different',
      label: (
        <Radio value='different' style={{ width: '100%' }}>
          {t('useDifferentBillingAddress')}
        </Radio>
      ),
      style: {
        backgroundColor:
          billingAddressValue === 'different' ? '#f2f7ff' : '#fafafa'
      },
      showArrow: false,
      children:
        billingAddressValue === 'different' ?
          <AddressFormItems name='billingDetails' />
        : <></>
    }
  ];

  return (
    <>
      <h2 className='my-4 text-xl font-semibold'>
        {t('billingAddressTitle')}
      </h2>
      <Form.Item
        name='billingMethod'
        style={{ width: '100%', marginTop: '16px' }}
      >
        <Radio.Group
          value={billingAddressValue}
          style={{ width: '100%' }}
          id='billing-address'
        >
          <Collapse
            bordered={true}
            defaultActiveKey={['same']}
            activeKey={[billingAddressValue]}
            onChange={onCollapseBillingAddressChange}
            accordion
            items={getPaymentAddressItems()}
          />
        </Radio.Group>
      </Form.Item>
    </>
  );
}

export default BillingAddress;
