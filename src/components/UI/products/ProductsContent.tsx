'use client';

import ProductCard from '@/components/products/ProductCard';
import Sorter from '@/components/products/Sorter';
import { useMyContext } from '@/context/Store';
import { useUser } from '@/context/UserContext';
import { usePathname, useRouter } from '@/navigation';
import { fetchProducts } from '@/services/products';
import { getIdFromToken, setCookie } from '@/utils/cookieUtils';
import { getBadge } from '@/utils/getBadge';
import { Empty, Pagination, Skeleton, Spin } from 'antd';
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { PaginationProps } from 'antd';
import { v4 } from 'uuid';
import { FaFilter } from 'react-icons/fa6';
import Btn from '../Btn';
import useSWR from 'swr';

function ProductsContent() {
  // const { didMount } = useIsMount();

  const {
    setProductsData,
    productsData,
    completeProductsApiData,
    setCompleteProductsApiData,
    // globaLoading,
    // setGlobalLoading,
    setToggleFilters,
    setErrorMessage
  } = useMyContext();
  const [contentIsLoading, setContentIsLoading] = useState(true);

  const { setUserId } = useUser();
  const locale = useLocale();
  const t = useTranslations('ProductsPage.filtersSidebar');
  const signinTranslation = useTranslations('SigninPage.content');
  const [error, setError] = useState(null);
  // const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const params = new URLSearchParams(searchParams.toString());
  const pathname = usePathname();
  // Check for Google ID token
  const googleIdToken = searchParams.get('id_token');
  const googleAccessToken = searchParams.get('access_token');

  // Check for Facebook access token
  const facebookAccessToken = searchParams.get('access_token');
  const pageSize = searchParams.get('page-size'); // Get the "page-size" parameter from the URL

  // Extract category from URL params or use default value
  const category = searchParams.get('category') ?? ''; // Get the "category" parameter from the URL
  const subCategory = searchParams.get('sub-category') ?? ''; // Get the "sub-category" parameter from the URL

  const paramsPage = searchParams.get('page'); // Get the "page" parameter from the URL
  const paramsSortBy = params.get('sort-by'); // Get the "sort-by" parameter from the URL
  const paramsPageSize = params.get('page-size'); // Get the "page-size" parameter from the URL

  const brandParams = params.get('brands');
  const priceMinParams = params.get('price-min');
  const priceMaxParams = params.get('price-max');
  const ratesParams = params.get('rates');

  // console.log(completeProductsApiData);

  const getProducts = async () => {
    try {
      // setLoading(true);
      setContentIsLoading(true);
      const { data: resData, error: resError } = await fetchProducts(
        category,
        subCategory,
        locale,
        paramsPage === null ? null : Number(paramsPage),
        paramsPageSize === null ? null : Number(paramsPageSize),
        paramsSortBy,
        brandParams === null ? null : brandParams.split(','),
        priceMinParams === null || priceMaxParams === null ?
          null
        : [Number(priceMinParams), Number(priceMaxParams)],
        ratesParams === null ? null : (
          ratesParams.split(',').map((rate) => Number(rate))
        )
      );

      // console.log(resData);

      if (!resData || resError) {
        console.error('Error fetching products');
        console.error(resError);
        return;
      }
      if (resData?.products?.data) {
        setCompleteProductsApiData(resData.products);
        setProductsData(resData.products.data);
      }
    } catch (err: any) {
      setCompleteProductsApiData(null);
      setError(err);
      setProductsData([]);
    } finally {
      // setLoading(false);
      setContentIsLoading(false);
    }
  };

  // useEffect(() => {
  //   if (didMount) {
  //     getProducts();
  //   }
  // }, []);

  useEffect(() => {
    // if (!didMount) {
    getProducts();
    // }
  }, [
    category,
    subCategory,
    locale,
    paramsPage,
    paramsPageSize,
    paramsSortBy,
    brandParams,
    priceMinParams,
    priceMaxParams,
    ratesParams
  ]);
  useSWR(
    paramsPage ?
      [
        `products-${category ?? null}-${subCategory ?? null}-${locale ?? 'en'}-${paramsPage ?? null}-${paramsPageSize ?? 'en'}-${paramsSortBy ?? 'asc'}-${brandParams ?? null}-${priceMinParams ?? null}-${priceMaxParams ?? null}-${ratesParams ?? null}`,
        paramsPage
      ]
    : null,
    () => {
      getProducts();
    }
    // {
    //   revalidateOnFocus: true,
    //   revalidateIfStale: true,
    //   revalidateOnReconnect: true
    // }
  );

  const fetchGoogleCallback = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/google/callback?access_token=${googleAccessToken}`
      );
      console.warn(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/google/callback?access_token=${googleAccessToken}`
      );
      const data = await response.json();
      if (response.ok && data && data?.jwt) {
        const jwt = data.jwt; // Extract only the jwt from the response
        // console.warn('JWT Token:', jwt);
        setCookie('token', jwt, 1);
        const id = getIdFromToken();
        setUserId(id);

        return jwt;
      } else {
        console.error('Failed to fetch JWT:', data?.error?.message);

        setErrorMessage(
          data?.error?.message === 'Email is already taken.' ?
            signinTranslation(
              'formValidationErrorMessages.emailTakenMessage'
            )
          : (data?.error?.message ??
              signinTranslation(
                'formValidationErrorMessages.signinFailedMessage'
              ))
        );
      }
    } catch (error: any) {
      console.error(error?.message ?? 'server error');
      setErrorMessage(
        error?.message === 'Email is already taken.' ?
          signinTranslation(
            'formValidationErrorMessages.emailTakenMessage'
          )
        : (error?.message ??
            signinTranslation(
              'formValidationErrorMessages.signinFailedMessage'
            ))
      );
    } finally {
      router.replace('/products');
    }
  };

  const fetchFacebookCallback = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/facebook/callback?access_token=${facebookAccessToken}`
      );
      console.warn(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/facebook/callback?access_token=${facebookAccessToken}`
      );
      const data = await response.json();
      if (response.ok && data?.jwt) {
        const jwt = data.jwt; // Extract only the jwt from the response
        // console.warn('JWT Token:', jwt);
        setCookie('token', jwt, 1);
        const id = getIdFromToken();
        setUserId(id);
        router.replace('/products');
        return jwt;
      } else {
        console.error('Failed to fetch JWT:', data?.error?.message);

        setErrorMessage(
          data?.error?.message === 'Email is already taken.' ?
            signinTranslation(
              'formValidationErrorMessages.emailTakenMessage'
            )
          : (data?.error?.message ??
              signinTranslation(
                'formValidationErrorMessages.signinFailedMessage'
              ))
        );
      }
    } catch (error: any) {
      console.error(error?.message ?? 'server error');
      setErrorMessage(
        error?.message === 'Email is already taken.' ?
          signinTranslation(
            'formValidationErrorMessages.emailTakenMessage'
          )
        : (error?.message ??
            signinTranslation(
              'formValidationErrorMessages.signinFailedMessage'
            ))
      );
    } finally {
      router.replace('/products');
    }
  };

  const onPaginationChange: PaginationProps['onChange'] = (
    pageNumber: number
  ) => {
    // console.log('Page: ', pageNumber);
    params.set('page', pageNumber.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleParamsPage = (pageNumber: number) => {
    // console.log('Page: ', pageNumber);
    params.set('page', pageNumber.toString());
  };

  useEffect(() => {
    // Handle Google sign-in
    if (googleIdToken && googleAccessToken) {
      fetchGoogleCallback();
    }
    // Handle Facebook sign-in
    else if (facebookAccessToken) {
      fetchFacebookCallback();
    }
  }, [searchParams]);

  useEffect(() => {
    if (!paramsPage) {
      handleParamsPage(1);
    }
    if (!paramsSortBy) {
      params.set('sort-by', 'featured');
    }
    if (!paramsPageSize) {
      params.set('page-size', '20');
    }
    if (!paramsPage || !paramsSortBy || !paramsPageSize) {
      // console.log(params.toString());
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, []);

  if (error) {
    console.log('Error fetching products');
    console.error(error);
  }

  return (
    <div>
      {/* {contextHolder} */}
      <div className='flex flex-wrap items-center justify-between gap-4'>
        {contentIsLoading ?
          <>
            <div>
              <Skeleton.Node
                active={true}
                style={{
                  width: '135px',
                  height: '32px',
                  borderRadius: '6px'
                }}
              />
            </div>
            <div className='flex items-center gap-5'>
              <Skeleton.Node
                active={true}
                style={{
                  width: '120px',
                  height: '32px',
                  borderRadius: '6px'
                }}
              />
              <Skeleton.Node
                active={true}
                style={{
                  width: '220px',
                  height: '32px',
                  borderRadius: '6px'
                }}
              />
            </div>
          </>
        : <>
            <h4 className='text-sm font-medium text-black-medium'>
              {/* {data?.children?.length ?? 0}{' '} */}
              <span className='text-gray-normal'>
                {t(`foundItems`, {
                  count:
                    completeProductsApiData?.meta?.pagination?.total ?
                      completeProductsApiData?.meta?.pagination?.total
                    : productsData.length > 0 ? productsData.length
                    : 0
                })}
              </span>
            </h4>
            <Sorter />
          </>
        }
      </div>
      <Btn
        className='mt-3 flex items-center gap-2 bg-black-medium text-sm text-white lg:hidden'
        onClick={() => setToggleFilters((prev) => !prev)}
      >
        <span>{t('filteringButtonText')}</span>
        <FaFilter />
      </Btn>

      {/* {true ? */}
      {/* // <Spin */}
      {/* //   size='large'
        //   className='min-h-[500px] w-full place-content-center'
        //   style={{ display: 'grid' }}
        // /> */}
      {contentIsLoading ?
        <div className='mt-5 grid gap-4 xl:grid-cols-2 2xl:grid-cols-3 4xl:grid-cols-4'>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => {
            return (
              <div
                key={item}
                className='min-w-[260px] overflow-hidden rounded-lg border border-gray-200'
              >
                <Skeleton.Image
                  active={true}
                  style={{
                    width: '100%',
                    height: '160px',
                    borderRadius: '0px'
                  }}
                  rootClassName='loading-product-image'
                />
                <div className='mt-2 w-full p-5'>
                  <Skeleton.Node
                    active={true}
                    style={{ width: '50%', height: '12px' }}
                    rootClassName='loading-node'
                  />
                  <Skeleton.Node
                    active={true}
                    style={{ width: '100%', height: '12px' }}
                    rootClassName='loading-node'
                  />
                  <Skeleton.Node
                    active={true}
                    style={{ width: '100%', height: '12px' }}
                    rootClassName='loading-node'
                  />
                  <Skeleton.Node
                    active={true}
                    style={{ width: '30%', height: '12px' }}
                    rootClassName='loading-node'
                  />
                </div>
                <div className='w-full px-5 pb-5'>
                  <Skeleton.Button
                    active={true}
                    size={'large'}
                    shape={'square'}
                    block={true}
                  />
                </div>
              </div>
            );
          })}
        </div>
      : productsData === null || productsData.length === 0 ?
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className='mt-5 grid min-h-[500px] w-full place-content-center'
        />
      : <>
          <div className='mt-5 grid gap-4 xl:grid-cols-2 2xl:grid-cols-3 4xl:grid-cols-4'>
            {productsData &&
              productsData?.length > 0 &&
              productsData.map((product) => {
                return (
                  <ProductCard
                    id={product.id}
                    localeParentName={
                      product?.attributes?.locale ?? ''
                    }
                    localeChildName={
                      product?.attributes?.localizations?.data[0]
                        ?.attributes?.locale ?? ''
                    }
                    localeChildId={
                      product?.attributes?.localizations?.data[0]
                        ?.id ?? ''
                    }
                    title={product?.attributes?.name ?? ''}
                    alt={
                      product?.attributes?.image_thumbnail?.data
                        ?.attributes?.alternativeText ?? ''
                    }
                    imgSrc={
                      product?.attributes?.image_thumbnail?.data
                        ?.attributes?.url ?? ''
                    }
                    // avgRate={
                    //   product?.attributes?.average_reviews ?? 0
                    // }
                    category={
                      product?.attributes?.sub_category?.data
                        ?.attributes?.name ?? ''
                    }
                    modalName={product?.attributes?.modal_name ?? ''}
                    badge={getBadge(
                      locale,
                      product?.attributes?.updatedAt,
                      product?.attributes?.stock,
                      product?.attributes?.price,
                      product?.attributes?.sale_price
                    )}
                    brand={
                      product?.attributes?.brand?.data?.attributes
                        ?.name ?? ''
                    }
                    priceBeforeDeduction={
                      product?.attributes?.price ?? 0
                    }
                    currentPrice={
                      product?.attributes?.sale_price ?? 0
                    }
                    finalProductPrice={
                      product?.attributes?.final_product_price ?? 0
                    }
                    linkSrc={`/products/${product.id}`}
                    // finalPackageWeight={
                    //   product?.attributes?.finalPackageWeight ?? null
                    // }
                    // totalRates={
                    //   product?.attributes?.total_reviews ?? 0
                    // }
                    stock={product?.attributes?.stock ?? 0}
                    key={v4()}
                  />
                );
              })}
          </div>
          <Pagination
            align='center'
            className={locale === 'ar' ? 'pagination-in-arabic' : ''}
            defaultCurrent={1}
            current={
              (
                Number(paramsPage) > 0 &&
                completeProductsApiData?.meta?.pagination
                  ?.pageCount &&
                Number(paramsPage) <=
                  completeProductsApiData.meta.pagination.pageCount
              ) ?
                Number(paramsPage)
              : (function () {
                  setTimeout(() => {
                    handleParamsPage(1);
                  }, 2500);
                  return 1;
                })()
            }
            total={
              completeProductsApiData?.meta?.pagination?.total ?
                completeProductsApiData.meta.pagination.total
              : 1
            }
            pageSize={Number(pageSize) > 0 ? Number(pageSize) : 20}
            onChange={onPaginationChange}
            style={{ marginTop: 40 }}
            showSizeChanger={false}
          />
        </>
      }
    </div>
  );
}

export default ProductsContent;
