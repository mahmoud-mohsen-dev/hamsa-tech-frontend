import { Rate } from 'antd';
import Image from 'next/image';
import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';
import AddToCartButton from './AddToCartButton';

function ProductCard({
  id,
  linkSrc,
  imgSrc,
  alt,
  title,
  category,
  brand,
  avgRate,
  totalRates,
  priceBeforeDeduction,
  badge,
  currentPrice,
  stock
}: {
  id: string;
  linkSrc: string;
  imgSrc: string;
  alt: string;
  title: string;
  category: string;
  brand: string;
  badge: string;
  avgRate: number;
  totalRates: number;
  priceBeforeDeduction: number;
  currentPrice: number;
  stock: number;
}) {
  const t = useTranslations('ProductsPage.content');
  // const handleClick = (event: React.SyntheticEvent) => {
  //   event.stopPropagation();
  //   event.preventDefault();
  // };

  return (
    <Link href={linkSrc} className='relative min-w-[260px]'>
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
        <div className='h-[100px]'>
          <h3 className='mb-1 h-[22px] overflow-hidden font-openSans text-sm font-normal capitalize leading-[22px] text-gray-medium'>
            {category} - {brand}
          </h3>
          <h4 className='mb-1 h-[40px] font-openSans text-sm font-semibold capitalize leading-[20px] text-black-light'>
            {title}
          </h4>
          <div className='mb-2.5 flex h-[20px] items-center gap-2'>
            <Rate defaultValue={avgRate} allowHalf disabled />
            <span className='text-sm font-normal text-gray-medium'>
              ({totalRates}{' '}
              {totalRates > 1 ?
                t('productCardReviews')
              : t('productCardReview')}
              )
            </span>
          </div>
        </div>

        {/* price and add button */}
        <div className='mt-1 flex h-[45px] items-center justify-between'>
          <div className='flex flex-col items-start justify-center gap-1'>
            {currentPrice > 1 ?
              <p className='text-[15px] font-normal leading-[18px] text-gray-medium line-through'>
                EGP {priceBeforeDeduction}
              </p>
            : <p className='text-base font-medium text-black-light'>
                EGP {priceBeforeDeduction}
              </p>
            }
            {currentPrice > 1 && (
              <p className='text-base font-medium text-black-light'>
                EGP {currentPrice}
              </p>
            )}
          </div>
          <AddToCartButton productId={id} stock={stock} />
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
