'use client';

import { useMyContext } from '@/context/Store';
import Image from 'next/image';
import { convertToArabicNumeralsWithFormatting } from '@/utils/numbersFormating';
import { Button, ConfigProvider, Form, Input } from 'antd';
import { useLocale, useTranslations } from 'next-intl';

function CheckoutCart() {
  const {
    cart,
    calculateTotalCartItems,
    calculateSubTotalCartCost,
    shippingCost
  } = useMyContext();
  const t = useTranslations('CheckoutPage.content');
  const locale = useLocale();
  const totalCartQuantities = calculateTotalCartItems();
  const totalCartCost = calculateSubTotalCartCost() + shippingCost;

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 4
        }
      }}
    >
      <div className='px-10 py-5'>
        <ul className='flex flex-col gap-3'>
          {cart.map((item) => {
            let cost = 0;
            if (
              item?.product?.data?.attributes?.sale_price > 0 &&
              item?.quantity
            ) {
              cost =
                item?.product?.data?.attributes?.sale_price *
                item?.quantity;
            } else {
              cost =
                item?.product?.data?.attributes?.price *
                item?.quantity;
            }

            return (
              <li
                key={item.id}
                className='grid grid-cols-[54px_1fr_65px_20px_65px] items-center gap-3'
              >
                <div className='overflow-hidden rounded border border-solid border-gray-light'>
                  <Image
                    src={
                      item?.product?.data?.attributes?.image_thumbnail
                        ?.data?.attributes?.url ?? ''
                    }
                    alt={
                      item?.product?.data?.attributes?.image_thumbnail
                        ?.data?.attributes?.alternativeText ?? ''
                    }
                    width={54}
                    height={54}
                    quality={100}
                    className='min-h-[54px] min-w-[54px] object-contain'
                  />
                </div>
                <h4 className='font-sans text-base'>
                  {item?.product?.data?.attributes?.name ?? ''}
                </h4>
                <p className='font-sans text-sm' dir='ltr'>
                  {convertToArabicNumeralsWithFormatting(
                    item?.product?.data?.attributes?.sale_price > 0 ?
                      item?.product?.data?.attributes?.sale_price
                    : item?.product?.data?.attributes?.price,
                    t('currency'),
                    locale
                  )}
                </p>
                <p className='font-sans text-sm'>{item?.quantity}</p>
                <p className='font-sans text-sm'>
                  {convertToArabicNumeralsWithFormatting(
                    cost,
                    t('currency'),
                    locale
                  )}
                </p>
              </li>
            );
          })}
        </ul>

        <Form
          name='couponForm'
          style={{
            marginTop: '16px',
            display: 'flex',
            gap: '10px',
            justifyContent: 'center'
          }}
        >
          <Form.Item
            name='coupon'
            style={{ flexBasis: '100%', marginBottom: '0px' }}
          >
            <Input
              type='text'
              placeholder={t('copounPlaceholder')}
              style={{
                // borderRadius: '5px',
                paddingBlock: '11px',
                paddingInline: '13px',
                fontSize: '14px'
              }}
            />
          </Form.Item>
          <Button
            type='default'
            htmlType='submit'
            style={{
              // borderRadius: '5px',
              fontSize: '14px',
              height: '46px'
            }}
          >
            {t('applyButtonText')}
          </Button>
        </Form>

        <div className='mt-4 flex items-center justify-between font-sans text-sm'>
          <div>
            <span>{t('subtotalTitle')} • </span>
            <span>
              {totalCartQuantities === 1 ?
                `${totalCartQuantities} ${t('itemTitle')}`
              : `${totalCartQuantities} ${t('itemsTitle')}`}
            </span>
          </div>
          <p>
            {convertToArabicNumeralsWithFormatting(
              calculateSubTotalCartCost(),
              t('currency'),
              locale
            )}
          </p>
        </div>

        <div className='mt-3 flex items-center justify-between font-sans text-sm'>
          <span>{t('shippingTitle')}</span>
          <span>
            {convertToArabicNumeralsWithFormatting(
              shippingCost,
              t('currency'),
              locale
            )}
          </span>
        </div>

        <div className='mt-3 flex items-center justify-between font-sans text-base font-semibold'>
          <span>{t('totalTitle')}</span>
          <span>
            {convertToArabicNumeralsWithFormatting(
              totalCartCost,
              t('currency'),
              locale
            )}
          </span>
        </div>
      </div>
    </ConfigProvider>
  );
}

export default CheckoutCart;
