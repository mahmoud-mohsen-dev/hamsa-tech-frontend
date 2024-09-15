'use client';

import { usePathname, useRouter } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import { ChangeEvent, useTransition } from 'react';

interface PropType {
  children: React.ReactNode;
  defaultValue: string;
  label: string;
}

function LocalSwitcherSelect({
  children,
  defaultValue,
  label
}: PropType) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();

  const onSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = event.target.value;
    let newPath = pathname;
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        newPath = newPath.replace(`[${key}]`, String(value));
      });
    }
    startTransition(() => {
      router.replace(newPath, {
        locale: nextLocale as 'en' | 'ar' | undefined
      });
    });
  };

  return (
    <label
      className={`relative text-gray-400 ${isPending && 'transition-opacity disabled:opacity-30'}`}
    >
      <p>{label}</p>
      <select
        className='inline-flex appearance-none bg-transparent py-3 pl-2 pr-6'
        defaultValue={defaultValue}
        disabled={isPending}
        onChange={onSelectChange}
      >
        {children}
      </select>
      <span className='pointer-events-none absolute right-2 top-[8px]'>
        🔽
      </span>
    </label>
  );
}

export default LocalSwitcherSelect;
