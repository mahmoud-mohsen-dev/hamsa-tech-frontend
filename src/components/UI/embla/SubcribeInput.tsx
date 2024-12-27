'use client';
import { useLocale, useTranslations } from 'next-intl';
// import { Button, Input, Space } from 'antd';
import { IoIosSend } from 'react-icons/io';

function SubcribeInput() {
  const t = useTranslations('HomePage.footer');
  const locale = useLocale();
  return (
    <div className='relative w-full max-w-80 text-white'>
      <input
        defaultValue=''
        placeholder={t('newsletterInputPlaceholder')}
        className={`w-full rounded-md bg-[rgba(255,255,255,.1)] p-3 ring ring-transparent ring-offset-blue-gray-medium focus:outline-none focus:ring-blue-300 focus:ring-offset-2 ${locale === 'ar' ? 'pl-12' : 'pr-12'}`}
      ></input>
      <button
        className={`absolute top-1/2 w-10 -translate-y-1/2 ${locale === 'ar' ? 'left-0' : 'right-0'}`}
      >
        <IoIosSend size={28} />
      </button>
    </div>
  );
}

export default SubcribeInput;
