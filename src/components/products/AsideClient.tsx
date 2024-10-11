'use client';

import { useMyContext } from '@/context/Store';
import { useLocale, useTranslations } from 'next-intl';
import React from 'react';
import { IoClose } from 'react-icons/io5';

function AsideClient({ children }: { children: React.ReactNode }) {
  const { toggleFilters, setToggleFilters } = useMyContext();
  const locale = useLocale();
  const t = useTranslations('ProductsPage');

  return (
    <aside
      className={`${
        toggleFilters ?
          locale === 'ar' ?
            'translate-x-0'
          : 'translate-x-0'
        : locale === 'ar' ? 'translate-x-full lg:translate-x-0'
        : '-translate-x-full lg:translate-x-0'
      } aside-filter fixed left-0 right-0 top-[48px] z-50 max-h-full overflow-y-auto bg-white pb-20 pt-10 transition-transform duration-300 lg:static lg:block lg:max-h-fit lg:pb-0 lg:pt-0`}
      style={
        locale === 'ar' ?
          {
            borderLeft: '1px solid rgba(5, 5, 5, 0.06)'
          }
        : {
            borderRight: '1px solid rgba(5, 5, 5, 0.06)'
          }
      }
    >
      <div className='flex items-center justify-between'>
        <h3
          className={`${locale === 'ar' ? 'mr-[15px]' : 'ml-[24px]'} w-fit text-lg text-black-medium`}
        >
          {t('filtersSidebar.categoriesTitle')}
        </h3>
        <IoClose
          onClick={() => setToggleFilters((prev) => !prev)}
          size={24}
          className={`inline text-black lg:hidden ${locale === 'ar' ? 'ml-2.5' : 'mr-2.5'}`}
        />
      </div>
      {children}
    </aside>
  );
}

export default AsideClient;
