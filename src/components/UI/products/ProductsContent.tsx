'use client';

import ProductCard from '@/components/products/ProductCard';
import Sorter from '@/components/products/Sorter';
import { useMyContext } from '@/context/Store';
import { useUser } from '@/context/UserContext';
import { useIsMount } from '@/hooks/useIsMount';
import { useRouter } from '@/navigation';
import { fetchProducts } from '@/services/products';
import { getIdFromToken, setCookie } from '@/utils/cookieUtils';
import { getBadge } from '@/utils/getBadge';
import { Empty, message, Spin } from 'antd';
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { v4 } from 'uuid';

function ProductsContent() {
  const [messageApi, contextHolder] = message.useMessage();
  const { didMount } = useIsMount();
  const { setProductsData, productsData } = useMyContext();
  const { setUserId } = useUser();
  const locale = useLocale();
  const t = useTranslations('ProductsPage.filtersSidebar');
  const signinTranslation = useTranslations('SigninPage.content');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  // Check for Google ID token
  const googleIdToken = searchParams.get('id_token');
  const googleAccessToken = searchParams.get('access_token');

  // Check for Facebook access token
  const facebookAccessToken = searchParams.get('access_token');

  // Extract category from URL params or use default value
  const category = searchParams.get('category') ?? ''; // Get the "category" parameter from the URL
  const subCategory = searchParams.get('sub-category') ?? ''; // Get the "sub-category" parameter from the URL

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const { data: resData, error: resError } =
          await fetchProducts(category, subCategory, locale);

        if (!resData || resError) {
          console.error('Error fetching products');
          console.error(resError);
        }
        if (resData?.products?.data) {
          setProductsData(resData.products.data);
        }
      } catch (err: any) {
        setError(err);
        setProductsData([]);
      } finally {
        setLoading(false);
      }
    };

    if (didMount) {
      getProducts();
    }
  }, [category, subCategory, locale]);

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

        messageApi.error(
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
      messageApi.error(
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

        messageApi.error(
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
      messageApi.error(
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

  if (error) {
    console.log('Error fetching products');
    console.error(error);
  }

  return (
    <div>
      {contextHolder}
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
        <Spin
          size='large'
          className='mt-5 grid min-h-[500px] w-full place-content-center'
        />
      : productsData === null || productsData.length === 0 ?
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
