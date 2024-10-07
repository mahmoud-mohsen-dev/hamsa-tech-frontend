'use client';
import React from 'react';
import { Table } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';

interface DataType {
  key: React.Key;
  photo: string;
  name: string;
  price: number;
  status: string;
}

const columns: TableColumnsType<DataType> = [
  {
    title: 'Photo',
    dataIndex: 'photo'
  },
  {
    title: 'Name',
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
    sortDirections: ['ascend']
  },
  {
    title: 'Price',
    dataIndex: 'price',
    sorter: (a, b) => a.price - b.price
  },
  {
    title: 'Status',
    dataIndex: 'status',
    filters: [
      {
        text: 'In Stock',
        value: 'in_stock'
      },
      {
        text: 'Out Of Stock',
        value: 'out_of_stock'
      }
    ],
    onFilter: (value, record) =>
      record.status.indexOf(value as string) === 0,
    sorter: (a, b) => a.status.length - b.status.length
  },
  {
    title: 'Remove',
    dataIndex: 'remove',
    render: () => <button>Remove</button>
  }
];

const data = [
  {
    key: '1',
    photo: 'someurl',
    name: 'Brown John ',
    price: 20,
    status: 'in_stock'
  },
  {
    key: '2',
    photo: 'someurl',
    name: 'John Brown',
    price: 50,
    status: 'out_of_stock'
  },
  {
    key: '3',
    photo: 'someurl',
    name: 'ow ohnBr',
    price: 100,
    status: 'in_stock'
  },
  {
    key: '4',
    photo: 'someurl',
    name: 'John Brownsss',
    price: 20,
    status: 'in_stock'
  }
];

const onChange: TableProps<DataType>['onChange'] = (
  pagination,
  filters,
  sorter,
  extra
) => {
  console.log('params', pagination, filters, sorter, extra);
};

function WishlistTable() {
  return (
    <Table<DataType>
      columns={columns}
      dataSource={data}
      onChange={onChange}
      showSorterTooltip={{ target: 'sorter-icon' }}
      className='mt-8 w-[80%]'
    />
  );
}

export default WishlistTable;
