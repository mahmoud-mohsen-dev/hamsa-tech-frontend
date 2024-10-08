'use client';
import React, { useState } from 'react';
import { Table } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import Image from 'next/image';
import Btn from '../UI/Btn';
import { useRouter } from '@/navigation';
import { formatCurrencyNumbers } from '@/utils/numbersFormating';
import { useLocale, useTranslations } from 'next-intl';
import AddToCartButton from '../products/AddToCartButton';
import { useMyContext } from '@/context/Store';

export interface WishlistDataType {
  key: React.Key;
  photo: { url: string; alt: string };
  name: string;
  price: number;
  stock: number;
  productId: string;
}

const onChange: TableProps<WishlistDataType>['onChange'] = (
  pagination,
  filters,
  sorter,
  extra
) => {
  console.log('params', pagination, filters, sorter, extra);
};

function WishlistTable() {
  // const router = useRouter();
  const { dataSource, setDataSource } = useMyContext();
  const locale = useLocale();
  const t = useTranslations('WishlistPage.content.table');

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const columns: TableColumnsType<WishlistDataType> = [
    {
      title: (
        <p className={locale === 'ar' ? 'mr-10' : 'ml-10'}>
          {t('header.photo')}
        </p>
      ),
      dataIndex: 'photo',
      render: (photo) => (
        <Image
          alt={photo.alt}
          src={photo.url}
          // style={{ width: '50px' }}
          width={50}
          height={50}
          className='ml-8 h-[50px] w-[50px]'
        />
      )
    },
    {
      title: t('header.name'),
      dataIndex: 'name',
      showSorterTooltip: { target: 'full-header' },
      filters: [
        {
          text: 'Joe',
          value: 'Joe'
        },
        {
          text: 'Jim',
          value: 'Jim'
        }
      ],
      // specify the condition of filtering result
      // here is that finding the name started with `value`
      onFilter: (value, record) =>
        record.name.indexOf(value as string) === 0,
      sorter: (a, b) => a.name.charCodeAt(0) - b.name.charCodeAt(0),
      render: (value) => (
        <p className='font-medium capitalize'>{value}</p>
      )
      // sortDirections: ['ascend']
    },
    {
      title: t('header.price'),
      dataIndex: 'price',
      align: 'center',
      sorter: (a, b) => a.price - b.price,
      render: (value) => (
        <p className='font-medium text-black-light'>
          {formatCurrencyNumbers(value, t('body.currency'), locale)}
        </p>
      )
    },
    {
      title: t('header.status'),
      dataIndex: 'stock',
      align: 'center',
      // filters: [
      //   {
      //     text: 'In Stock',
      //     value: true
      //   },
      //   {
      //     text: 'Out Of Stock',
      //     value: false
      //   }
      // ],
      // onFilter: (_, record) => record.stock  > 0,
      sorter: (a, b) => a.stock - b.stock,
      render: (value) => (
        <p
          className={`font-medium capitalize ${value > 0 ? 'text-green-dark' : 'text-red-shade-350'}`}
        >
          {value > 0 ? t('body.inStock') : t('body.outOfStock')}
        </p>
      )
    },
    {
      title: t('header.actions'),
      dataIndex: 'productId',
      // sorter: (a, b) => a.status.length - b.status.length,
      render: (value, record) => (
        <AddToCartButton productId={value} stock={record.stock} />
        // <Btn
        //   className={`font-medium capitalize ${record.status ? 'bg-green-medium hover:bg-green-dark' : 'bg-black-medium hover:bg-black-light'} w-[135px] rounded py-1 text-white`}
        //   onClick={() => {
        //     if (record.status) {
        //     } else {
        //       router.push('/support');
        //     }
        //   }}
        // >
        //   {record.status ?
        //     t('body.addToCartButtonText')
        //   : t('body.contactUs')}
        // </Btn>
      )
    },
    {
      title: t('header.remove'),
      dataIndex: 'remove',
      render: (_, record) => (
        <button
          onClick={() => {
            handleDelete(record.key);
          }}
          className='font-medium'
        >
          <Image
            src='/icons/bin.svg'
            alt='delete icon'
            width={18}
            height={18}
            quality={100}
          />
        </button>
      )
    }
  ];

  return (
    <Table<WishlistDataType>
      columns={columns}
      dataSource={dataSource}
      onChange={onChange}
      showSorterTooltip={{ target: 'sorter-icon' }}
      className='wishtlist-table mt-8 w-[calc(100%)]'
      // style={{ minHeight: '750px' }}
    />
  );
}

export default WishlistTable;
