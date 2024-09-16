'use client';

import { Form, Select } from 'antd';
import { IoIosArrowDown } from 'react-icons/io';

function Sorter() {
  return (
    <Form
      className='flex items-center gap-3'
      initialValues={{ pagination: 20, sortBy: 'featured' }}
    >
      <Form.Item name='pagination' style={{ marginBottom: 0 }}>
        <Select
          //   defaultValue={20}
          style={{ width: '140px' }}
          options={[
            { value: 50, label: <span>Show: 50</span> },
            { value: 40, label: <span>Show: 40</span> },
            { value: 30, label: <span>Show: 30</span> },
            { value: 20, label: <span>Show: 20</span> },
            { value: 10, label: <span>Show: 10</span> }
          ]}
          suffixIcon={<IoIosArrowDown size={14} />}
        />
      </Form.Item>

      <Form.Item name='sortBy' style={{ marginBottom: 0 }}>
        <Select
          //   defaultValue='featured'
          style={{ width: '180px' }}
          options={[
            {
              value: 'featured',
              label: <span>Sort by: Featured</span>
            },
            {
              value: 'nameAZ',
              label: <span>Name: A-Z</span>
            },
            {
              value: 'nameZA',
              label: <span>Name: Z-A</span>
            },
            {
              value: 'priceLowHigh',
              label: <span>Price: Low to High</span>
            },
            {
              value: 'priceHighLow',
              label: <span>Price: High to Low</span>
            },
            {
              value: 'ratingLowHigh',
              label: <span>Rating: Low to High</span>
            },
            {
              value: 'ratingHighLow',
              label: <span>Rating: High to Low</span>
            }
          ]}
          suffixIcon={<IoIosArrowDown size={14} />}
        />
      </Form.Item>
    </Form>
  );
}

export default Sorter;
