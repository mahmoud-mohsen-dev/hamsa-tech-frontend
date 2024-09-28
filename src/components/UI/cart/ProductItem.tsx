import { CartDataType } from '@/types/cartResponseTypes';
import Image from 'next/image';
import CartInputNumber from './CartInputNumber';
import { useMyContext } from '@/context/Store';

function ProductItem({ productData }: { productData: CartDataType }) {
  const { attributes } = productData?.product?.data;

  return (
    <li className='flex items-center justify-between gap-5'>
      <div className='flex h-full items-center gap-7'>
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
          objectFit='contain'
        />
        <div>
          <h3 className='mb-3'>{attributes?.name ?? ''}</h3>
          <CartInputNumber
            productId={productData?.product?.data?.id}
          />
        </div>
      </div>
      <div>
        <h2
          className={`${attributes?.sale_price > 0 ? 'text-base font-normal text-gray-light line-through' : 'text-lg font-medium text-black-light'} font-inter`}
        >
          {attributes?.price}
        </h2>
        {attributes?.sale_price > 0 && (
          <h2 className='font-inter text-lg font-medium text-black-light'>
            {attributes?.sale_price}
          </h2>
        )}
      </div>
    </li>
  );
}

export default ProductItem;
