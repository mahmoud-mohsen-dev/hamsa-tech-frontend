import { Rate } from 'antd';
import Image from 'next/image';
import { FaPlus } from 'react-icons/fa6';
import Btn from '../UI/Btn';
import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';
import AddToCartButton from './AddToCartButton';

function ProductCard({
  linkSrc,
  imgSrc,
  alt,
  title,
  category,
  avgRate,
  totalRates,
  priceBeforeDeduction,
  badge,
  currentPrice
}: {
  linkSrc: string;
  imgSrc: string;
  alt: string;
  title: string;
  category: string;
  badge: string;
  avgRate: number;
  totalRates: number;
  priceBeforeDeduction: number;
  currentPrice: number;
}) {
  const t = useTranslations('ProductsPage.content');
  // const handleClick = (event: React.SyntheticEvent) => {
  //   event.stopPropagation();
  //   event.preventDefault();
  // };

  return (
    <Link href={linkSrc} className='relative'>
      <div className='relative w-full bg-white p-5 shadow-featured transition-all duration-75 ease-linear hover:shadow-featuredHovered'>
        <p
          className='absolute left-6 top-4 z-20 text-sm font-medium uppercase text-red-dark'
          style={{ fontStyle: 'oblique' }}
        >
          {badge}
        </p>
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
          className='mb-5 mt-2.5 object-contain transition-["scale"] duration-1000 ease-linear hover:scale-110'
        />
        <div className='h-[90px] lg:h-[80px] 2xl:h-[100px]'>
          <h3 className='mb-1 max-h-[22px] overflow-hidden font-openSans text-sm font-normal capitalize leading-[22px] text-gray-medium'>
            {category}
          </h3>
          <h4 className='mb-3 font-openSans text-base font-semibold capitalize leading-[24px] text-black-light xl:text-xs 2xl:text-base'>
            {title}
          </h4>
          <div className='flex items-center gap-2 leading-[54px]'>
            <Rate defaultValue={avgRate} allowHalf disabled />
            {/* <span className='text-base font-normal text-gray-light'>
              {avgRate}
            </span> */}
            <span className='text-base font-normal text-gray-light'>
              ({totalRates}{' '}
              {totalRates > 1 ?
                t('productCardReviews')
              : t('productCardReview')}
              )
            </span>
          </div>
        </div>

        {/* price and add button */}
        <div className='item mt-1 flex justify-between'>
          <div className='flex items-center gap-2'>
            <p className='text-sm font-normal text-gray-light line-through'>
              EGP {priceBeforeDeduction}
            </p>
            <p className='text-sm font-normal text-black-light'>
              EGP {currentPrice}
            </p>
          </div>
          <AddToCartButton />
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
