'use client';

import { useMyContext } from '@/context/Store';
import Image from 'next/image';
import { formatCurrencyNumbers } from '@/utils/numbersFormating';
import { Button, ConfigProvider, Form, Input } from 'antd';
import { useLocale, useTranslations } from 'next-intl';
import { IoIosPricetag } from 'react-icons/io';

function CheckoutCart() {
  const {
    cart,
    calculateTotalCartItems,
    calculateSubTotalCartCost,
    selectedGovernorate,
    freeShippingAt
  } = useMyContext();
  const t = useTranslations('CheckoutPage.content');
  const locale = useLocale();
  const totalCartQuantities = calculateTotalCartItems();
  const deliveryCost = selectedGovernorate?.attributes.delivery_cost;

  const subTotalCost = calculateSubTotalCartCost();
  let applyFreeShipping = false;
  if (
    freeShippingAt?.apply_free_shipping_if_total_cart_cost_equals &&
    freeShippingAt.enable
  ) {
    applyFreeShipping =
      subTotalCost > 0 &&
      subTotalCost >
        freeShippingAt?.apply_free_shipping_if_total_cart_cost_equals;
  }

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
            // let cost = 0;
            // if (
            //   item?.product?.data?.attributes?.sale_price > 0 &&
            //   item?.quantity
            // ) {
            //   cost =
            //     item?.product?.data?.attributes?.sale_price *
            //     item?.quantity;
            // } else {
            //   cost =
            //     item?.product?.data?.attributes?.price *
            //     item?.quantity;
            // }

            return (
              <li
                key={item.id}
                className='grid grid-cols-[54px_1fr_75px_20px_85px] items-center gap-2'
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
                <h4 className={`mx-1.5 font-sans text-sm`}>
                  {item?.product?.data?.attributes?.name ?? ''}
                </h4>
                <p className='font-sans text-sm' dir='ltr'>
                  {formatCurrencyNumbers(
                    item?.cost,
                    t('currency'),
                    locale
                  )}
                </p>
                <p className='font-sans text-sm'>{item?.quantity}</p>
                <p className='font-sans text-sm'>
                  {formatCurrencyNumbers(
                    item?.total_cost,
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
            {formatCurrencyNumbers(
              calculateSubTotalCartCost(),
              t('currency'),
              locale
            )}
          </p>
        </div>

        <div className='mt-3 flex flex-wrap items-center justify-between font-sans text-sm'>
          <span>{t('shippingTitle')}</span>
          <span
            className={
              applyFreeShipping && deliveryCost ? 'line-through' : ''
            }
          >
            {deliveryCost ?
              formatCurrencyNumbers(
                deliveryCost,
                t('currency'),
                locale
              )
            : <p>{t('selectGovernorateForShippingCosts')}</p>}
          </span>
          {applyFreeShipping && deliveryCost && (
            <div className='mt-1 flex basis-full items-end justify-end gap-2'>
              <IoIosPricetag />
              <p className='text-sm font-normal'>
                {t('freeShippingMessage')}
              </p>
            </div>
          )}
        </div>

        <div className='mt-3 flex items-center justify-between font-sans'>
          <span>{t('totalTitle')}</span>
          {deliveryCost ?
            <span className='text-base font-semibold'>
              {formatCurrencyNumbers(
                calculateSubTotalCartCost() + deliveryCost,
                t('currency'),
                locale
              )}
            </span>
          : <span className='text-sm font-normal'>
              {t('selectGovernorateForTotalOrder')}
            </span>
          }
        </div>
      </div>
    </ConfigProvider>
  );
}

export default CheckoutCart;
