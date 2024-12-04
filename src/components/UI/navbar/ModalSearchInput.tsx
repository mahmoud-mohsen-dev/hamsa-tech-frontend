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
  stock: number;
}

const ProductSearchItem = ({
  productData,
  handleOk
}: {
  productData: ProductItemType;
  handleOk: () => void;
}) => {
  const router = useRouter();
  const handleClick = () => {
    router.push(
      productData?.id ? `/products/${productData.id}` : `/products`
    );
    handleOk();
  };
  return (
    <div className='flex w-full items-center justify-start gap-5'>
      <Image
        width={70}
        height={70}
        src={productData?.imageThumbnail?.src ?? ''}
        alt={productData?.imageThumbnail?.alt ?? ''}
      />
      <Link
        className='w-full grow text-black-light hover:text-black-medium hover:underline'
        href={
          productData?.id ?
            `/products/${productData.id}`
          : `/products`
        }
        onClick={handleOk}
      >
        <span className='block text-sm font-light text-black-light'>
          {productData?.brand?.name ?? ''}
        </span>
        <span className='mb-1 mt-[2px] block text-base font-medium text-black-medium'>
          {productData?.name ?? ''}
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
      <div className='w-[235px]'>
        <button
          className={`before:ease relative h-10 ${productData?.stock > 0 ? 'border-green-500 bg-green-500 hover:shadow-green-500' : 'border-green-300 bg-green-300 hover:shadow-green-300'} w-full overflow-hidden rounded-md border text-sm text-white transition-all before:absolute before:-right-[36px] before:top-0 before:h-10 before:w-6 before:bg-white before:opacity-10 before:duration-700 disabled:cursor-not-allowed ${productData?.stock > 0 ? 'shadow-[0_5px_25px_-10px_rgb(0,0,0,.1),0_6px_10px_-6px_rgb(0,0,0,.1)] hover:before:right-[calc(100%+36px)] hover:before:-translate-x-full' : 'opacity-60'}`}
          onClick={handleClick}
          dir='ltr'
        >
          <span className='relative z-10 flex items-center justify-center gap-2'>
            <span>Read more</span>
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
  const { searchData } = useMyContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const products = searchData?.results
    .map((searchData) =>
      searchData.indexUid === 'product' ?
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
          stock: product?.stock ?? 0
        };
      })
    : null;
  // console.log(filteredProducts);

  return (
    <div className='modal-search-input ml-5 hidden text-inherit 2xl:block'>
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
            <div className='h-[calc(100vh-373px)] overflow-y-auto px-2 pb-4'>
              {filteredProducts && filteredProducts?.length > 0 && (
                <h4 className='mb-2 text-xs text-green-dark'>
                  Found {filteredProducts.length} items
                </h4>
              )}
              <h2 className='py-2 text-sm font-semibold'>Products</h2>
              <div className='flex w-full flex-col gap-4 px-2.5 py-2'>
                {filteredProducts && filteredProducts?.length > 0 ?
                  filteredProducts.map((productData) => (
                    <ProductSearchItem
                      key={v4()}
                      productData={productData}
                      handleOk={handleOk}
                    />
                  ))
                : <p>No data</p>}
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
