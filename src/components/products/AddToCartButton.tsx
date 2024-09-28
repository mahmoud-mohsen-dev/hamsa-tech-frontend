'use client';

import { useMyContext } from '@/context/Store';
import Btn from '../UI/Btn';
import { useCallback, useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Spin } from 'antd';
import {
  HiOutlineShoppingCart,
  HiShoppingCart
} from 'react-icons/hi';
import { getCartId } from '@/utils/cookieUtils';
import { fetchGraphqlClient } from '@/services/graphqlCrud';
import {
  CartDataType,
  updateCartResponseType
} from '@/types/cartResponseTypes';
import { updateCartInTheBackend } from '@/utils/cartContextUtils';

interface PropsType {
  productId: string;
}

function AddToCartButton({ productId }: PropsType) {
  const t = useTranslations('ProductPage');
  const locale = useLocale();
  const [isLoading, setIsLoading] = useState(false);
  // console.log(data);

  const { incrementCartItem } = useMyContext();

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation(); // Prevent Link from triggering
    event.preventDefault(); // Prevent default link behavior (if necessary).

    incrementCartItem(productId, setIsLoading);
  };

  return (
    // <Btn className='flex flex-wrap items-center gap-2 bg-green-600 px-2 py-[8px] font-sans text-sm font-semibold text-white shadow-none duration-300 ease-in hover:scale-110'>
    <button
      className={`before:ease relative h-12 ${isLoading ? 'border-green-300 bg-green-300 hover:shadow-green-300' : 'border-green-500 bg-green-500 hover:shadow-green-500'} ${locale === 'ar' ? 'w-[170px]' : 'w-[145px]'} overflow-hidden rounded-md border text-white shadow-[0_5px_25px_-10px_rgb(0,0,0,.1),0_6px_10px_-6px_rgb(0,0,0,.1)] transition-all before:absolute before:-right-[36px] before:top-0 before:h-12 before:w-6 before:bg-white before:opacity-10 before:duration-700 hover:before:right-[calc(100%+36px)] hover:before:-translate-x-full disabled:cursor-not-allowed`}
      onClick={handleClick}
      dir='ltr'
      disabled={isLoading}
    >
      <span className='relative z-10 flex items-center justify-center gap-2'>
        {isLoading ?
          <Spin className='white px-10' />
        : <>
            <HiShoppingCart size={18} />
            <span>{t('addToCartButtonText')}</span>
            {/* <HiOutlineShoppingCart size={18} />
          <span>{t('addToCartButtonText')}</span> */}
          </>
        }
      </span>
    </button>
    // </Btn>
  );
}

export default AddToCartButton;
