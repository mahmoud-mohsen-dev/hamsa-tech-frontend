'use client';

import { useMyContext } from '@/context/Store';
import { Button, Drawer, Progress } from 'antd';
import { BsBoxSeam } from 'react-icons/bs';
import { useTranslations } from 'use-intl';
import AppProgress from './Progress';
import ProductItem from './ProductItem';
import { Link } from '@/navigation';
import { useState } from 'react';
import { HiOutlineShoppingCart } from 'react-icons/hi';
import { FaSlidersH } from 'react-icons/fa';

function AppDrawer() {
  const { openDrawer, setOpenDrawer, cart, calculateTotalCartCost } =
    useMyContext();

  const t = useTranslations('CartDrawer');

  return (
    <Drawer
      closable
      destroyOnClose
      title={cart.length > 0 ? <p>{t('title')}</p> : ''}
      width={500}
      className={`reverse`}
      placement='right'
      open={openDrawer}
      // loading={drawerIsLoading}
      styles={
        cart.length > 0 ?
          {}
        : { header: { borderBottomColor: 'transparent' } }
      }
      onClose={() => setOpenDrawer(false)}
    >
      {
        cart.length > 0 ?
          <div
            // dir='ltr'
            className='grid h-full grid-cols-1 grid-rows-[40px_1fr_140px] gap-4'
          >
            {/* Progress bar */}
            <AppProgress totalCartCosts={calculateTotalCartCost()} />
            {/* Products Items */}
            <ul className='flex flex-col gap-3 overflow-hidden overflow-y-auto'>
              {cart.length > 0 &&
                cart.map((productItem) => {
                  return (
                    <ProductItem
                      key={productItem.id}
                      productData={productItem}
                    />
                  );
                })}
            </ul>

            <div>
              <div>
                <div className='flex items-center justify-between font-inter text-2xl font-bold'>
                  <h3>{t('subTotal')}</h3>
                  <h3>{calculateTotalCartCost()} EGP</h3>
                </div>
                <h6 className='mb-4 mt-1 font-inter text-sm'>
                  {t('taxesMessage')}
                </h6>
              </div>
              <Link
                href={'/checkout'}
                className='font-base block w-full border-none bg-yellow-medium py-5 text-center font-inter font-semibold text-black-medium hover:bg-opacity-85 hover:text-black-medium focus:ring-1 focus:ring-offset-1 focus:ring-offset-yellow-medium'
              >
                Checkout
              </Link>
            </div>
          </div>
          // When Cart is Empty
        : <div className='flex h-full flex-col items-center justify-center gap-5 pb-20'>
            <HiOutlineShoppingCart
              size={60}
              className='text-gray-light'
            />
            <h1 className='font-inter text-3xl font-semibold'>
              {t('emptyCartMessage')}
            </h1>
            <Link
              href={'/products'}
              onClick={() => {
                setOpenDrawer(false);
              }}
              className='font-base block w-fit rounded border-none bg-yellow-medium px-5 py-3 text-center font-inter font-semibold text-black-medium hover:bg-opacity-85 hover:text-black-medium focus:ring-1 focus:ring-offset-1 focus:ring-offset-yellow-medium'
            >
              {t('continueShoppingMessage')}
            </Link>
            <h2 className='text-2xl font-semibold'>
              {t('haveAnAccountMessage')}
            </h2>
            <div className='font-base flex gap-2'>
              <Link
                href={'/login'}
                onClick={() => {
                  setOpenDrawer(false);
                }}
                className='font-inter font-semibold text-blue-sky-normal underline hover:text-blue-sky-light hover:underline'
              >
                {t('loginMessage')}
              </Link>
              <span>{t('toCheckOutMessage')}</span>
            </div>
          </div>

      }
    </Drawer>
  );
}

export default AppDrawer;
