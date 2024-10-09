'use client';

import { usePathname, useRouter } from '@/navigation';
import { Form, Select } from 'antd';
import { useTranslations } from 'next-intl';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';

function Sorter() {
  const t = useTranslations('ProductsPage.filtersSidebar');
  // const [pageSize, setPageSize] = useState(20)
  // const [sortBy, setSortBy] = useState('featured')
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const paramsSortBy = params.get('sort-by');
  const paramsPageSize = params.get('page-size');

  const handleSortBy = (value: string) => {
    // setSortBy(value);
    params.set('sort-by', value);
    router.replace(pathname + '?' + params.toString());
    // return value;
  };

  const handlePageSize = (value: number) => {
    params.set('page-size', value.toString());
    params.set('page', '1');
    router.replace(pathname + '?' + params.toString());
    // return Number(value);
  };

  // Get localized showBy options
  const showByOptions = [
    { value: 50, label: <span>{t('showBy.0')}</span> },
    { value: 40, label: <span>{t('showBy.1')}</span> },
    { value: 30, label: <span>{t('showBy.2')}</span> },
    { value: 20, label: <span>{t('showBy.3')}</span> },
    { value: 10, label: <span>{t('showBy.4')}</span> },
    { value: 1, label: <span>Show: 1</span> }
  ];

  //"name:desc", "final_product_price:desc", "average_reviews:desc

  // Get localized sortBy options
  const sortByOptions = [
    {
      value: 'featured',
      label: <span>{t('sortBy.0')}</span>
    },
    {
      value: 'name:asc',
      label: <span>{t('sortBy.1')}</span>
    },
    {
      value: 'name:desc',
      label: <span>{t('sortBy.2')}</span>
    },
    {
      value: 'final_product_price:asc',
      label: <span>{t('sortBy.3')}</span>
    },
    {
      value: 'final_product_price:desc',
      label: <span>{t('sortBy.4')}</span>
    },
    {
      value: 'average_reviews:asc',
      label: <span>{t('sortBy.5')}</span>
    },
    {
      value: 'average_reviews:desc',
      label: <span>{t('sortBy.6')}</span>
    }
  ];
  // console.log(showByOptions);
  // console.log(sortByOptions);

  return (
    <div
      className='flex items-center gap-3'
      // initialValues={{ pageSize: 20, sortBy: 'featured' }}
    >
      {/* <Form.Item name='pageSize' style={{ marginBottom: 0 }}> */}
      <Select
        //   defaultValue={20}
        style={{ width: '120px' }}
        options={showByOptions}
        suffixIcon={<IoIosArrowDown size={14} />}
        // defaultValue={20}
        value={
          (
            Number(paramsPageSize) > 0 &&
            !isNaN(Number(paramsPageSize))
          ) ?
            Number(paramsPageSize)
          : 20
        }
        onChange={handlePageSize}
      />
      {/* </Form.Item> */}

      {/* <Form.Item name='sortBy' style={{ marginBottom: 0 }}> */}
      <Select
        //   defaultValue='featured'
        style={{ width: '220px' }}
        options={sortByOptions}
        suffixIcon={<IoIosArrowDown size={14} />}
        // defaultValue={'featured'}
        value={paramsSortBy ?? 'featured'}
        onChange={handleSortBy}
      />
      {/* </Form.Item> */}
    </div>
  );
}

export default Sorter;
