'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { v4 } from 'uuid';
import { EmblaOptionsType } from 'embla-carousel';
import EmblaSlideToScroll from '../embla/EmblaSlideToScroll';
import { Link, usePathname, useRouter } from '@/navigation';
import {
  CategoryType,
  SubCategoryType
} from '@/types/getNavbarProductsCategories';
import { useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';

// import EmblaCarouselInView from '../embla';

interface NavSubProps {
  name: string;
  items: CategoryType[];
  currentHovered: string;
}

function NavSubCategoryItem({
  activeFoundItem,
  currentSubHovered,
  category
}: {
  activeFoundItem: SubCategoryType[];
  currentSubHovered: boolean;
  category: string;
}) {
  const locale = useLocale();
  const subItemsSlides =
    activeFoundItem.length > 0 ?
      activeFoundItem.map((item) => {
        return (
          <li key={item.id}>
            <Link
              href={`/products?${new URLSearchParams({ category, 'sub-category': item?.attributes?.slug })}`}
              replace={true}
              className='flex flex-col items-center'
              // className='text-gray-normal hover:bg-gray-lighter rounded-[50px] bg-transparent py-2 pl-4 pr-3.5 text-sm font-semibold hover:text-black-light'
            >
              <>
                <div className='relative'>
                  <Image
                    src={
                      item?.attributes?.image?.data?.attributes
                        ?.url ?? ''
                    }
                    alt={
                      item?.attributes?.image?.data?.attributes
                        ?.alternativeText ?? ''
                    }
                    // fill
                    width={110}
                    height={110}
                    quality={100}
                    style={{
                      objectFit: 'contain',
                      minHeight: '110px',
                      maxHeight: '110px',
                      minWidth: '110px'
                      // objectPosition: 'center'
                    }}
                  />
                </div>
                <p className='mt-5 text-xs text-gray-normal hover:text-blue-dark'>
                  {item?.attributes?.name}
                </p>
              </>
            </Link>
          </li>
        );
      })
    : [];
  const OPTIONS: EmblaOptionsType = {
    slidesToScroll: 'auto',
    direction: locale === 'ar' ? 'rtl' : 'ltr'
  };

  return (
    currentSubHovered &&
    activeFoundItem && (
      <ul className='mb-6 mt-5 flex justify-center gap-8'>
        <EmblaSlideToScroll
          slides={subItemsSlides}
          options={OPTIONS}
        />
      </ul>
    )
  );
}

function NavSub({ name, currentHovered, items }: NavSubProps) {
  const isActive = name === currentHovered;
  const [currentCategoryHovered, setCurrentCategoryHovered] =
    useState('');

  useEffect(() => {
    if (items[0] && items[0]?.attributes?.name) {
      // console.log(items[0].categoryName);
      setCurrentCategoryHovered(items[0]?.attributes?.name);
    }
  }, [items]);
  // console.log(currentSubHovered);
  const indexOfFoundItem = items.findIndex(
    (item) => item?.attributes?.name === currentCategoryHovered
  );
  const stylessOnHover =
    isActive ?
      'nav-sub_active visible opacity-100'
    : 'invisible opacity-0';

  const handleHovered = (categoryName: string) => {
    setCurrentCategoryHovered(categoryName);
  };

  return (
    items.length > 0 && (
      <div
        className={`nav-sub absolute bottom-0 left-0 z-[110] w-full translate-y-full border-t border-solid border-gray-ultralight bg-white shadow-lg ${stylessOnHover}`}
      >
        {/* this the heading of categories */}
        <ul className='flex flex-wrap justify-center gap-2 py-5'>
          {items.map((item) => (
            <li key={v4()}>
              <Link
                href={`/products?${new URLSearchParams({ category: item?.attributes?.slug })}`} // Add category to the URL
                replace={true}
                className={`rounded-[50px] py-2 pl-4 pr-3.5 text-sm font-semibold ${item?.attributes?.name === currentCategoryHovered ? 'bg-gray-lighter text-black-light' : 'bg-transparent text-gray-normal'}`}
                onMouseEnter={() =>
                  handleHovered(item?.attributes?.name)
                }
                // onMouseLeave={() => handleHovered('')}
              >
                {item?.attributes?.name ?? ''}
              </Link>
            </li>
          ))}
        </ul>

        <NavSubCategoryItem
          currentSubHovered={isActive}
          activeFoundItem={
            items[indexOfFoundItem]?.attributes?.sub_categories
              ?.data ?? []
          }
          category={items[indexOfFoundItem]?.attributes?.slug ?? ''}
        />
      </div>
    )
  );
}

export default NavSub;
