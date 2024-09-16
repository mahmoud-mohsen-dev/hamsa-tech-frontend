'use client';

// import Loading from '@/app/loading';
import ProductCard from '@/components/products/ProductCard';
import Sorter from '@/components/products/Sorter';
// import { getProductsCategory } from '@/services/products';
import { productsObjectType } from '@/types';
import { Spin } from 'antd';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { v4 } from 'uuid';

function ProductsContent() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<productsObjectType | null>(null);

  // console.log(data.data);
  // Extract category from URL params or use default value
  const category = useSearchParams().get('category') ?? ''; // Get the "category" parameter from the URL
  //   console.log(category);
  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        // const { data: resData, error: resError } =
        // await getProductsCategory(category);
        // if (!resData || resError) {
        //   throw new Error(
        //     resError.message || 'Error fetching products'
        //   );
        // }
        // console.log(resData);
        // console.log(resData, 'error');
        // setData({ ...resData } ?? {});
        setLoading(false);
      } catch (err: any) {
        setError(err);
        setData(null);
      }
    };
    getProducts();
  }, [category]);

  if (error) {
    return (
      <section>
        <div className='mt-5'>Error fetching products</div>
      </section>
    );
  }

  console.log(data);
  console.log(error);
  return (
    <div>
      <div className='flex items-center justify-between'>
        <h4 className='text-sm font-medium text-black-medium'>
          {data?.children?.length ?? 0}{' '}
          <span className='text-gray-normal'>Products Found</span>
        </h4>
        <Sorter />
      </div>

      {loading ?
        <Spin
          size='large'
          className='mt-5 grid min-h-[500px] w-full place-content-center'
        />
      : <div className='mt-5 grid grid-cols-3 gap-4'>
          {data?.children &&
            data.children.length > 0 &&
            data.children.map((product) => {
              return (
                <ProductCard
                  title={product.productName}
                  alt={product.alt}
                  imgSrc={product.imgSrc}
                  avgRate={product.averageRate}
                  category={data.subCategoryName ?? ''}
                  badge={product.badge}
                  priceBeforeDeduction={product.priceBeforeDeduction}
                  currentPrice={product.currentPrice}
                  linkSrc={`/products/${product.id}`}
                  totalRates={product.totalNumberOfRates}
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
