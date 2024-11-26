'use client';

import { useMyContext } from '@/context/Store';
import { Drawer } from 'antd';
import { useTranslations } from 'use-intl';
import AppProgress from './Progress';
import ProductItem from './ProductItem';
import { Link } from '@/navigation';
import { HiOutlineShoppingCart } from 'react-icons/hi';
import { useLocale } from 'next-intl';

function AppDrawer() {
  const {
    openDrawer,
    setOpenDrawer,
    cart,
    calculateSubTotalCartCost,
    freeShippingAt
  } = useMyContext();

  const t = useTranslations('CartDrawer');
  const locale = useLocale();

  return (
    <Drawer
      closable
      destroyOnClose
      title={cart.length > 0 ? <p>{t('title')}</p> : ''}
      width={500}
      className={`reverse`}
      placement={locale === 'ar' ? 'left' : 'right'}
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
            className={`grid h-full grid-cols-1 ${freeShippingAt?.apply_free_shipping_if_total_cart_cost_equals && freeShippingAt.enable ? 'grid-rows-[40px_1fr_140px]' : 'grid-rows-[1fr_140px]'} gap-4`}
          >
            {/* Progress bar */}
            <AppProgress
              totalCartCosts={calculateSubTotalCartCost()}
              freeShippingAt={freeShippingAt}
            />
            {/* Products Items */}
            <ul className='flex flex-col gap-3 overflow-hidden overflow-y-auto'>
              {cart.length > 0 &&
                cart.map((productItem) => {
                  return (
                    <ProductItem
                      key={productItem.id}
                      productData={productItem}
                      onClose={() => setOpenDrawer(false)}
                    />
                  );
                })}
            </ul>

            <div>
              <div>
                <div className='flex items-center justify-between font-inter text-2xl font-bold'>
                  <h3>{t('subTotal')}</h3>
                  <h3>{calculateSubTotalCartCost()} EGP</h3>
                </div>
                <h6 className='mb-4 mt-1 font-inter text-sm'>
                  {t('taxesMessage')}
                </h6>
              </div>
              <Link
                href={'/checkout'}
                onClick={() => {
                  setOpenDrawer(false);
                }}
                className='font-base block w-full border-none bg-yellow-medium py-5 text-center font-inter font-semibold text-black-medium hover:bg-opacity-85 hover:text-black-medium focus:outline-none focus:ring-2 focus:ring-yellow-medium focus:ring-offset-2'
              >
                {t('checkoutMessage')}
              </Link>
            </div>
          </div>
          // When Cart is Empty
        : <div className='flex h-full flex-col items-center justify-center gap-5 pb-20'>
            <HiOutlineShoppingCart
              size={60}
              className='text-gray-medium'
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
