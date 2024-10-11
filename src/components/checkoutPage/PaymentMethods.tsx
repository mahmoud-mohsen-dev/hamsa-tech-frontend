import { Collapse, Form, Radio } from 'antd';
import Image from 'next/image';
import type { CollapseProps, FormInstance } from 'antd';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

function PaymentMethods({ form }: { form: FormInstance<any> }) {
  const t = useTranslations('CheckoutPage.content');
  const [paymentValue, setPaymentValue] = useState('card');

  const onCollapsePaymentChange = (key: string | string[]) => {
    if (Array.isArray(key) && key[0]) {
      setPaymentValue(key[0]);
      form.setFieldValue('paymentMethod', key[0]);
    }
  };
  // const onRadioChange = (e) => {
  //   console.log(e.target.value);
  // };
  // console.log(paymentValue, 'paymentValue');
  const getPaymentItems: () => CollapseProps['items'] = () => [
    {
      key: 'card',
      label: (
        <Radio
          value='card'
          style={{ width: '100%' }}
          // checked={paymentValue === 'card'}
        >
          {t('payWithCreditCardTitle')}
        </Radio>
      ),
      // style: {
      //   backgroundColor:
      //     paymentValue === 'card' ? '#f2f7ff' : '#fafafa'
      // },
      extra: (
        <div className='flex flex-wrap items-center gap-1'>
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
      key: 'cash_on_delivery',
      label: (
        <Radio
          value='cash_on_delivery'
          style={{ width: '100%' }}
          // checked={paymentValue === 'cashOnDelivery'}
        >
          {t('payOnDeliveryTitle')}
        </Radio>
      ),
      // style: {
      //   backgroundColor:
      //     paymentValue === 'cashOnDelivery' ? '#f2f7ff' : '#fafafa'
      // },
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
        <Radio.Group style={{ width: '100%' }}>
          <Collapse
            bordered={false}
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
