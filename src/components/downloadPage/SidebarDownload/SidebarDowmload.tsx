'use client';

import { Link, usePathname } from '@/navigation';
import { useLocale, useTranslations } from 'next-intl';

function SidebarDowmload() {
  const locale = useLocale();
  const t = useTranslations('DownloadsPage.content');
  const pathname = usePathname();
  console.log(pathname);

  return (
    <ul className=''>
      <li
        className={`${locale === 'ar' ? 'pr-3' : 'pl-3'} bg-red-shade-400 py-3 text-xl font-bold uppercase text-white`}
      >
        {t('sidebar.downloadTitle')}
      </li>
      <li className={`relative font-medium`}>
        <i
          className={`absolute ${locale === 'ar' ? 'right-2.5' : 'left-2.5'} top-[50%] h-[5px] w-[5px] -translate-y-1/2 rounded-full bg-red-shade-400 p-0 text-base`}
        />
        <Link
          href={'/downloads/datasheets'}
          className={`border-b border-dashed border-[#e5e5e5] text-sm leading-[24px] text-black-light hover:text-orange-medium ${locale === 'ar' ? 'pl-[30px] pr-[25px] hover:pr-[30px]' : 'pl-[25px] pr-[30px] hover:pl-[30px]'} block w-full py-2.5 transition-all duration-300 ease-out ${pathname.includes('/downloads/datasheets') ? `text-red-shade-400` : ''}`}
        >
          {t('children.datasheetsPage.content.title')}
        </Link>
      </li>
      <li className={`relative font-medium`}>
        <i
          className={`absolute ${locale === 'ar' ? 'right-2.5' : 'left-2.5'} top-[50%] h-[5px] w-[5px] -translate-y-1/2 rounded-full bg-red-shade-400 p-0 text-base`}
        />
        <Link
          href={'/downloads/drivers'}
          className={`border-b border-dashed border-[#e5e5e5] text-sm leading-[24px] text-black-light hover:text-orange-medium ${locale === 'ar' ? 'pl-[30px] pr-[25px] hover:pr-[30px]' : 'pl-[25px] pr-[30px] hover:pl-[30px]'} block w-full py-2.5 transition-all duration-300 ease-out ${pathname.includes('/downloads/drivers') ? `text-red-shade-400` : ''}`}
        >
          {t('children.driversPage.content.title')}
        </Link>
      </li>
    </ul>
  );
}

export default SidebarDowmload;
