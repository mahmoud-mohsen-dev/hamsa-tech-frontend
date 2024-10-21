'use client';

import { Link, usePathname, useRouter } from '@/navigation';
import { getIdFromToken, removeCookie } from '@/utils/cookieUtils';
import { Button, Divider, Spin } from 'antd';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { RiShoppingBag3Fill } from 'react-icons/ri';
import { GoGear } from 'react-icons/go';
import { LuLogOut } from 'react-icons/lu';
import { GrMapLocation } from 'react-icons/gr';
import SubNavLink from '@/components/account/SubNavLink';
import { useUser } from '@/context/UserContext';

function SettingsPage({ params }: { params: { locale: string } }) {
  const [loading, setIsloading] = useState(true);
  const { setUserId } = useUser();
  //   const [orders, setOrders] = useState<{
  //     data: OrderDataType[];
  //     meta: {
  //       pagination: PaginationMeta;
  //     };
  //   } | null>(null);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userId = getIdFromToken();
      if (userId) {
        setIsloading(false);
      }
      //   getOrdersAuthenticated(Number(pageParams) ?? 1, userId ?? '')
      //     .then((data) => {
      //       setOrders(data);
      //     })
      //     .finally(() => {
      //       setIsloading(false);
      //     });
    }
  }, [searchParams, pathname, router]);

  return (
    <div className='grid min-h-full justify-center lg:grid-cols-[1fr_3fr] 2xl:px-20'>
      <ul className='mx-auto flex h-fit w-[75%] flex-col justify-center gap-3'>
        <li>
          <SubNavLink href={'/account/orders'} page='orders'>
            <RiShoppingBag3Fill />
            <span>Your Orders</span>
          </SubNavLink>
        </li>
        <li>
          <SubNavLink href={'/account/addresses'} page='addresses'>
            <GrMapLocation />
            <span>Addresses</span>
          </SubNavLink>
        </li>
        <li>
          <SubNavLink href={'/account/settings'} page='settings'>
            <GoGear />
            <span>Settings</span>
          </SubNavLink>
        </li>
        <Divider style={{ marginBlock: '10px' }} />
        <li>
          <button
            onClick={() => {
              router.push('/signin');
              removeCookie('token');
              setUserId(null);
            }}
            className='flex w-full flex-wrap items-center gap-4 px-4 py-2 text-black-light transition-colors duration-100 hover:bg-gray-ultralight'
          >
            <LuLogOut />
            <span>Log out</span>
          </button>
        </li>
      </ul>
      {loading ?
        <Spin
          className='grid min-h-full place-content-center'
          size='large'
        />
      : <div>Settings</div>}
    </div>
  );
}

export default SettingsPage;
