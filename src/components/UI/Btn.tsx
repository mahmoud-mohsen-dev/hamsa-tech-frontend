'use client';
import { Link } from '@/navigation';

function Btn({
  children,
  href,
  onClick,
  className = 'bg-white text-gray-normal text-lg',
  defaultPadding = true,
  enableBtnStyles = true,
  outlined = false,
  dir = undefined,
  type = 'button',
  disabled = false,
  target = '_self',
  // hover = false,
  setHover = () => {}
}: {
  children: React.ReactNode;
  href?: string | null;
  dir?: 'ltr' | 'rtl' | undefined;
  // onClick?: (e: React.SyntheticEvent) => void;
  onClick?:
    | React.MouseEventHandler<HTMLButtonElement>
    | React.MouseEventHandler<HTMLAnchorElement>;
  className?: string;
  defaultPadding?: boolean;
  enableBtnStyles?: boolean;
  outlined?: boolean;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  // hover?: boolean;
  target?: '_blank' | '_self';
  setHover?: React.Dispatch<React.SetStateAction<boolean>>;
}): JSX.Element {
  const btnStyles =
    'focus:outline-none active:outline-none disabled:cursor-not-allowed transition-colors duration-300 flex justify-center items-center gap-2 rounded shadow-sm';

  if (href) {
    return (
      <Link
        href={href}
        className={`${enableBtnStyles ? btnStyles : ''} ${outlined ? 'border-2 border-white text-white' : ''} ${defaultPadding ? 'px-[1rem] py-[.55rem]' : ''} ${className}`}
        onClick={
          onClick as React.MouseEventHandler<HTMLAnchorElement>
        }
        target={target}
      >
        {children}
      </Link>
    );
  }
  return (
    <button
      className={`${enableBtnStyles ? btnStyles : ''} ${outlined ? 'border-2 border-white text-white' : ''} ${defaultPadding ? 'px-[1rem] py-[.55rem]' : ''} ${className}`}
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
      onMouseMove={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
      type={type}
      dir={dir}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Btn;
