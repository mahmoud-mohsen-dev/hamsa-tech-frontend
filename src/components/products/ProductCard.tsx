'use client';
import Image from 'next/image';
import { Link } from '@/navigation';
import { useLocale } from 'next-intl';
import AddToCartButton from './AddToCartButton';
import { HiHeart, HiOutlineHeart } from 'react-icons/hi';
import { useMyContext } from '@/context/Store';
import { updateWishtlistHandler } from '../productPage/OrderProduct';
import { trimText } from '@/utils/helpers';

function ProductCard({
  id,
  linkSrc,
  imgSrc,
  alt,
  title,
  category,
  brand,
  // avgRate,
  // totalRates,
  priceBeforeDeduction,
  badge,
  currentPrice,
  stock,
  modalName,
  localeParentName,
  localeChildName,
  localeChildId
}: {
  id: string;
  linkSrc: string;
  imgSrc: string;
  alt: string;
  title: string;
  category: string;
  brand: string;
  badge: string;
  // avgRate: number;
  // totalRates: number;
  priceBeforeDeduction: number;
  currentPrice: number;
  stock: number;
  modalName: string;
  localeParentName: string;
  localeChildName: string;
  localeChildId: string;
}) {
  // const t = useTranslations('ProductsPage.content');
  const locale = useLocale();
  const {
    isWishlistLoading,
    findProductInWishlist,
    setIsWishlistLoading,
    setWishlistsData,
    wishlistsData
  } = useMyContext();
  // const handleClick = (event: React.SyntheticEvent) => {
  //   event.stopPropagation();
  //   event.preventDefault();
  // };
  const isAddedToWishlistActive = findProductInWishlist(id);

  const handleAddToWishList = (event: React.SyntheticEvent) => {
    event.stopPropagation();
    event.preventDefault();

    const productIds = {
      [localeParentName]: id,
      [localeChildName]: localeChildId
    };
    console.log(productIds);
    updateWishtlistHandler({
      locale,
      productIds,
      setIsWishlistLoading,
      setWishlistsData,
      wishlistsData
    });

    console.log('Add to Wish Lists clicked');
    // setIsWishlistActive(!isWishlistActive);
  };

  return (
    <Link href={linkSrc} className='relative min-w-[260px]'>
      <div className='relative w-full bg-white p-5 shadow-featured transition-all duration-75 ease-linear hover:shadow-featuredHovered'>
        <p
          className='absolute left-6 top-4 z-20 text-sm font-medium uppercase text-red-dark'
          style={{ fontStyle: 'oblique' }}
        >
          {badge}
        </p>

        <button
          onClick={handleAddToWishList}
          className={`absolute right-6 top-4 z-20 transition-colors duration-300 ${isAddedToWishlistActive ? 'text-red-dark' : 'text-black-light'}`}
        >
          {isAddedToWishlistActive ?
            <HiHeart size={20} />
          : <HiOutlineHeart size={20} />}

          {/* {isWishlistLoading ?
            <Spin
              // className='white'
              // style={{ marginInline: '40px', marginBlock: '2px' }}
              style={{ marginRight: '5px', marginBottom: '5px', marginLeft: '0px', marginTop: '0px' }}
              size='small'
            />
          : isAddedToWishlistActive ?
            <HiHeart size={20} />
          : <HiOutlineHeart size={20} />} */}
        </button>

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
        <div className='h-[90px]'>
          <p className='mb-2.5 h-[14px] text-sm font-normal uppercase text-gray-normal'>
            {modalName}
          </p>
          <h3 className='mb-1 h-[22px] overflow-hidden font-openSans text-sm font-normal capitalize leading-[22px] text-gray-medium'>
            {brand} - {category}
          </h3>
          <h4 className='mb-1 h-[40px] font-openSans text-sm font-semibold capitalize leading-[20px] text-black-light'>
            {trimText(title ?? '')}
          </h4>
          {/* <div className='mb-2.5 flex h-[20px] items-center gap-2'>
            <Rate defaultValue={avgRate} allowHalf disabled />
            <span className='text-sm font-normal text-gray-medium'>
              ({totalRates}{' '}
              {totalRates > 1 ?
                t('productCardReviews')
              : t('productCardReview')}
              )
            </span>
          </div> */}
        </div>

        {/* price and add button */}
        <div className='mb-2 mt-1 flex h-[30px] items-center justify-between'>
          <div className='flex items-center justify-center gap-2.5 font-inter tracking-tight'>
            {currentPrice > 1 && (
              // <p className='text-base font-medium text-black-light'>
              <p className='text-lg font-semibold text-red-500'>
                EGP {currentPrice}
              </p>
            )}
            {currentPrice > 1 ?
              <p className='text-base font-medium leading-[18px] text-blue-sky-dark line-through'>
                EGP {priceBeforeDeduction}
              </p>
            : <p className='text-lg font-semibold text-red-500'>
                EGP {priceBeforeDeduction}
              </p>
            }
          </div>
        </div>
        <AddToCartButton productId={id} stock={stock} />
      </div>
    </Link>
  );
}

export default ProductCard;
