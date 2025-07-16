import { CartDataType } from '@/types/cartResponseTypes';
import Image from 'next/image';
import CartInputNumber from './CartInputNumber';
// import { useMyContext } from '@/context/Store';
import { useState } from 'react';
// import Loading from '@/app/[locale]/loading';
import { Button, Spin } from 'antd';
import { useMyContext } from '@/context/Store';
import { Link } from '@/navigation';

function ProductItem({
  productData,
  onClose
}: {
  productData: CartDataType;
  onClose: () => void;
}) {
  const { updateCartItemQuantity, drawerIsLoading } = useMyContext();
  const [isDataLoading, setIsDataLoading] = useState(false);
  const { attributes } = productData?.product?.data ?? {};

  // console.log('productData in ProductItems.tsx file:');
  // console.log(productData);

  const productInfo = {
    id: productData?.product?.data?.id ?? null,
    stock: productData?.product?.data?.attributes?.stock ?? null,
    final_product_price:
      productData?.product?.data?.attributes?.final_product_price ??
      null
    // finalPackageWeight:
    //   productData?.product?.data?.attributes
    //     ?.final_package_weight_in_grams ?? null
  };

  return (
    <li className='grid grid-cols-[110px_1fr_90px] grid-rows-1 items-center gap-3'>
      {/* <div className='flex h-full items-center gap-7'> */}
      <Link
        href={
          productData?.product?.data?.id ?
            `/products/${productData.product.data.id}`
          : '/products'
        }
        onClick={onClose}
      >
        <Image
          src={
            attributes?.image_thumbnail?.data?.attributes?.url ?? ''
          }
          alt={
            attributes?.image_thumbnail?.data?.attributes
              ?.alternativeText ?? ''
          }
          width={105}
          height={125}
          quality={100}
          className='object-contain'
        />
      </Link>
      <div>
        <Link
          href={
            productData?.product?.data?.id ?
              `/products/${productData.product.data.id}`
            : '/products'
          }
          onClick={onClose}
          className='mb-3 block text-black-light hover:cursor-pointer hover:text-blue-sky-normal hover:underline'
        >
          {attributes?.name ?? ''}
        </Link>
        <CartInputNumber
          productInfo={productInfo}
          setIsDataLoading={setIsDataLoading}
          // salePrice={
          //   productData?.product?.data?.attributes?.sale_price
          // }
          // price={productData?.product?.data?.attributes?.price}
          minValue={
            productData?.product?.data?.attributes?.stock > 0 ? 1 : 0
          }
          maxValue={
            productData?.product?.data?.attributes?.stock ?? 1
          }
        />
        <Button
          type='link'
          className='opacity-60 transition-opacity duration-300 hover:opacity-100'
          style={{ cursor: 'pointer' }}
          onClick={() => {
            updateCartItemQuantity({
              productInfo,
              quantity: 0,
              setComponentLoader: setIsDataLoading
            });
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
              }
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
