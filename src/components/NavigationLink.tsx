'use client';

import { useSelectedLayoutSegment } from 'next/navigation';
import { ComponentProps } from 'react';
import type { pathnames } from '@/config';
import { Link } from '@/navigation';

export default function NavigationLink<
  Pathname extends keyof typeof pathnames
>({ href, ...rest }: ComponentProps<typeof Link<Pathname>>) {
  const selectedLayoutSegment = useSelectedLayoutSegment();
  const pathname =
    selectedLayoutSegment ? `/${selectedLayoutSegment}` : '/';
  // console.log(selectedLayoutSegment);
  const isActive = pathname === href;

  return (
    <Link
      aria-current={isActive ? 'page' : undefined}
      className={`'inline-block transition-colors', px-2 py-3 ${isActive ? 'text-white' : 'text-gray-400 hover:text-gray-200'} `}
      href={href}
      {...rest}
    />
  );
}
