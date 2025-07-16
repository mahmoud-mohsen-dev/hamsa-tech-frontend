'use client';

import { getQueryProductPricesAndStock } from '@/services/getProduct';
import { fetchGraphqlClient } from '@/services/graphqlCrud';
import { ProductPricesResponseType } from '@/types/getProduct';
import { useLocale, useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import OrderProduct from './OrderProduct';
import { useRouter } from '@/navigation';

interface ProductDataSummary {
  final_product_price: number | null;
  price: number | null;
  sale_price: number | null;
  stock: number | null;
  productId: string;
  localizations: {
    data:
      | {
          id: string;
          attributes: {
            locale: string;
          };
        }[]
      | null;
  } | null;
  locale: string | null;
  finalPackageWeight: number | null;
}

function PriceComponent({
  ProductDataSummaryProps = null
}: {
  ProductDataSummaryProps: ProductDataSummary | null;
}) {
  const [productDataSummary, setProductDataSummary] =
    useState<ProductDataSummary | null>(ProductDataSummaryProps);
  const { product } = useParams();
  const locale = useLocale();
  const t = useTranslations('ProductPage');
  const router = useRouter();

  useSWR(
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
          productId: productData.id,
          finalPackageWeight:
            productData.attributes.final_package_weight_in_grams,
          localizations: productData.attributes.localizations,
          locale: productData.attributes.locale
        });
      } else {
        console.log(data);
        console.log(error);
        setProductDataSummary(null);
      }

      router.refresh();
    },
    {
      refreshInterval: 60000
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

    offPercent = Math.floor(offPercent);
  }

  console.log(productDataSummary);
  return (
    <>
      <div className='mt-3 flex items-center gap-3 font-inter'>
        {productDataSummary &&
          productDataSummary?.sale_price &&
          productDataSummary?.sale_price > 0 && (
            <span className='text-xl font-semibold text-red-500'>
              EGP {productDataSummary.sale_price ?? 0}
            </span>
          )}

        <span
          className={`${
            (
              productDataSummary &&
              productDataSummary?.price &&
              productDataSummary?.price > 0
            ) ?
              'text-lg font-medium text-blue-sky-dark line-through'
            : 'text-xl font-semibold text-red-500'
          }`}
        >
          EGP {(productDataSummary && productDataSummary?.price) ?? 0}
        </span>

        {(
          productDataSummary &&
          productDataSummary?.sale_price &&
          productDataSummary?.sale_price > 0 &&
          offPercent > 10
        ) ?
          <span className='rounded border border-red-shade-350 px-3 py-1 font-sans text-base font-medium text-red-shade-300'>
            <span
              className={`${locale === 'ar' ? 'ml-[2px]' : 'mr-[2px]'}`}
            >
              {offPercent}
            </span>
            % {t('offText')}
          </span>
        : null}
      </div>
      {productDataSummary?.stock && productDataSummary?.stock > 0 ?
        <h4 className='my-2 flex items-center gap-2 text-base font-normal'>
          <span className='text-blue-gray-medium'>
            {t('availabilityText')}:
          </span>
          <span
            className={`font-semibold ${productDataSummary?.stock && productDataSummary?.stock > 0 ? 'text-green-dark' : 'text-red-shade-250'}`}
          >
            {productDataSummary?.stock ?? 0}
          </span>
          <span className='text-blue-gray-medium'>
            {t('stockText')}
          </span>
        </h4>
      : null}

      {/* I add some default values in falsy condition but I didn't check if it behave as expected or not */}
      {productDataSummary?.stock && productDataSummary?.stock > 0 ?
        <OrderProduct
          productInfo={{
            id: productDataSummary?.productId ?? null,
            stock: productDataSummary?.stock ?? null,
            final_product_price:
              productDataSummary?.final_product_price ?? null,
            finalPackageWeight:
              productDataSummary?.finalPackageWeight ?? null
          }}
          maxQuantity={productDataSummary?.stock ?? 0}
          minQuantity={productDataSummary?.stock > 0 ? 1 : 0}
          localeParentName={productDataSummary?.locale ?? ''}
          localeChildName={
            (
              productDataSummary?.localizations?.data &&
              productDataSummary?.localizations?.data[0]?.attributes
                ?.locale
            ) ?
              productDataSummary?.localizations?.data[0]?.attributes
                ?.locale
            : ''
          }
          localeChildId={
            (
              productDataSummary?.localizations?.data &&
              productDataSummary?.localizations?.data[0]?.id
            ) ?
              productDataSummary?.localizations?.data[0]?.id
            : ''
          }
        />
      : null}
    </>
  );
}

export default PriceComponent;
