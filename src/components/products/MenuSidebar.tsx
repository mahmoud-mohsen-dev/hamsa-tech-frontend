'use client';
import { usePathname, useRouter } from '@/navigation';
import { NavItemKeyType, NavItemType } from '@/types';
import { CategorySidebarType } from '@/types/getCategoriesFilter';
import { Menu, MenuProps } from 'antd';
import { useSearchParams } from 'next/navigation';

import { useCallback, useState } from 'react';
import { v4 } from 'uuid';

function MenuSidebar({ data }: { data: CategorySidebarType[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dataValues = data && Array.isArray(data) ? data : [];
  // console.log(data?.products);

  const items = dataValues.map((item) => {
    return {
      key: item.id,
      label: item.attributes.name ?? '',
      children:
        (
          item?.attributes?.sub_categories?.data &&
          item?.attributes?.sub_categories?.data.length > 0
        ) ?
          item.attributes.sub_categories.data.map((child) => ({
            key: child.id,
            label: child?.attributes?.name
          }))
        : []
    };
  }) ?? {
    key: v4(),
    label: ''
  };
  console.log(items);
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
      // defaultOpenKeys={[data?.products[0].id as string]}
      // defaultSelectedKeys={[
      //   (data?.products[0].children[0].id as string) ?? ''
      // ]}
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
