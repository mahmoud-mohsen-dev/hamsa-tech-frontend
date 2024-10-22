import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';
import { forwardRef } from 'react';

// Define the props type for MyButton
interface MyButtonProps {
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  href?: string;
  children: React.ReactNode;
  target?: '_blank' | '_self';
  className?: string;
}

// Use React.ForwardRefRenderFunction to properly type the forwarded ref
const MyButton: React.ForwardRefRenderFunction<
  HTMLAnchorElement,
  MyButtonProps
> = (
  { onClick, href, children, target = '_self', className = '' },
  ref
) => {
  return (
    <a
      href={href}
      onClick={onClick}
      ref={ref}
      target={target}
      className={className}
    >
      {children}
    </a>
  );
};

// Use React.forwardRef to wrap the component
export const ForwardedAnchor = forwardRef(MyButton);

function OpenMapInNewWindow({
  branchName,
  lat,
  lng
}: {
  branchName: string;
  lat: number;
  lng: number;
}) {
  const t = useTranslations('AboutUsPage.content');
  // Generate the Google Maps URL with latitude and longitude
  const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

  return (
    <div className='absolute left-2 top-2 flex flex-col gap-1.5 rounded border border-gray-light bg-white px-5 py-3'>
      <h4 className='text-sm font-medium'>{branchName}</h4>
      {/* <Link
        href={
          'https://maps.google.com/maps?ll=30.045579,31.238534&z=14&t=m&hl=en&gl=US&mapclient=embed&cid=5650618922355064806'
        }
      >
        {t('viewLargerMapText')}
      </Link> */}
      <Link href={googleMapsUrl} passHref legacyBehavior>
        <ForwardedAnchor
          target='_blank'
          className='text-xs text-blue-sky-normal hover:text-blue-sky-accent hover:underline'
        >
          {t('viewLargerMapText')}
        </ForwardedAnchor>
      </Link>
    </div>
  );
}

export default OpenMapInNewWindow;
