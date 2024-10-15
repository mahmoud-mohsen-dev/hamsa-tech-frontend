import { CartDataType } from '@/types/cartResponseTypes';
import Image from 'next/image';
import CartInputNumber from './CartInputNumber';
// import { useMyContext } from '@/context/Store';
import { useState } from 'react';
// import Loading from '@/app/[locale]/loading';
import { Button, Spin } from 'antd';
import { useMyContext } from '@/context/Store';

function ProductItem({ productData }: { productData: CartDataType }) {
  const { updateCartItemQuantity, drawerIsLoading } = useMyContext();
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
        className='object-contain'
      />
      <div>
        <h3 className='mb-3'>{attributes?.name ?? ''}</h3>
        <CartInputNumber
          productId={productData?.product?.data?.id ?? ''}
          setIsDataLoading={setIsDataLoading}
          // salePrice={
          //   productData?.product?.data?.attributes?.sale_price
          // }
          // price={productData?.product?.data?.attributes?.price}
          maxValue={
            productData?.product?.data?.attributes?.stock ?? 1
          }
        />
        <Button
          type='link'
          className='opacity-60 transition-opacity duration-300 hover:opacity-100'
          style={{ cursor: 'pointer' }}
          onClick={() => {
            updateCartItemQuantity(
              productData?.product?.data?.id,
              0,
              setIsDataLoading
            );
          }}
          disabled={drawerIsLoading}
        >
          <Image
            src='/icons/bin.svg'
            alt='delete icon'
            width={20}
            height={20}
            quality={100}
          />
        </Button>
      </div>
      <div>
        {isDataLoading ?
          <Spin
            style={{ display: 'flex', justifyContent: 'center' }}
          />
        : <>
            <h2 className='font-inter text-xs font-semibold text-blue-gray-light'>
              {productData?.quantity} &#215;{' '}
              {
                productData?.product?.data?.attributes
                  ?.final_product_price
              }{' '}
              EGP
            </h2>
            <h2 className='mt-1 font-inter text-base font-medium text-black-light'>
              = {productData?.total_cost}
            </h2>
          </>
        }
      </div>
    </li>
  );
}

export default ProductItem;
