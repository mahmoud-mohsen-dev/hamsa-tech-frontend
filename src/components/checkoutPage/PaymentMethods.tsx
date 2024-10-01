import { Collapse, Form, Radio } from 'antd';
import Image from 'next/image';
import type { CollapseProps } from 'antd';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

function PaymentMethods() {
  const t = useTranslations('CheckoutPage.content');
  const [paymentValue, setPaymentValue] = useState('card');

  const onCollapsePaymentChange = (key: string | string[]) => {
    if (Array.isArray(key) && key[0]) {
      setPaymentValue(key[0]);
    }
  };

  const getPaymentItems: () => CollapseProps['items'] = () => [
    {
      key: 'card',
      label: (
        <Radio value='card' style={{ width: '100%' }}>
          {t('payWithCreditCardTitle')}
        </Radio>
      ),
      style: {
        backgroundColor:
          paymentValue === 'card' ? '#f2f7ff' : '#fafafa'
      },
      extra: (
        <div className='flex items-center gap-1'>
          <Image
            src='/payment-methods/mastercard.svg'
            alt='mastercard logo'
            width={38}
            height={24}
          />
          <Image
            src='/payment-methods/visa.svg'
            alt='visa logo'
            width={38}
            height={24}
          />
          <Image
            src='/payment-methods/valu.svg'
            alt='valu logo'
            width={38}
            height={24}
          />
          <Image
            src='/payment-methods/meeza.svg'
            alt='meeza logo'
            width={38}
            height={24}
          />
        </div>
      ),
      showArrow: false,
      children: (
        <div className='flex flex-col items-center justify-center gap-2'>
          <Image
            src='/payment-methods/redirect.svg'
            alt='pay with card icon'
            width={164}
            height={81}
          />
          <p className='max-w-[340px] text-center'>
            {t('payCithCardSubtitle')}
          </p>
        </div>
      )
    },
    {
      key: 'cashOnDelivery',
      label: (
        <Radio value='cashOnDelivery' style={{ width: '100%' }}>
          {t('payOnDeliveryTitle')}
        </Radio>
      ),
      style: {
        backgroundColor:
          paymentValue === 'cashOnDelivery' ? '#f2f7ff' : '#fafafa'
      },
      showArrow: false,
      children: (
        <p className='text-center'>{t('payOnDeliverySubtitle')}</p>
      )
    }
  ];
  return (
    <>
      <h2 className='my-4 text-xl font-semibold'>
        {t('paymentMethodTitle')}
      </h2>
      <Form.Item name='paymentMethod' style={{ width: '100%' }}>
        <Radio.Group
          // onChange={onPaymentChange}
          value={paymentValue}
          style={{ width: '100%' }}
        >
          <Collapse
            bordered={true}
            defaultActiveKey={['card']}
            activeKey={[paymentValue]}
            onChange={onCollapsePaymentChange}
            accordion
            items={getPaymentItems()}
          />
        </Radio.Group>
      </Form.Item>
    </>
  );
}

export default PaymentMethods;
