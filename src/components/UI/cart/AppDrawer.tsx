'use client';

import { useMyContext } from '@/context/Store';
import { Button, Drawer, Progress } from 'antd';
import { BsBoxSeam } from 'react-icons/bs';
import { useTranslations } from 'use-intl';
import AppProgress from './Progress';
import ProductItem from './ProductItem';
import { Link } from '@/navigation';

function AppDrawer() {
  const { openDrawer, drawerIsLoading, setOpenDrawer, cart } =
    useMyContext();

  const t = useTranslations('cart');

  return (
    <Drawer
      closable
      destroyOnClose
      title={<p>{t('title')}</p>}
      width={500}
      className={`reverse`}
      placement='right'
      open={openDrawer}
      loading={drawerIsLoading}
      onClose={() => setOpenDrawer(false)}
    >
      {/* <Button
          type='primary'
          style={{ marginBottom: 16 }}
          onClick={showLoading}
        >
          Reload
        </Button> */}
      <div
        dir='ltr'
        className='grid h-full grid-cols-1 grid-rows-[1fr_120px] gap-4'
      >
        <div className='h-full overflow-hidden'>
          {/* Progress bar */}
          <AppProgress />
          {/* Products Items */}
          <form className='mt-5 flex h-full flex-col gap-3 overflow-y-auto pb-16'>
            {cart.length > 0 &&
              cart.map((productItem) => {
                return (
                  <ProductItem
                    key={productItem.id}
                    productData={productItem}
                  />
                );
              })}
          </form>
        </div>

        <div className=''>
          <div>
            <div className='flex items-center justify-between font-inter text-2xl font-bold'>
              <h3>Subtotal</h3>
              <h3>
                {cart.reduce((acc, cur) => {
                  if (
                    cur?.product?.data?.attributes?.sale_price > 0
                  ) {
                    return (acc +=
                      cur.product.data.attributes.sale_price *
                      cur.quantity);
                  } else {
                    return (acc +=
                      cur?.product?.data?.attributes?.price *
                        cur.quantity || 0);
                  }
                }, 0)}{' '}
                EGP
              </h3>
            </div>
            <h6 className='mb-3 font-inter text-xs'>
              Taxes and shipping calculated at checkout
            </h6>
          </div>
          <Link
            href={'/checkout'}
            className='checkoutBtnDrawer font-base block w-full border-none bg-yellow-medium py-5 text-center font-inter font-semibold text-black-medium hover:bg-opacity-85 focus:ring-1 focus:ring-offset-1 focus:ring-offset-yellow-medium'
          >
            Checkout
          </Link>
        </div>
      </div>
    </Drawer>
  );
}

export default AppDrawer;
