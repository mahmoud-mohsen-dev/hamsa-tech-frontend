'use client';
import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import Image from 'next/image';
import Btn from '../UI/Btn';
import { Link, useRouter } from '@/navigation';
import { formatCurrencyNumbers } from '@/utils/numbersFormating';
import { useLocale, useTranslations } from 'next-intl';
import AddToCartButton from '../products/AddToCartButton';
import { useMyContext } from '@/context/Store';
import { fetchGraphqlClient } from '@/services/graphqlCrud';
import {
  GetWishlistDataType,
  WishlistDataType,
  WishlistsDataType
} from '@/types/wishlistReponseTypes';
import { getCookie } from '@/utils/cookieUtils';
import { updateWishtlistHandler } from '../productPage/OrderProduct';

// export interface WishlistTableDataType {
//   key: React.Key;
//   photo: { url: string; alt: string };
//   name: string;
//   price: number;
//   stock: number;
//   productId: string;
// }

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
  const {
    wishlistsData,
    isWishlistLoading,
    setIsWishlistLoading,
    setWishlistsData
  } = useMyContext();
  const dataSource = wishlistsData.map((item) => ({
    ...item,
    key: item.id
  }));
  const locale = useLocale();
  const t = useTranslations('WishlistPage.content.table');

  const handleDelete = (productIds: { [x: string]: string }) => {
    // console.log(obj);
    updateWishtlistHandler({
      locale,
      productIds,
      setIsWishlistLoading,
      setWishlistsData,
      wishlistsData
    });
    // const newData = wishlistsData.filter((item) => item.key !== key);
    // setDataSource(newData);
  };

  const columns: TableColumnsType<WishlistDataType> = [
    {
      title: (
        <p className={locale === 'ar' ? 'mr-10' : 'ml-10'}>
          {t('header.photo')}
        </p>
      ),
      dataIndex: 'photo',
      render: (_, record) => (
        <Link
          href={record?.id ? `/products/${record?.id}` : '/products'}
        >
          <Image
            alt={
              record.attributes.image_thumbnail.data.attributes
                .alternativeText ?? ''
            }
            src={
              record.attributes.image_thumbnail.data.attributes.url ??
              ''
            }
            objectFit='contain'
            width={100}
            height={70}
            className='ml-8'
          />
        </Link>
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
        record.attributes.name.indexOf(value as string) === 0,
      sorter: (a, b) =>
        a.attributes.name.charCodeAt(0) -
        b.attributes.name.charCodeAt(0),
      render: (_, record) => (
        <Link
          href={record?.id ? `/products/${record?.id}` : '/products'}
          className='font-medium capitalize text-black-light'
        >
          {record.attributes.name}
        </Link>
      )
      // sortDirections: ['ascend']
    },
    {
      title: t('header.price'),
      dataIndex: 'price',
      align: 'center',
      sorter: (a, b) => a.attributes.price - b.attributes.price,
      render: (_, record) => (
        <p className='font-medium text-black-light'>
          {formatCurrencyNumbers(
            (
              record?.attributes?.sale_price &&
                record?.attributes?.sale_price > 0
            ) ?
              record.attributes.sale_price
            : record.attributes.price,
            t('body.currency'),
            locale
          )}
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
      sorter: (a, b) => a.attributes.stock - b.attributes.stock,
      render: (_, record) => (
        <p
          className={`font-medium capitalize ${record.attributes.stock > 0 ? 'text-green-dark' : 'text-red-shade-350'}`}
        >
          {record.attributes.stock > 0 ?
            t('body.inStock')
          : t('body.outOfStock')}
        </p>
      )
    },
    {
      title: t('header.actions'),
      dataIndex: 'productId',
      render: (_, record) => (
        <AddToCartButton
          productId={record.id}
          stock={record.attributes.stock}
        />
      )
    },
    {
      title: t('header.remove'),
      dataIndex: 'remove',
      render: (_, record) => (
        <button
          onClick={() => {
            if (
              record?.attributes?.locale &&
              record?.id &&
              record?.attributes?.localizations?.data[0].attributes
                .locale &&
              record?.attributes?.localizations?.data[0].id
            ) {
              const data = {
                [record.attributes.locale]: record.id,
                [record.attributes.localizations.data[0].attributes
                  .locale]: record.attributes.localizations.data[0].id
              };
              handleDelete(data);
            }
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
  console.log(isWishlistLoading);

  return (
    <Table<WishlistDataType>
      columns={columns}
      dataSource={dataSource}
      onChange={onChange}
      showSorterTooltip={{ target: 'sorter-icon' }}
      className={`wishtlist-table mt-8 w-[calc(100%)] ${locale === 'ar' ? 'pagination-in-arabic' : ''}`}
      loading={isWishlistLoading}
      scroll={{ x: 'max-content' }}
      // style={{ minHeight: '750px' }}
    />
  );
}

export default WishlistTable;
