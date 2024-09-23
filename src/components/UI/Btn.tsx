import { Link } from '@/navigation';

function Btn({
  children,
  href,
  onClick,
  className = 'bg-white text-gray-normal text-lg',
  defaultPadding = true,
  outlined = false,
  dir = undefined,
  type = 'button'
}: {
  children: React.ReactNode;
  href?: string | null;
  dir?: 'ltr' | 'rtl' | undefined;
  onClick?: (e: React.SyntheticEvent) => void;
  className?: string;
  defaultPadding?: boolean;
  outlined?: boolean;
  type?: 'button' | 'submit' | 'reset';
}): JSX.Element {
  const btnStyles =
    'focus:outline-none active:outline-none transition-colors duration-300 flex justify-center items-center gap-2 rounded shadow-sm';

  if (href) {
    return (
      <Link
        href={href}
        className={` ${btnStyles} ${outlined ? 'border-2 border-white text-white' : ''} ${className}`}
        onClick={onClick}
      >
        {children}
      </Link>
    );
  }
  return (
    <button
      className={`${btnStyles} ${outlined ? 'border-2 border-white text-white' : ''} ${defaultPadding ? 'px-[1rem] py-[.55rem]' : ''} ${className}`}
      onClick={onClick}
      type={type}
      dir={dir}
    >
      {children}
    </button>
  );
}

export default Btn;
