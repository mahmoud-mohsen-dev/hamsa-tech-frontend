'use client';

import { getQueryProductPricesAndStock } from '@/services/getProduct';
import { fetchGraphqlClient } from '@/services/graphqlCrud';
import { ProductPricesResponseType } from '@/types/getProduct';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import useSWR from 'swr';

function PriceComponent() {
  const [productDataSummary, setProductDataSummary] = useState<{
    final_product_price: number;
    price: number;
    sale_price: number;
    stock: number;
    productId: string;
  } | null>(null);
  const { product } = useParams();
  const t = useTranslations('ProductPage');

  const {
    data: productDataResponse,
    mutate: mutateProductData,
    isValidating: productIsValidating
  } = useSWR(
    product ? ['product', product] : null,
    async function getPrice() {
      if (typeof product !== 'string') return;
      const { data, error } = (await fetchGraphqlClient(
        getQueryProductPricesAndStock(product)
      )) as ProductPricesResponseType;

      const productData = data?.product?.data ?? null;

      if (
        typeof productData?.attributes?.final_product_price ===
          'number' &&
        typeof productData?.attributes?.sale_price === 'number' &&
        typeof productData?.attributes?.price === 'number' &&
        typeof productData?.attributes?.stock === 'number' &&
        productData?.id &&
        !error
      ) {
        setProductDataSummary({
          final_product_price:
            productData.attributes.final_product_price,
          price: productData.attributes.price,
          sale_price: productData.attributes.sale_price,
          stock: productData.attributes.stock,
          productId: productData.id
        });
      } else {
        console.log(data);
        console.log(error);
        setProductDataSummary(null);
      }
    },
    {
      revalidateOnFocus: true,
      revalidateIfStale: true,
      revalidateOnReconnect: true,
      refreshInterval: 1000
    }
  );

  let offPercent = 0;

  if (
    productDataSummary &&
    productDataSummary.price &&
    productDataSummary.sale_price
  ) {
    offPercent =
      ((productDataSummary.price - productDataSummary.sale_price) *
        100) /
      productDataSummary.price;
  }

  console.log(productDataSummary);
  return (
    <div className='mt-3 flex items-center gap-3 font-inter'>
      {productDataSummary && productDataSummary.sale_price > 0 && (
        <span className='text-xl font-semibold text-red-500'>
          EGP {productDataSummary.sale_price ?? 0}
        </span>
      )}

      <span
        className={`${productDataSummary && productDataSummary?.sale_price > 0 ? 'text-lg font-medium text-blue-sky-dark line-through' : 'text-xl font-semibold text-red-500'}`}
      >
        EGP {(productDataSummary && productDataSummary?.price) ?? 0}
      </span>

      {(
        productDataSummary &&
        productDataSummary?.sale_price > 0 &&
        offPercent > 10
      ) ?
        <span className='rounded border border-red-shade-350 px-3 py-1 font-sans text-base font-medium text-red-shade-300'>
          {offPercent.toFixed(2)}% {t('offText')}
        </span>
      : null}
    </div>
  );
}

export default PriceComponent;
