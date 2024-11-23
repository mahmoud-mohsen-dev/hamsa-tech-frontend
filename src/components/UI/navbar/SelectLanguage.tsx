'use client';
import { useMyContext } from '@/context/Store';
import { useSelectLanguage } from '@/hooks/useSelectLanguage';
import { usePathname, useRouter } from '@/navigation';
import { Select } from 'antd';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useTransition } from 'react';
import { IoIosArrowDown } from 'react-icons/io';

function SelectLanguage({
  defaultValue,
  className = 'language-select',
  styleWidth = 90,
  styleIconColor = undefined
}: {
  defaultValue: string;
  className?: string;
  styleWidth?: number | string;
  styleIconColor?: { color: string };
}) {
  const { onLanguageSelectChange, isPending } = useSelectLanguage();

  return (
    <Select
      defaultValue={defaultValue}
      disabled={isPending}
      onChange={onLanguageSelectChange}
      style={{ width: styleWidth, marginLeft: '.5rem' }}
      className={className}
      options={[
        {
          value: 'en',
          label: (
            <p className='flex items-center justify-between'>
              <span>EN</span>
              <Image
                src={'/languages/us.png'}
                alt='USA Flag'
                width={14}
                height={14}
                quality={100}
              />
            </p>
          )
        },
        {
          value: 'ar',
          label: (
            <p className='flex items-center justify-between'>
              <span>AR</span>
              <Image
                src={'/languages/eg.png'}
                alt='Egypt Flag'
                width={14}
                height={14}
                quality={100}
              />
            </p>
          )
        }
      ]}
      suffixIcon={
        <IoIosArrowDown
          size={14}
          className='text-white'
          style={{ ...styleIconColor }}
        />
      }
    />
  );
}

export default SelectLanguage;
