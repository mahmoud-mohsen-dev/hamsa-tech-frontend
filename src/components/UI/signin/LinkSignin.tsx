import { Link } from '@/navigation';

function LinkLogin({
  children,
  href
}: {
  children: React.ReactNode;
  href: string;
}) {
  return (
    <Link
      href={href}
      className='flex w-full items-center justify-center gap-2 rounded-lg border border-solid border-gray-light py-2.5 transition-colors duration-200 hover:bg-[#f3f4f6b8] sm:basis-1/2'
    >
      {children}
    </Link>
  );
}

export default LinkLogin;
