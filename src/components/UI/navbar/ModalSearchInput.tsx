'use client';
import { Button, Divider, Modal } from 'antd';
import { useState } from 'react';
import { FaMagnifyingGlass, FaShare } from 'react-icons/fa6';
import SearchInputField from './SearchInputField';
import Search from '@/components/common/Search';
import Image from 'next/image';
import AddToCartButton from '@/components/products/AddToCartButton';
import { useMyContext } from '@/context/Store';
import { v4 } from 'uuid';
import { Link, useRouter } from '@/navigation';
import { capitalize, trimText } from '@/utils/helpers';
import { useLocale, useTranslations } from 'next-intl';

interface ProductItemType {
  brand: { name: string; slug: string };
  id: string;
  imageThumbnail: {
    src: string | null;
    alt: string | null;
  };
  name: string;
  price: number;
  salePrice: number;
  finalPrice: number;
  loaclizationName: string | null;
  loaclizationId: string | null;
}

const ProductSearchItem = ({
  productData,
  handleOk
}: {
  productData: ProductItemType;
  handleOk: () => void;
}) => {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('NavbarDrawer.searchModal');

  const localeHref =
    locale === 'ar' ?
      productData?.id ?
        `/products/${productData.id}`
      : `/products`
    : productData?.loaclizationId ?
      `/products/${productData.loaclizationId}`
    : `/products`;

  const handleClick = () => {
    router.push(localeHref);
    handleOk();
  };
  return (
    <div className='flex w-full flex-col items-center justify-start gap-5 xs:flex-row'>
      <Image
        width={70}
        height={70}
        src={productData?.imageThumbnail?.src ?? ''}
        alt={productData?.imageThumbnail?.alt ?? ''}
      />
      <Link
        className='link-search-item w-full grow text-black-light'
        href={localeHref}
        onClick={handleOk}
      >
        <span className='brand block font-sans text-sm font-light text-black-light'>
          {locale === 'ar' ?
            (productData?.brand?.name ?? '')
          : capitalize(productData?.brand?.slug ?? '')}
        </span>
        <span className='name mb-1 mt-[2px] block font-sans text-sm font-medium text-black-medium'>
          {locale === 'ar' ?
            trimText(productData?.name ?? '')
          : trimText(productData?.loaclizationName ?? '')}
        </span>
        <span className='flex items-center gap-3'>
          <span className='font-medium text-red-500'>
            EGP{' '}
            {productData?.finalPrice > 0 ?
              productData?.finalPrice
            : 0}
          </span>
          {productData?.price > 0 && (
            <span className='font-medium text-blue-sky-dark line-through'>
              EGP {productData?.price}
            </span>
          )}
        </span>
      </Link>
      <div className='w-full xs:w-[235px]'>
        <button
          className={`before:ease relative h-10 w-full overflow-hidden rounded-md border border-green-500 bg-green-500 text-sm text-white shadow-[0_5px_25px_-10px_rgb(0,0,0,.1),0_6px_10px_-6px_rgb(0,0,0,.1)] transition-all before:absolute before:-right-[36px] before:top-0 before:h-10 before:w-6 before:bg-white before:opacity-10 before:duration-700 hover:shadow-green-500 hover:before:right-[calc(100%+36px)] hover:before:-translate-x-full disabled:cursor-not-allowed`}
          onClick={handleClick}
          dir='ltr'
        >
          <span className='relative z-10 flex items-center justify-center gap-2'>
            <span>{t('readMoreText')}</span>
            <FaShare />
          </span>
        </button>
      </div>
    </div>
  );
};

function ModalSearchInput({
  styleColor = undefined
}: {
  styleColor?: undefined | string;
}) {
  const { searchData, setSearchData, setSearchTerm } = useMyContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const t = useTranslations('NavbarDrawer.searchModal');

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    setSearchData(null);
    setSearchTerm(null);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSearchData(null);
    setSearchTerm(null);
  };

  const products = searchData?.results
    .map((searchData) =>
      searchData.indexUid === 'products' ?
        searchData.hits.map((product) => product)
      : null
    )
    .filter((product) => product);
  // console.log(products);

  const filteredProducts: ProductItemType[] | null =
    Array.isArray(products) && products.length > 0 && products[0] ?
      products[0].map((product) => {
        return {
          id: product?.id ?? null,
          brand: {
            name: product?.brand?.name ?? '',
            slug: product?.brand?.slug ?? ''
          },
          imageThumbnail: {
            src: product?.image_thumbnail?.url ?? '',
            alt: product?.image_thumbnail?.alternativeText
          },
          name: product?.name ?? '',
          price: product?.price ?? 0,
          salePrice: product?.salePrice ?? 0,
          finalPrice: product?.final_product_price ?? 0,
          loaclizationName:
            (
              product?.localizations.length > 0 &&
              product?.localizations[0]?.name
            ) ?
              product?.localizations[0].name
            : '',
          loaclizationId:
            (
              product?.localizations.length > 0 &&
              product?.localizations[0]?.id
            ) ?
              product?.localizations[0].id
            : ''
        };
      })
    : null;
  // console.log(filteredProducts);

  return (
    // <div className='modal-search-input ml-5 hidden text-inherit 2xl:block'>
    <div className='modal-search-input ml-5 text-inherit'>
      <Button
        type='link'
        onClick={showModal}
        style={
          styleColor ?
            { padding: 0, color: styleColor }
          : { padding: 0 }
        }
        className='seach-btn'
      >
        <FaMagnifyingGlass />
      </Button>

      {/* Search Modal */}
      <Modal
        title={<Search />}
        // centered
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        classNames={{
          wrapper: 'modal-search',
          header: '!mb-0 w-full',
          body: '!p-0',
          content: '!py-3 !px-5 font-inter'
        }}
        width={640}
        // className='modal-search'
      >
        {filteredProducts && filteredProducts?.length > 0 && (
          <>
            <Divider
              style={{ marginBottom: '20px', marginTop: '12px' }}
            />
            <div className='max-h-[calc(100vh-227px)] overflow-y-auto px-2 pb-4'>
              {filteredProducts && filteredProducts?.length > 0 && (
                <h4 className='mb-2 text-xs text-green-dark'>
                  {t('searchResultsText', {
                    count: filteredProducts.length
                  })}
                </h4>
              )}
              <h2 className='py-2 text-sm font-semibold'>
                {t('productsText')}
              </h2>
              <div className='flex w-full flex-col gap-6 px-2.5 py-2 md:gap-4'>
                {filteredProducts && filteredProducts?.length > 0 ?
                  filteredProducts.map((productData) => (
                    <ProductSearchItem
                      key={v4()}
                      productData={productData}
                      handleOk={handleOk}
                    />
                  ))
                : <p>{t('noResultsText')}</p>}
              </div>
              {/* <h2 className='py-2'>Articles</h2>
          <p>No data for articles</p> */}
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

export default ModalSearchInput;
