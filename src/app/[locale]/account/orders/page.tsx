'use client';

import { Link, usePathname, useRouter } from '@/navigation';
import { getOrdersAuthenticated } from '@/services/orders';
import {
  OrderDataType,
  PaginationMeta
} from '@/types/orderResponseTypes';
import { getIdFromToken } from '@/utils/cookieUtils';
import { convertIsoStringToDateFormat } from '@/utils/dateHelpers';
import { formatCurrencyNumbers } from '@/utils/numbersFormating';
import { Table } from 'antd';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { capitalize } from '@/utils/helpers';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'use-intl';
import { useLocale } from 'next-intl';

type DataSource = {
  key: string;
  id: string;
  createdAt: string;
  delivery_status: string;
  payment_status: string;
  payment_method: string;
  total_order_cost: number;
};

function OrdersPage() {
  const [loading, setIsloading] = useState(true);
  const [orders, setOrders] = useState<{
    data: OrderDataType[];
    meta: {
      pagination: PaginationMeta;
    };
  } | null>(null);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('AccountLayoutPage.OrdersPage');

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
      title: t('content.table.header.orderId'),
      dataIndex: 'id',
      key: 'id',
      render: (text: string, record: DataSource) => (
        <Link href={`/account/orders/${record.id}`}>
          #{record.id}
        </Link>
      )
    },
    {
      title: t('content.table.header.orderDate'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: string) =>
        convertIsoStringToDateFormat(createdAt ?? '')
    },
    {
      title: t('content.table.header.orderDeliveryStatus'),
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
      title: t('content.table.header.orderPaymentStatus'),
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
      title: t('content.table.header.orderPaymentMethod'),
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
      title: t('content.table.header.orderTotalCost'),
      dataIndex: 'total_order_cost',
      key: 'total_order_cost',
      render: (total_order_cost: number) =>
        formatCurrencyNumbers(total_order_cost ?? 0, 'EGP', locale)
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
    <div className='orders-table'>
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
          },
          className: locale === 'ar' ? 'pagination-in-arabic' : ''
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
