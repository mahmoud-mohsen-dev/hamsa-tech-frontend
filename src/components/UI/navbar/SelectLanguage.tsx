'use client';
import { useMyContext } from '@/context/Store';
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
  const { nextProductId } = useMyContext();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();

  function onSelectChange(event: string) {
    const nextLocale = event;
    let query = {};

    // Ensure we're on the client side before accessing window
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(
        window.location.search
      );
      query = Object.fromEntries(searchParams.entries());
    }

    startTransition(() => {
      if (params.product && typeof params.product === 'string') {
        router.replace(
          { pathname: `/products/${String(nextProductId)}` },
          { locale: nextLocale }
        );
      } else {
        router.replace(
          {
            pathname,
            query
          },
          { locale: nextLocale }
        );
      }
    });
  }
  return (
    <Select
      defaultValue={defaultValue}
      disabled={isPending}
      onChange={onSelectChange}
      style={{ width: styleWidth, marginLeft: '.5rem' }}
      className={className}
      options={[
        {
          value: 'en',
          label: (
            <p className='flex items-center gap-[10px]'>
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
            <p className='flex items-center gap-[10px]'>
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
