'use client';
import { Link } from '@/navigation';
import { getCookie } from '@/utils/cookieUtils';
import { Checkbox, Form, Input, Skeleton } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { v4 } from 'uuid';

function Contact({ isPageLoading }: { isPageLoading: boolean }) {
  const t = useTranslations('CheckoutPage.content');
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<null | string>(
    null
  );

  useEffect(() => {
    setIsUserLoggedIn(getCookie('token'));
  }, []);

  return isPageLoading ?
      <div className='flex flex-col gap-3'>
        <Skeleton.Node
          key={v4()}
          active={true}
          style={{ width: '145px', height: '32px' }}
        />
        <Skeleton.Node
          key={v4()}
          active={true}
          style={{ width: '100%', height: '43px' }}
        />
        <Skeleton.Node
          key={v4()}
          active={true}
          style={{ width: '200px', height: '24px' }}
        />
      </div>
    : <>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-semibold'>
            {t('contactTitle')}
          </h2>
          {isUserLoggedIn ? null : (
            <Link
              href={'/signin'}
              className='text-base font-normal text-blue-sky-normal underline hover:underline'
            >
              {t('loginTitle')}
            </Link>
          )}
        </div>
        <Form.Item
          name='emailOrPhone'
          rules={[
            {
              required: true,
              message: t(
                'formValidationErrorMessages.inputEmailOrPhone'
              )
            }
          ]}
          style={{ marginTop: '16px', marginBottom: '16px' }}
        >
          <Input
            type='text'
            placeholder={t('emailOrPhoneTitlePlaceholder')}
            style={{ fontSize: '13px' }}
          />
        </Form.Item>
        <Form.Item
          name='sendNewsLetter'
          valuePropName='checked'
          style={{ marginTop: '5px', marginBottom: 0 }}
        >
          <Checkbox>{t('confirmToSendNewsletter')}</Checkbox>
        </Form.Item>
      </>;
}

export default Contact;
