'use client';

import { useMyContext } from '@/context/Store';
import Image from 'next/image';
import { formatCurrencyNumbers } from '@/utils/numbersFormating';
import {
  Button,
  ConfigProvider,
  Divider,
  Form,
  Input,
  message
} from 'antd';
import { useLocale, useTranslations } from 'next-intl';
// import { IoIosPricetag } from 'react-icons/io';
import { fetchGraphqlClient } from '@/services/graphqlCrud';
import { GetCouponResponseType } from '@/types/getCouponResponseType';
import { generateISODateForGraphQL } from '@/utils/dateHelpers';
import { useState } from 'react';
import { FaTags } from 'react-icons/fa';
import { RiDiscountPercentLine } from 'react-icons/ri';
import { FaDeleteLeft, FaTag } from 'react-icons/fa6';

const getCouponQuery = (name: string): string => {
  return `{
    offers(
      filters: {
        coupon_code: { eq: "${name}" }
        expiration_date: { gte: "${generateISODateForGraphQL()}" }
        start_date: { lte: "${generateISODateForGraphQL()}" }
      }
      sort: "createdAt:desc"
    ) {
        data {
            id
            attributes {
                coupon_code
                expiration_date
                start_date
                deduction_value
                deduction_value_by_percent
            }
        }
    }
  }`;
};

