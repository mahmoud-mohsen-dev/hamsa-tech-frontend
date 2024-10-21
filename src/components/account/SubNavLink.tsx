'use client';

import { Link, usePathname } from '@/navigation';

function SubNavLink({
  children,
  href,
  page
}: {
  children: React.ReactNode;
  href: string;
  page: string;
}) {
  const pathname = usePathname();
  const isActive: boolean = (pathname.split('/')[2] ?? '') === page;

  return (
    <Link
      href={href}
      className={`flex flex-wrap items-center gap-4 px-4 py-2 transition-colors duration-100 ${isActive ? 'bg-black-light text-white' : 'text-black-light hover:bg-gray-ultralight'}`}
    >
      {children}
    </Link>
  );
}

export default SubNavLink;
