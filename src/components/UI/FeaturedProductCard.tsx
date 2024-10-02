import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

function FeaturedProductCard({
  imgSrc,
  alt = '',
  title,
  description,
  linkSrc,
  isNew = false
}: {
  imgSrc: string;
  alt: string;
  title: string;
  description: string;
  linkSrc: string;
  isNew?: boolean;
}) {
  // const locale = useLocale();
  const t = useTranslations('HomePage.featured');

  return (
    <div className='relative w-full bg-white p-5 shadow-featured transition-all duration-300 ease-linear hover:shadow-featuredHovered'>
      <p
        className='absolute left-6 top-4 z-20 text-sm font-medium text-red-dark'
        style={{ fontStyle: 'oblique' }}
      >
        {isNew ? 'New' : ''}
      </p>
      <Link href={linkSrc} className='relative'>
        <Image
          src={imgSrc}
          alt={alt}
          width={156}
          height={156}
          sizes='100vw'
          quality={100}
          style={{
            minHeight: '156px',
            maxHeight: '156px',
            maxWidth: '156px',
            minWidth: '100%'
          }}
          className='mb-10 mt-2.5 object-contain transition-["scale"] duration-1000 ease-linear hover:scale-110'
        />
        <div className='h-[90px] lg:h-[80px] 2xl:h-[100px]'>
          <h4 className='mb-[12px] font-openSans text-base font-semibold text-black-light xl:text-xs 2xl:text-base'>
            {title}
          </h4>
          <h3 className='mb-2.5 max-h-[44px] overflow-hidden font-openSans text-sm font-normal leading-[22px] text-gray-medium'>
            {description}
          </h3>
        </div>
        <p className='font-openSans text-sm font-normal text-red-normal'>
          {t('buttonText')}
        </p>
      </Link>
    </div>
  );
}

export default FeaturedProductCard;
