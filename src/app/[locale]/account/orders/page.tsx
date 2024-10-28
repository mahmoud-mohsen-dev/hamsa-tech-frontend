'use client';

import { Link, usePathname, useRouter } from '@/navigation';
import { getOrdersAuthenticated } from '@/services/orders';
import {
  OrderDataType,
  PaginationMeta
} from '@/types/orderResponseTypes';
import { getIdFromToken, removeCookie } from '@/utils/cookieUtils';
import { convertIsoStringToDateFormat } from '@/utils/dateHelpers';
import { formatCurrencyNumbers } from '@/utils/numbersFormating';
import { Button, Divider, Table } from 'antd';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { capitalize } from '@/utils/helpers';
import { ColumnType } from 'antd/es/table';
import { RiShoppingBag3Fill } from 'react-icons/ri';
import { GoGear } from 'react-icons/go';
import { FaMapLocationDot } from 'react-icons/fa6';
import { LuLogOut } from 'react-icons/lu';
import { GrMapLocation } from 'react-icons/gr';
import { useUser } from '@/context/UserContext';
import SubNavLink from '@/components/account/SubNavLink';
// import { unstable_setRequestLocale } from 'next-intl/server';

type DataSource = {
  key: string;
  id: string;
  createdAt: string;
  delivery_status: string;
  payment_status: string;
  payment_method: string;
  total_order_cost: number;
};

function OrdersPage({ params }: { params: { locale: string } }) {
  const [loading, setIsloading] = useState(true);
  const [orders, setOrders] = useState<{
    data: OrderDataType[];
    meta: {
      pagination: PaginationMeta;
    };
  } | null>(null);
  const { setUserId } = useUser();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const pageParams = searchParams.get('page');

  useEffect(() => {
    if (!pageParams) {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set('page', '1');
      router.replace(pathname + '?' + newParams.toString());
      return;
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userId = getIdFromToken();
      setIsloading(true);
      getOrdersAuthenticated(Number(pageParams) ?? 1, userId ?? '')
        .then((data) => {
          // console.log('order data client', data);
          setOrders(data);
        })
        .finally(() => {
          setIsloading(false);
        });
    }
  }, [searchParams, pageParams, pathname, router]);

  // Define color mapping for delivery status
  const paymentStatusColors: Record<string, string> = {
    pending: '#ffbf00', // Amber
    paid_off: '#4CAF50', // Green
    failed: '#F44336', // Red
    refunded: '#2196F3' // Blue
  };

  // Define color mapping for delivery status
  const deliveryStatusColors: Record<string, string> = {
    pending: '#ffbf00', // Amber
    confirmed: '#8BC34A', // Green
    shipped: '#2196F3', // Blue
    delivered: '#4CAF50', // Light Green
    cancelled: '#F44336', // Red
    returned: '#FF5722' // Deep Orange
  };

  // Define color mapping for payment method
  const paymentColors: Record<string, string> = {
    card: '#4CAF50', // Green
    cash_on_delivery: '#2196F3' // Amber
  };

  // Table columns configuration for Ant Design
  const columns: ColumnType<DataSource>[] = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      render: (text: string, record: DataSource) => (
        <Link href={`/account/orders/${record.id}`}>
          #{record.id}
        </Link>
      )
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: string) =>
        convertIsoStringToDateFormat(createdAt ?? '')
    },
    {
      title: 'Delivery Status',
      dataIndex: 'delivery_status',
      key: 'delivery_status',
      render: (status: string) => (
        <span
          style={{
            color: deliveryStatusColors[status] || 'black'
          }}
        >
          {capitalize(status)}
        </span>
      )
    },
    {
      title: 'Payment Status',
      dataIndex: 'payment_status',
      key: 'payment_status',
      render: (status) => (
        <span
          style={{
            color: paymentStatusColors[status] || 'black'
          }}
        >
          {capitalize(status)}
        </span>
      )
    },
    {
      title: 'Payment Method',
      dataIndex: 'payment_method',
      key: 'payment_method',
      render: (status: string) => (
        <span
          style={{
            color: paymentColors[status] || 'black'
          }}
        >
          {capitalize(status)}
        </span>
      )
    },
    {
      title: 'Total Order Cost',
      dataIndex: 'total_order_cost',
      key: 'total_order_cost',
      render: (total_order_cost: number) =>
        formatCurrencyNumbers(
          total_order_cost ?? 0,
          'EGP',
          params.locale
        )
    }
  ];

  // Data mapping to be used in the table
  const dataSource: DataSource[] =
    orders?.data.map((order) => ({
      key: order.id,
      id: order.id,
      createdAt: order?.attributes?.createdAt ?? '',
      delivery_status: order?.attributes?.delivery_status ?? '',
      payment_status: order?.attributes?.payment_status ?? '',
      payment_method: order?.attributes?.payment_method ?? '',
      total_order_cost: order?.attributes?.total_order_cost ?? 0
    })) ?? [];

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
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        pagination={{
          total: orders?.meta?.pagination?.total ?? 0,
          pageSize: orders?.meta?.pagination?.pageSize ?? 10,
          current: Number(pageParams) > 0 ? Number(pageParams) : 1,
          onChange: (page) => {
            const newParams = new URLSearchParams(
              searchParams.toString()
            );
            newParams.set('page', page.toString());
            router.replace(pathname + '?' + newParams.toString());
          },
          style: {
            marginBottom: 0
          }
        }}
        rowKey='id'
        onRow={(record) => ({
          onClick: () => {
            router.push(`/account/orders/${record.id}`);
          }
        })}
        style={{ width: '100%' }}
        rowClassName='row-link'
      />
    </div>
  );
}

export default OrdersPage;
