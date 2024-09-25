'use client';

import { useMyContext } from '@/context/Store';
import Btn from '../UI/Btn';
import { FaPlus } from 'react-icons/fa6';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Spin } from 'antd';
import {
  HiOutlineShoppingCart,
  HiShoppingCart
} from 'react-icons/hi';

function AddToCartButton() {
  const t = useTranslations('ProductPage');
  const [clicked, setClicked] = useState(true);
  const { setOpenDrawer, openDrawer, setDrawerIsLoading } =
    useMyContext();
  const showLoading = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation(); // Prevent Link from triggering
    event.preventDefault(); // Prevent default link behavior (if necessary).
    setClicked((prev) => !prev);

    if (clicked) {
      setOpenDrawer(true);
      setDrawerIsLoading(true);

      // Simple loading mock. You should add cleanup logic in real world.
      setTimeout(() => {
        setDrawerIsLoading(false);
      }, 2000);
    } else {
      setOpenDrawer(false);
      setDrawerIsLoading(false);
    }
  };

  return (
    <Btn
      className='flex items-center gap-2 bg-green-600 px-2 py-[6px] font-sans text-sm font-semibold text-white shadow-none'
      onClick={showLoading}
      dir='ltr'
    >
      {clicked ?
        <>
          <HiShoppingCart size={18} />
          <span>{t('addedToCartButtonText')}</span>
        </>
      : <>
          {openDrawer ?
            <Spin className='white' />
          : <HiOutlineShoppingCart size={18} />}

          <span>{t('addToCartButtonText')}</span>
        </>
      }
    </Btn>
  );
}

export default AddToCartButton;
