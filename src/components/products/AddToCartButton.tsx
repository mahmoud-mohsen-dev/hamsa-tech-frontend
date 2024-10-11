'use client';

import { useMyContext } from '@/context/Store';
import { useLocale, useTranslations } from 'next-intl';
import { Spin } from 'antd';
import { HiShoppingCart } from 'react-icons/hi';

interface PropsType {
  productId: string;
  stock: number;
}

function AddToCartButton({ productId, stock }: PropsType) {
  const t = useTranslations('ProductPage');
  const locale = useLocale();
  // console.log(data);

  const { incrementCartItem, addToCartIsLoading } = useMyContext();
  const isLoading = addToCartIsLoading === productId;

  const handleClick = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation(); // Prevent Link from triggering
    event.preventDefault(); // Prevent default link behavior (if necessary).

    await incrementCartItem(productId); // Call incrementCartItem (assuming it's asynchronous)
  };

  return (
    // <Btn className='flex flex-wrap items-center gap-2 bg-green-600 px-2 py-[8px] font-sans text-sm font-semibold text-white shadow-none duration-300 ease-in hover:scale-110'>
    <button
      className={`before:ease relative h-12 ${isLoading && stock > 0 ? 'border-green-300 bg-green-300 hover:shadow-green-300' : 'border-green-500 bg-green-500 hover:shadow-green-500'} ${locale === 'ar' ? 'w-[155px]' : 'w-[145px]'} overflow-hidden rounded-md border text-base text-white transition-all before:absolute before:-right-[36px] before:top-0 before:h-12 before:w-6 before:bg-white before:opacity-10 before:duration-700 disabled:cursor-not-allowed ${stock > 0 ? 'shadow-[0_5px_25px_-10px_rgb(0,0,0,.1),0_6px_10px_-6px_rgb(0,0,0,.1)] hover:before:right-[calc(100%+36px)] hover:before:-translate-x-full' : 'opacity-60'}`}
      onClick={handleClick}
      dir='ltr'
      disabled={stock <= 0 || addToCartIsLoading ? true : false}
    >
      <span className='relative z-10 flex items-center justify-center gap-2'>
        {isLoading ?
          <Spin className='white px-10' />
        : stock > 0 ?
          <>
            <HiShoppingCart size={18} />
            <span>{t('addToCartButtonText')}</span>
          </>
        : <>
            <span>{t('soldOutButtonText')}</span>
          </>
        }
      </span>
    </button>
    // </Btn>
  );
}

export default AddToCartButton;
