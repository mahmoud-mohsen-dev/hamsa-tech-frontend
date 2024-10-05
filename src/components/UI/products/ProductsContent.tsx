'use client';

// import Loading from '@/app/loading';
import ProductCard from '@/components/products/ProductCard';
import Sorter from '@/components/products/Sorter';
import { useMyContext } from '@/context/Store';
import { useIsMount } from '@/hooks/useIsMount';
import { fetchProducts } from '@/services/products';
// import { getProductsCategory } from '@/services/products';
// import { productsObjectType } from '@/types';
// import { ProductType } from '@/types/getProducts';
import { getBadge } from '@/utils/getBadge';
// import { isNewProduct } from '@/utils/productCardHelper';
import { Empty, Spin } from 'antd';
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { v4 } from 'uuid';

function ProductsContent() {
  const { didMount } = useIsMount();
  const { setProductsData, productsData } = useMyContext();
  const locale = useLocale();
  const t = useTranslations('ProductsPage.filtersSidebar');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  // const [data, setData] = useState<ProductType[] | null>(
  //   serverProductsData
  // );
  // const firstRender = useRef(0);
  // console.log(productsData);

  // Extract category from URL params or use default value
  const category = useSearchParams().get('category') ?? ''; // Get the "category" parameter from the URL
  const subCategory = useSearchParams().get('sub-category') ?? ''; // Get the "sub-category" parameter from the URL

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const { data: resData, error: resError } =
          await fetchProducts(category, subCategory, locale);
        // console.log('fetching data in the client...');

        if (!resData || resError) {
          console.error('Error fetching products');
          console.error(resError);
        }
        if (resData?.products?.data) {
          setProductsData(resData.products.data);
        }

        // setData(resData ?? null);
      } catch (err: any) {
        setError(err);
        setProductsData([]);
        // setData(null);
      } finally {
        setLoading(false);
      }
    };

    if (didMount) {
      getProducts();
    }
    // }
    // firstRender.current += 1;
  }, [category, subCategory, locale]);

  // useEffect(() => {
  //   if (
  //     firstRender.current === 0 &&
  //     serverProductsData &&
  //     serverProductsData?.length > 0
  //   ) {
  //     console.log(firstRender.current);
  //     setProductsData(serverProductsData);
  //   }
  // }, []);

  if (error) {
    console.log('Error fetching products');
    console.error(error);
  }

  // console.log(data);
  // console.log(firstRender.current);
  return (
    <div>
      <div className='flex items-center justify-between'>
        <h4 className='text-sm font-medium text-black-medium'>
          {/* {data?.children?.length ?? 0}{' '} */}
          <span className='text-gray-normal'>
            {t(`foundItems`, { count: productsData.length ?? 0 })}
          </span>
        </h4>
        <Sorter />
      </div>

      {loading ?
        // || (firstRender.current === 0 && productsData.length === 0)
        <Spin
          size='large'
          className='mt-5 grid min-h-[500px] w-full place-content-center'
        />
      : productsData === null || productsData.length === 0 ?
        //  &&
        // firstRender.current !== 0
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className='mt-5 grid min-h-[500px] w-full place-content-center'
        />
      : <div className='mt-5 grid grid-cols-3 gap-4'>
          {productsData &&
            productsData?.length > 0 &&
            productsData.map((product) => {
              return (
                <ProductCard
                  id={product.id}
                  title={product?.attributes?.name ?? ''}
                  alt={
                    product?.attributes?.image_thumbnail?.data
                      ?.attributes?.alternativeText ?? ''
                  }
                  imgSrc={
                    product?.attributes?.image_thumbnail?.data
                      ?.attributes?.url ?? ''
                  }
                  avgRate={product?.attributes?.average_reviews ?? 0}
                  category={
                    product?.attributes?.sub_category?.data
                      ?.attributes?.name ?? ''
                  }
                  badge={getBadge(
                    locale,
                    product?.attributes?.updatedAt,
                    product?.attributes?.stock,
                    product?.attributes?.price,
                    product?.attributes?.sale_price
                  )}
                  priceBeforeDeduction={
                    product?.attributes?.price ?? 0
                  }
                  currentPrice={product?.attributes?.sale_price ?? 0}
                  linkSrc={`/products/${product.id}`}
                  totalRates={product?.attributes?.total_reviews ?? 0}
                  stock={product?.attributes?.stock ?? 0}
                  key={v4()}
                />
              );
            })}
        </div>
      }
    </div>
  );
}

export default ProductsContent;
