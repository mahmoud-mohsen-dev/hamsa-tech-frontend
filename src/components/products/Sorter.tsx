'use client';

import { Form, Select } from 'antd';
import { useTranslations } from 'next-intl';
import { IoIosArrowDown } from 'react-icons/io';

function Sorter() {
  const t = useTranslations('ProductsPage.filtersSidebar');

  // Get localized showBy options
  const showByOptions = [
    { value: 50, label: <span>{t('showBy.0')}</span> },
    { value: 40, label: <span>{t('showBy.1')}</span> },
    { value: 30, label: <span>{t('showBy.2')}</span> },
    { value: 20, label: <span>{t('showBy.3')}</span> },
    { value: 10, label: <span>{t('showBy.4')}</span> }
  ];

  // Get localized sortBy options
  const sortByOptions = [
    {
      value: 'featured',
      label: <span>{t('sortBy.0')}</span>
    },
    {
      value: 'name_asc',
      label: <span>{t('sortBy.1')}</span>
    },
    {
      value: 'name_desc',
      label: <span>{t('sortBy.2')}</span>
    },
    {
      value: 'price_asc',
      label: <span>{t('sortBy.3')}</span>
    },
    {
      value: 'price_desc',
      label: <span>{t('sortBy.4')}</span>
    },
    {
      value: 'rating_asc',
      label: <span>{t('sortBy.5')}</span>
    },
    {
      value: 'rating_desc',
      label: <span>{t('sortBy.6')}</span>
    }
  ];
  // console.log(showByOptions);
  // console.log(sortByOptions);

  return (
    <Form
      className='flex items-center gap-3'
      initialValues={{ pagination: 20, sortBy: 'featured' }}
    >
      <Form.Item name='pagination' style={{ marginBottom: 0 }}>
        <Select
          //   defaultValue={20}
          style={{ width: '120px' }}
          options={showByOptions}
          suffixIcon={<IoIosArrowDown size={14} />}
        />
      </Form.Item>

      <Form.Item name='sortBy' style={{ marginBottom: 0 }}>
        <Select
          //   defaultValue='featured'
          style={{ width: '220px' }}
          options={sortByOptions}
          suffixIcon={<IoIosArrowDown size={14} />}
        />
      </Form.Item>
    </Form>
  );
}

export default Sorter;