function CheckoutCart() {
  const {
    cart,
    calculateTotalCartItems,
    calculateSubTotalCartCost,
    couponData,
    setCouponData,
    calculateDeliveryCost,
    isApplyFreeShippingEnabled,
    calculateCouponDeductionValue,
    calculateTotalOrderCost
  } = useMyContext();
  const [messageApi, contextHolder] = message.useMessage();
  const [couponLoading, setCouponLoading] = useState(false);

  const t = useTranslations('CheckoutPage.content');
  const locale = useLocale();
  const totalCartQuantities = calculateTotalCartItems();

  const subTotalCost = calculateSubTotalCartCost();

  const deliveryCost = calculateDeliveryCost();
  const checkIfApplyFreeShippingEnabled =
    isApplyFreeShippingEnabled();

  const couponDeductionValue = calculateCouponDeductionValue();
  const totalOrderCost = calculateTotalOrderCost();

  const onFormFinished = async (values: { coupon: string }) => {
    try {
      console.log(values.coupon);
      setCouponLoading(true);
      const { data, error } = (await fetchGraphqlClient(
        getCouponQuery(values.coupon)
      )) as GetCouponResponseType;

      if (error || !data) {
        messageApi.error(t('couponCode.couponNotValid'));
      } else {
        const couponData = data?.offers?.data[0];
        if (
          (typeof couponData?.attributes?.deduction_value ===
            'number' &&
            couponData?.attributes?.deduction_value > 0 &&
            subTotalCost > couponData.attributes.deduction_value) ||
          (typeof couponData?.attributes
            ?.deduction_value_by_percent === 'number' &&
            couponData?.attributes?.deduction_value > 0 &&
            subTotalCost >
              calculateCouponDeductionValue(
                null,
                couponData.attributes.deduction_value_by_percent
              ))
        ) {
          setCouponData(couponData);
        } else {
          messageApi.error(
            t(
              'couponCode.subtotalCartCostMustBeGreaterThanCouponValue'
            )
          );
        }
      }
    } catch (e: any) {
      messageApi.error(t('couponCode.couponNotValid'));
    } finally {
      setCouponLoading(false);
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 4
        }
      }}
    >
      {contextHolder}
      <div className='px-2 py-5 2xl:px-10'>
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
                className='flex flex-wrap items-center justify-between gap-2 xs:flex-nowrap'
              >
                <div className='grid w-full grid-cols-[54px_1fr] items-center gap-2'>
                  <div className='overflow-hidden rounded border border-solid border-gray-light'>
                    <Image
                      src={
                        item?.product?.data?.attributes
                          ?.image_thumbnail?.data?.attributes?.url ??
                        ''
                      }
                      alt={
                        item?.product?.data?.attributes
                          ?.image_thumbnail?.data?.attributes
                          ?.alternativeText ?? ''
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
                </div>
                <div className='grid w-full grid-cols-3 grid-rows-1 justify-end gap-2 xs:grid-cols-[75px_20px_85px]'>
                  <p className='font-sans text-sm' dir='ltr'>
                    {formatCurrencyNumbers(
                      item?.cost,
                      t('currency'),
                      locale
                    )}
                  </p>
                  <p className='font-sans text-sm'>
                    {item?.quantity}
                  </p>
                  <p className='font-sans text-sm'>
                    {formatCurrencyNumbers(
                      item?.total_cost,
                      t('currency'),
                      locale
                    )}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>

        <Form
          name='couponForm'
          onFinish={onFormFinished}
          style={{
            marginTop: '16px',
            display: 'flex',
            gap: '10px',
            justifyContent: 'center'
          }}
        >
          <Form.Item
            name='coupon'
            // rules={[
            //   {
            //     required: true,
            //     message: t(
            //       'formValidationErrorMessages.couponCodeRequired'
            //     )
            //   }
            // ]}
            style={{ flexBasis: '100%', marginBottom: '0px' }}
          >
            <Input
              type='text'
              placeholder={t('couponPlaceholder')}
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
            loading={couponLoading}
            style={{
              // borderRadius: '5px',
              fontSize: '14px',
              width: '110px',
              height: '46px'
            }}
          >
            {t('applyButtonText')}
          </Button>
        </Form>

        <div
          className={`mt-4 flex items-center justify-between font-sans text-sm`}
        >
          <div>
            <span>{t('subtotalTitle')} • </span>
            <span>
              {totalCartQuantities === 1 ?
                `${totalCartQuantities} ${t('itemTitle')}`
              : `${totalCartQuantities} ${t('itemsTitle')}`}
            </span>
          </div>
          {/* <div className='flex gap-1'> */}
          <p
          // className={`${couponDeductionValue > 0 ? 'line-through' : ''}`}
          >
            {formatCurrencyNumbers(
              subTotalCost,
              t('currency'),
              locale
            )}
          </p>

          {/* {couponDeductionValue > 0 && (
              <>
                <Divider
                  type='vertical'
                  style={{ minHeight: '20px' }}
                  className='bg-gray-400'
                />
                <p>
                  {formatCurrencyNumbers(
                    subTotalCost - couponDeductionValue,
                    t('currency'),
                    locale
                  )}
                </p>
              </>
            )} */}
          {/* </div> */}
        </div>

        {couponDeductionValue > 0 && (
          <div className='mt-1.5 flex basis-full items-start justify-between font-sans text-sm'>
            <div>
              <span>{t('discount')}</span>
              <div
                className={`${locale === 'ar' ? 'pr-[15px]' : 'pl-[15px]'} mt-1.5 flex items-center rounded-md bg-[rgba(0,0,0,.06)] text-xs`}
              >
                <RiDiscountPercentLine size={14} />
                <span className={locale === 'ar' ? 'mr-3' : 'ml-3'}>
                  {couponData?.attributes.coupon_code}
                </span>
                <Button
                  type='link'
                  onClick={() => {
                    // remove coupon
                    setCouponData(null);
                  }}
                >
                  <FaDeleteLeft />
                </Button>
              </div>
            </div>
            <span>
              -{' '}
              {formatCurrencyNumbers(
                couponDeductionValue,
                t('currency'),
                locale
              )}
            </span>
          </div>
        )}

        <div className='mt-1.5 flex flex-wrap items-center justify-between font-sans text-sm'>
          <span>{t('shippingTitle')}</span>
          <span
            className={
              checkIfApplyFreeShippingEnabled && deliveryCost ?
                'line-through'
              : ''
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
          {checkIfApplyFreeShippingEnabled && deliveryCost && (
            <div className='mt-1 flex basis-full items-center justify-end gap-2'>
              <FaTag className='-scale-x-100' size={14} />
              <p className='text-sm font-normal'>
                {t('freeShippingMessage')}
              </p>
            </div>
          )}
        </div>

        <Divider
          className='bg-gray-light'
          style={{ marginBlock: '16px' }}
        />

        <div className='mt-3 flex items-center justify-between font-sans'>
          <span className='text-base font-semibold'>
            {t('totalTitle')}
          </span>
          {deliveryCost ?
            <span className='text-base font-semibold'>
              {formatCurrencyNumbers(
                totalOrderCost,
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
