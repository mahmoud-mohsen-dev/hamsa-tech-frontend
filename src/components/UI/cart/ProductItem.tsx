import { CartDataType } from '@/types/cartResponseTypes';
import Image from 'next/image';
import CartInputNumber from './CartInputNumber';
import { useMyContext } from '@/context/Store';
import { useState } from 'react';
import Loading from '@/app/[locale]/loading';
import { Spin } from 'antd';

function ProductItem({ productData }: { productData: CartDataType }) {
  const [isDataLoading, setIsDataLoading] = useState(false);
  const { attributes } = productData?.product?.data ?? {};

  return (
    <li className='grid grid-cols-[110px_1fr_90px] grid-rows-1 items-center gap-3'>
      {/* <div className='flex h-full items-center gap-7'> */}
      <Image
        src={attributes?.image_thumbnail?.data?.attributes?.url ?? ''}
        alt={
          attributes?.image_thumbnail?.data?.attributes
            ?.alternativeText ?? ''
        }
        width={105}
        height={125}
        quality={100}
        objectFit='contain'
      />
      <div>
        <h3 className='mb-3'>{attributes?.name ?? ''}</h3>
        <CartInputNumber
          productId={productData?.product?.data?.id ?? ''}
          setIsDataLoading={setIsDataLoading}
          maxValue={
            productData?.product?.data?.attributes?.stock ?? 1
          }
        />
      </div>
      <div>
        {isDataLoading ?
          <Spin
            style={{ display: 'flex', justifyContent: 'center' }}
          />
        : <>
            <h2 className='font-inter text-xs font-semibold text-blue-gray-light'>
              {productData?.quantity} &#215;{' '}
              {productData?.product?.data?.attributes?.sale_price ?
                productData?.product?.data?.attributes?.sale_price
              : productData?.product?.data?.attributes?.price || 0
              }{' '}
              EGP
            </h2>
            <h2 className='mt-1 font-inter text-base font-medium text-black-light'>
              ={' '}
              {(
                typeof attributes?.sale_price === 'number' &&
                attributes?.sale_price > 0
              ) ?
                Number(
                  attributes.sale_price * (productData?.quantity || 1)
                )
              : Number(
                  (attributes?.price || 0) *
                    (productData?.quantity || 1)
                )
              }
            </h2>
          </>
        }
      </div>
    </li>
  );
}

export default ProductItem;
