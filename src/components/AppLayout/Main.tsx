'use client';

import { useMyContext } from '@/context/Store';
import { usePathname } from '@/navigation';
import { getFreeShippingData } from '@/services/getFreeShippingData';
import { useEffect } from 'react';

function Main({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { setFreeShippingAt } = useMyContext();
  // console.log(pathname);
  // console.log(pathname === '/ar');

  useEffect(() => {
    const getFreeShippingFunc = async () => {
      const freeShippingData = await getFreeShippingData();
      if (
        freeShippingData &&
        typeof freeShippingData === 'object' &&
        freeShippingData.apply_free_shipping_if_total_cart_cost_equals &&
        freeShippingData.enable
      ) {
        setFreeShippingAt(freeShippingData);
      }
    };

    getFreeShippingFunc();
  }, []);

  return (
    <main
      className={`w-full ${pathname === '/ar' || pathname === '/en' || pathname === '/' ? '' : 'pt-[48px] md:pt-[64px]'}`}
    >
      {children}
    </main>
  );
}

export default Main;
