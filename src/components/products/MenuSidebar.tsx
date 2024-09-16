'use client';
import { usePathname, useRouter } from '@/navigation';
import { NavItemKeyType, NavItemType } from '@/types';
import { Menu, MenuProps } from 'antd';
import { useSearchParams } from 'next/navigation';

import { useCallback, useState } from 'react';
import { v4 } from 'uuid';

function MenuSidebar({ data }: { data: NavItemType | null }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dataValues =
    data && typeof data === 'object' ? data.products : [];
  // console.log(data?.products);

  const items = dataValues.map((item: NavItemKeyType) => {
    return {
      key: item.id,
      label: item.categoryName ?? '',

      children:
        item.children && item.children.length > 0 ?
          item.children.map((child) => ({
            key: child.id,
            label: child.subCategoryName
          }))
        : []
    };
  }) ?? {
    key: v4(),
    label: ''
  };
  // console.log(items);
  const [currentActiveSubCategory, setCurrentActiveSubCategory] =
    useState([items[0].children[0].key ?? '']);
  // console.log(currentActiveSubCategory);

  const onClick: MenuProps['onClick'] = (e) => {
    const newArr = [...items.map((item) => item?.children)].flat(1);
    setCurrentActiveSubCategory([e.key ?? '']);
    const foundItem = newArr.find((child) => {
      return child.key === e.key;
    });

    // console.log(foundItem?.label);
    router.push(
      pathname +
        '?' +
        createQueryString('category', foundItem?.label ?? '')
    );
    // setActiveSubCategory(foundItem?.label ?? '');
  };

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, encodeURIComponent(value));
      return params.toString();
    },
    [searchParams]
  );

  return (
    <Menu
      mode='inline'
      defaultOpenKeys={[data?.products[0].id as string]}
      defaultSelectedKeys={[
        (data?.products[0].children[0].id as string) ?? ''
      ]}
      selectedKeys={currentActiveSubCategory}
      onClick={onClick}
      style={{
        borderRightColor: 'transparent',
        marginTop: '12px'
      }}
      items={items}
    />
  );
}

export default MenuSidebar;
