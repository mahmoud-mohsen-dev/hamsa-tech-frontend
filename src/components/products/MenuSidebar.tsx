'use client';
import { useRouter } from '@/navigation';
import { CategorySidebarType } from '@/types/getCategoriesFilter';
import { Menu, MenuProps } from 'antd';
import { useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { v4 } from 'uuid';

function MenuSidebar({
  data,
  onClose
}: {
  data: CategorySidebarType[];
  onClose?: () => void;
}) {
  const router = useRouter();
  // const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const dataValues = data && Array.isArray(data) ? data : [];
  const [openKeys, setOpenKeys] = useState<string[]>(
    // params.get('category') !== null ?
    //   [params.get('category') ?? '']
    // :
    []
  ); // State for open keys
  // console.log(params);
  // console.log(data);

  const items = dataValues.map((item) => {
    return {
      // key: item.id,
      key: item?.attributes?.slug,
      label: item?.attributes?.name ?? '',
      slug: item?.attributes?.slug,
      children:
        (
          item?.attributes?.sub_categories?.data &&
          item?.attributes?.sub_categories?.data.length > 0
        ) ?
          item.attributes.sub_categories.data.map((child) => ({
            key: `${item?.attributes?.slug}-${child?.attributes?.slug}`,
            label: child?.attributes?.name,
            slug: child?.attributes?.slug
          }))
        : []
    };
  }) ?? {
    key: v4(),
    label: ''
  };
  // console.log(items);
  // const [currentActiveSubCategory, setCurrentActiveSubCategory] =
  //   useState<
  //     { key: string; label: string; slug: string } | undefined
  //   >(undefined);
  // console.log(currentActiveSubCategory);

  const onClick: MenuProps['onClick'] = (e) => {
    // setCurrentActiveSubCategory([e.key ?? '']);
    // get category slug
    let selectedSubCategory:
      | {
          key: string;
          label: string;
          slug: string;
        }
      | undefined;
    const selectedCategory = items.find((category) => {
      selectedSubCategory = category.children.find(
        (selectedSubCategory) => selectedSubCategory.key === e.key
      );
      // console.log(selectedSubCategory);

      return selectedSubCategory;
    });
    // setCurrentActiveSubCategory(selectedSubCategory);
    // console.log(selectedCategory?.slug);
    // console.log(selectedSubCategory?.slug ?? '');

    // const newArr = [...items.map((item) => item?.children)].flat(1);
    // const foundItem = newArr.find((child) => {
    //   return child.key === e.key;
    // });

    // console.log(foundItem);
    if (onClose) {
      onClose();
    }
    router.push(
      '/products' +
        '?' +
        createQueryString(
          'category',
          selectedCategory?.slug ?? '',
          'sub-category',
          selectedSubCategory?.slug ?? ''
        )
    );
    // setActiveSubCategory(foundItem?.label ?? '');
  };

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (
      category: string,
      categoryValue: string,
      subCategory: string,
      subCategoryValue: string
    ) => {
      params.set(category, categoryValue);
      params.set(subCategory, subCategoryValue);
      params.set('page', '1');
      console.log(categoryValue);
      console.log(params.toString());
      return params.toString();
    },
    [searchParams]
  );
  // console.log(params.get('sub-category') ?? '');

  const getQueryString = useCallback(() => {
    const paramsCategory = params.get('category');
    const paramsSubCategory = params.get('sub-category');

    // console.log(paramsCategory);
    // console.log(paramsSubCategory);
    return paramsCategory && paramsSubCategory ?
        [`${paramsCategory}-${paramsSubCategory}`]
      : undefined;
  }, [searchParams]);

  // console.log(getQueryString());
  // console.log(
  //   params.get('category') ?
  //     [params.get('category') ?? '']
  //   : undefined
  // );

  // Handle open submenu change to allow only one open submenu at a time
  const onOpenChange = (keys: string[]) => {
    const latestOpenKey = keys.find(
      (key) => openKeys.indexOf(key) === -1
    );
    if (latestOpenKey) {
      setOpenKeys([latestOpenKey]); // Only open the most recent key
    } else {
      setOpenKeys([]); // Close all if none is selected
    }
  };

  return (
    <Menu
      mode='inline'
      // defaultSelectedKeys={['access-control-devices']}
      selectedKeys={getQueryString()}
      // openKeys={
      //   params.get('category') ?
      //     [params.get('category') ?? '']
      //   : undefined
      // }
      openKeys={openKeys}
      onOpenChange={onOpenChange} // Set the new handler here
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
