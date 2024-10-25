'use client';

import { usePathname } from '@/navigation';

function Main({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // console.log(pathname);
  // console.log(pathname === '/ar');

  return (
    <main
      className={`w-full ${pathname === '/ar' || pathname === '/en' || pathname === '/' ? '' : 'pt-[48px] md:pt-[64px]'}`}
    >
      {children}
    </main>
  );
}

export default Main;
