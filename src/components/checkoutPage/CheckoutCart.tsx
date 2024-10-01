'use client';

import { useMyContext } from '@/context/Store';
import Image from 'next/image';
import { convertToArabicNumeralsWithFormatting } from '@/utils/numbersFormating';
import { Button, Form, Input } from 'antd';
import { useTranslations } from 'next-intl';

function CheckoutCart() {
  const {
    cart,
    calculateTotalCartItems,
    calculateSubTotalCartCost,
    shippingCost
  } = useMyContext();
  const t = useTranslations('CheckoutPage.content');
  const totalCartQuantities = calculateTotalCartItems();
  const totalCartCost = calculateSubTotalCartCost() + shippingCost;

  return (
    <div className='px-10 py-5'>
      <ul className='flex flex-col gap-2'>
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
              item?.product?.data?.attributes?.price * item?.quantity;
          }

          return (
            <li key={item.id} className='flex items-center gap-3'>
              <Image
                src={
                  item?.product?.data?.attributes?.image_thumbnail
                    ?.data?.attributes?.url ?? ''
                }
                alt={
                  item?.product?.data?.attributes?.image_thumbnail
                    ?.data?.attributes?.alternativeText ?? ''
                }
                width={64}
                height={64}
                quality={100}
              />
              <h4 className=''>
                {item?.product?.data?.attributes?.name ?? ''}
              </h4>
              <p>
                {convertToArabicNumeralsWithFormatting(cost, 'E£')}
              </p>
            </li>
          );
        })}
      </ul>

      <Form name='couponForm'>
        <Form.Item name='coupon'>
          <Input type='text' placeholder='Discount code' />
        </Form.Item>
        <Button type='default' htmlType='submit'>
          Apply
        </Button>
      </Form>

      <div>
        <div>
          <div>
            <span>{t('subtotalTitle')} •</span>
            <span>
              {totalCartQuantities === 1 ?
                `${totalCartQuantities} ${t('itemTitle')}`
              : `${totalCartQuantities} ${t('itemsTitle')}`}
            </span>
          </div>
          <div>
            {convertToArabicNumeralsWithFormatting(
              calculateSubTotalCartCost(),
              'E£'
            )}
          </div>
        </div>
        <div>
          <span>{t('shippingTitle')}</span>
          <span>
            {convertToArabicNumeralsWithFormatting(
              shippingCost,
              'E£'
            )}
          </span>
        </div>
        <div>
          <span>{t('totalTitle')}</span>
          <span>
            {convertToArabicNumeralsWithFormatting(
              totalCartCost,
              'E£'
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

export default CheckoutCart;
