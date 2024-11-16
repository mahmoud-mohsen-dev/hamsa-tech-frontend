// import NotFound from '@/app/not-found';
// import ProductBreadcrumb from '@/components/UI/products/product/ProductBreadcrumb';
import { fetchGraphql } from '@/services/graphqlCrud';
import {
  NextProductResponseType,
  ProductResponseType
} from '@/types/getProduct';
import {
  getTranslations,
  unstable_setRequestLocale
} from 'next-intl/server';
import {
  FaAddressBook,
  FaBook,
  FaFacebookF,
  FaInstagram,
  FaSitemap,
  FaWhatsapp
} from 'react-icons/fa6';
import { PiSecurityCameraDuotone } from 'react-icons/pi';
import { HomeOutlined, ProductOutlined } from '@ant-design/icons';
import CustomBreadcrumb from '@/components/products/CustomBreadcrumb';
import { FaBox } from 'react-icons/fa';
import { notFound } from 'next/navigation';
import ProductSlider from '@/components/productPage/ProductSlider';
import { Divider, Rate } from 'antd';
import OrderProduct from '@/components/productPage/OrderProduct';
import Info from '@/components/productPage/Info';
import { Link } from '@/navigation';
import { RiTwitterXLine } from 'react-icons/ri';
import Btn from '@/components/UI/Btn';
import ProductCard from '@/components/products/ProductCard';
import { v4 } from 'uuid';
import { getBadge } from '@/utils/getBadge';
import TabsSection from '@/components/productPage/TabsSection';
import { pdf } from '@react-pdf/renderer';
import DownloadBtn from '@/components/UI/DownloadBtn';
import { getQueryProductPage } from '@/services/getProduct';

const getItems = (
  allProductsText: string,
  categoryName: string,
  categorySlug: string,
  subCategoryName: string,
  subCategorySlug: string,
  productName: string,
  productSlug: string
) => {
  const items = [
    {
      href: '/',
      title: <HomeOutlined />
    },
    {
      href: '/products',
      title: (
        <>
          <ProductOutlined />
          <span>{allProductsText}</span>
        </>
      )
    }
  ];

  if (
    categoryName &&
    subCategoryName &&
    productName &&
    categorySlug &&
    subCategorySlug &&
    productSlug
  ) {
    items.push({
      href: `/products?${new URLSearchParams({ category: categorySlug })}`,
      title: (
        <div className='flex items-center gap-2'>
          <FaSitemap />
          <span>{categoryName}</span>
        </div>
      )
    });
    items.push({
      href: `/products?${new URLSearchParams({ 'category': categorySlug, 'sub-category': subCategorySlug })}`,
      title: (
        <div className='flex items-center gap-2'>
          <FaBox />
          <span>{subCategoryName}</span>
        </div>
      )
    });
    items.push({
      href: `/products/${String(productSlug)}`,
      title: (
        <div className='flex items-center gap-2'>
          <PiSecurityCameraDuotone />
          <span>{productName}</span>
        </div>
      )
    });
    return items;
  }

  return items;
};

export default async function Product({
  params: { product, locale }
}: {
  params: { product: string; locale: string };
}) {
  // Enable static rendering
  unstable_setRequestLocale(locale);
  const t = await getTranslations('ProductPage');
  //   const { product } = params;
  //   const { data: productData, error } =
  //     await serverGetProduct(product);

  const response = (await fetchGraphql(
    getQueryProductPage(product)
  )) as ProductResponseType;
  // console.log(JSON.stringify(response));
  const { data: productResData, error: productError } = response;
  const productData =
    productResData?.product?.data?.attributes || null;

  if (!productResData || !productData || productError) {
    console.log(productResData);
    console.log(productData);
    console.log(productError);
    notFound();
  }

  const relatedProducts = [
    productData?.related_product_1?.data,
    productData?.related_product_2?.data,
    productData?.related_product_3?.data,
    productData?.related_product_4?.data
  ];

  const offPercent =
    ((productData?.price - productData?.sale_price) * 100) /
    productData?.price;

  return (
    <>
      <div id='product-page'>
        <div className='container pb-[50px]'>
          <CustomBreadcrumb
            items={getItems(
              t('breadcrumb.all'),
              productData?.sub_category?.data?.attributes?.category
                ?.data?.attributes?.name,
              productData?.sub_category?.data?.attributes?.category
                ?.data?.attributes?.slug,
              productData?.sub_category?.data?.attributes?.name,
              productData?.sub_category?.data?.attributes?.slug,
              productData?.name,
              productResData?.product.data.id
            )}
          />
          <section
            className={`mx-2 mt-5 grid items-start 2xl:grid-cols-2 2xl:gap-2`}
          >
            <ProductSlider
              productData={productData}
              currentId={productResData?.product?.data?.id ?? 0}
              nextId={productData?.localizations?.data[0]?.id ?? 0}
            />
            <div className='mt-5 2xl:mt-0'>
              {/* Basic Data */}
              <section>
                <h4 className='capitalize text-blue-dark'>
                  {productData?.sub_category?.data?.attributes
                    ?.name ?? ''}
                </h4>
                <h2 className='mt-3 text-3xl font-semibold capitalize text-black-medium'>
                  {productData?.name}
                </h2>
                <h4 className='mt-5 text-sm font-normal text-gray-500 sm:text-base md:text-xl'>
                  {productData?.description}
                </h4>
                <div className='mt-5 flex items-center gap-2'>
                  <Rate
                    defaultValue={productData?.average_reviews ?? 0}
                    disabled
                  />
                  <h6 className='text-sm font-medium text-blue-dark'>
                    ({productData?.total_reviews ?? 0}{' '}
                    {t('reviewsText')})
                  </h6>
                </div>

                <div className='mt-3 flex items-center gap-2'>
                  {productData?.sale_price > 0 && (
                    <span className='text-base font-medium text-black-light'>
                      EGP {productData?.sale_price ?? 0}
                    </span>
                  )}
                  <span
                    className={`font-medium ${productData?.sale_price > 0 ? 'text-sm text-gray-500 line-through' : 'text-base text-black-light'}`}
                  >
                    EGP {productData?.price ?? 0}
                  </span>
                  {productData?.sale_price > 0 && offPercent > 10 ?
                    <span className='text-sm text-red-shade-300'>
                      {offPercent.toFixed(2)}% {t('offText')}
                    </span>
                  : null}
                </div>
                <h4 className='my-2 flex items-center gap-2 text-sm font-normal'>
                  {productData?.stock > 0 ?
                    <>
                      <span className='text-blue-gray-medium'>
                        {t('availabilityText')}:
                      </span>
                      <span className='text-green-medium'>
                        {productData?.stock}
                      </span>
                      <span className='text-blue-gray-medium'>
                        {t('stockText')}
                      </span>
                    </>
                  : <span className='font-semibold text-red-shade-350'>
                      {t('outOfStockText')}
                    </span>
                  }
                </h4>
                <OrderProduct
                  productId={product}
                  maxQuantity={productData?.stock ?? 0}
                  minQuantity={productData?.stock > 1 ? 1 : 0}
                  localeParentName={productData?.locale}
                  localeChildName={
                    productData?.localizations?.data[0]?.attributes
                      ?.locale
                  }
                  localeChildId={
                    productData?.localizations?.data[0]?.id ?? ''
                  }
                />
                <div className='mt-4 text-sm capitalize text-gray-medium'>
                  <p>-&nbsp;&nbsp;&nbsp;&nbsp;{t('deliveryText')}</p>
                  <p className='mt-1'>
                    -&nbsp;&nbsp;&nbsp;&nbsp;{t('returnText')}
                  </p>
                </div>
              </section>
              <Divider className='bg-gray-lighter' />

              {/* Product Info */}
              {/* ============================= */}
              <section>
                <Info
                  infoKey={`${t('brandText')}:`}
                  value={
                    productData?.brand?.data?.attributes?.name ?? ''
                  }
                />
                <Info
                  infoKey={`${t('skuText')}:`}
                  value={productResData?.product?.data?.id ?? ''}
                  isCapitalized={false}
                />
                <Info
                  infoKey={`${t('connectivityText')}:`}
                  value={productData?.connectivity ?? ''}
                />
                <Info
                  infoKey={`${t('modalNameText')}:`}
                  value={productData?.modal_name ?? ''}
                  isCapitalized={false}
                />
                <Info
                  infoKey={`${t('warantyText')}:`}
                  value={
                    productData?.waranty?.data?.attributes?.title ??
                    ''
                  }
                />
                {productData?.tags?.data.length > 0 && (
                  <Info
                    infoKey={`${t('tagsText')}:`}
                    value={productData?.tags?.data.map(
                      (tag, i, arr) => (
                        <div
                          className='flex flex-wrap items-center'
                          key={tag?.id}
                        >
                          <Link
                            href={tag?.attributes?.slug ?? '/'}
                            className='transition-colors duration-150 ease-out hover:text-yellow-medium'
                          >
                            {tag?.attributes?.name ?? ''}
                          </Link>
                          {i < arr.length - 1 && (
                            <span className='mr-2'>,</span>
                          )}
                        </div>
                      )
                    )}
                  />
                )}
                <Info
                  infoKey={`${t('shareText')}:`}
                  // className='mb-[50px]'
                  value={
                    <div className='flex flex-wrap items-center gap-3'>
                      <Link
                        href={
                          'https://www.facebook.com/sharer/sharer.php?u=https://hamsatech-eg.com'
                        }
                        target='_blank'
                        className='rounded-[4px] bg-blue-sky-ultralight p-2 transition-colors duration-150 ease-out hover:text-blue-accent'
                      >
                        <FaFacebookF size={20} />
                      </Link>
                      <Link
                        href={
                          'href="https://twitter.com/intent/tweet?original_referer=https://hamsatech-eg.com'
                        }
                        target='_blank'
                        className='rounded-[4px] bg-blue-sky-ultralight p-2 transition-colors duration-150 ease-out hover:text-blue-accent'
                      >
                        <RiTwitterXLine size={20} />
                      </Link>
                      <Link
                        href={'https://www.instagram.com'}
                        target='_blank'
                        className='rounded-[4px] bg-blue-sky-ultralight p-2 transition-colors duration-150 ease-out hover:text-blue-accent'
                      >
                        <FaInstagram size={20} />
                      </Link>
                      <Link
                        href={'https://www.whatsapp.com'}
                        target='_blank'
                        className='rounded-[4px] bg-blue-sky-ultralight p-2 transition-colors duration-150 ease-out hover:text-blue-accent'
                      >
                        <FaWhatsapp size={20} />
                      </Link>
                    </div>
                  }
                />
              </section>
              {/* <Divider className='bg-gray-lighter' /> */}
            </div>
          </section>
        </div>
        {/* More Details */}
        <section className='container max-w-[1900px] bg-blue-sky-ultralight py-[50px]'>
          <div
            className={`grid px-6 ${
              (
                productData?.datasheet?.data?.attributes?.url ||
                productData?.user_manual?.data?.attributes?.url
              ) ?
                'gap-10 2xl:grid-cols-2 2xl:gap-5'
              : 'justify-center'
            }`}
          >
            {/* Download Center Section */}
            <div className='flex flex-col items-center justify-center gap-10'>
              {productData?.youtube_video?.link_source &&
                productData?.youtube_video?.title && (
                  <div className='flex flex-col items-center'>
                    <iframe
                      width='400'
                      height='250'
                      className='aspect-video h-fit max-w-full md:max-w-[400px]'
                      src={
                        productData?.youtube_video?.link_source ?? ''
                      }
                      title={productData?.youtube_video?.title ?? ''}
                      frameBorder='0'
                      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                      referrerPolicy='strict-origin-when-cross-origin'
                      allowFullScreen
                    />
                  </div>
                )}

              {(productData?.datasheet?.data?.attributes?.url ||
                productData?.user_manual?.data?.attributes?.url) && (
                <div>
                  <h2 className='w-fit text-2xl font-bold text-black-light xl:text-3xl 2xl:mx-auto'>
                    {t('downloadCenterSectionTitle')}
                  </h2>
                  <div className='mt-5 flex flex-wrap items-center justify-start gap-5 2xl:mt-10 2xl:justify-center'>
                    {productData?.datasheet?.data?.attributes
                      ?.url && (
                      <DownloadBtn
                        pdfUrl={
                          productData?.datasheet?.data?.attributes
                            ?.url ?? null
                        }
                        name={
                          productData?.datasheet?.data?.attributes
                            ?.name ?? null
                        }
                      >
                        <FaBook size={24} />
                        <span>{t('dataSheetButtonText')}</span>
                      </DownloadBtn>
                    )}

                    {productData?.user_manual?.data?.attributes
                      ?.url && (
                      <DownloadBtn
                        pdfUrl={
                          productData?.user_manual?.data?.attributes
                            ?.url ?? null
                        }
                        name={
                          productData?.user_manual?.data?.attributes
                            ?.name ?? null
                        }
                      >
                        <FaAddressBook size={24} />
                        <span>{t('userManualButtonText')}</span>
                      </DownloadBtn>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ============================= */}

            {/* About Product Section */}
            <div>
              <h2 className='text-xl font-bold text-black-light xl:text-3xl'>
                {t('aboutThisProductSectionTitle')}
              </h2>
              <ul
                className={`${locale === 'ar' ? 'mr-5' : 'ml-5'} mt-5 list-disc 2xl:mt-10`}
              >
                {productData?.features.map((item, i) => (
                  <li
                    key={item?.id ?? i}
                    className='mt-3 text-base text-blue-gray-light'
                  >
                    {item?.feature ?? ''}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
        <section className='tabs-section container bg-white py-[50px]'>
          <div className='px-6'>
            <TabsSection
              moreDetails={{
                description: productData?.long_description ?? [],
                specification: productData?.sepcification ?? [],
                reviews: productData?.reviews?.data ?? []
              }}
            />
          </div>
        </section>
        <section className='bg-white-light pb-[80px] pt-[50px]'>
          <div className='container'>
            <h2 className='mx-auto flex w-fit items-center gap-2 text-3xl font-bold text-black-light'>
              <span>{t('relatedProductsTitleBlackText')}</span>
              <span className='text-red-shade-350'>
                {t('relatedProductsTitleRedText')}
              </span>
            </h2>
            <div className='mt-8 grid gap-5 lg:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4'>
              {relatedProducts.map((product) => {
                return (
                  <ProductCard
                    key={product?.id ?? v4()}
                    id={product?.id ?? ''}
                    title={product?.attributes?.name ?? ''}
                    imgSrc={
                      product?.attributes?.image_thumbnail?.data
                        ?.attributes?.url ?? ''
                    }
                    alt={
                      product?.attributes?.image_thumbnail?.data
                        ?.attributes?.alternativeText ?? ''
                    }
                    avgRate={
                      product?.attributes?.average_reviews ?? 0
                    }
                    category={
                      product?.attributes?.sub_category?.data
                        ?.attributes?.name ?? ''
                    }
                    brand={
                      product?.attributes?.brand?.data?.attributes
                        ?.name ?? ''
                    }
                    modalName={product?.attributes?.modal_name ?? ''}
                    badge={getBadge(
                      locale ?? 'en',
                      productData?.updatedAt,
                      productData?.stock,
                      productData?.price,
                      productData?.sale_price
                    )}
                    priceBeforeDeduction={
                      product?.attributes?.price ?? 0
                    }
                    currentPrice={
                      product?.attributes?.sale_price ?? 0
                    }
                    linkSrc={
                      product && product.id ?
                        `/products/${product.id}`
                      : '/products'
                    }
                    stock={product?.attributes?.stock ?? 0}
                    totalRates={
                      product?.attributes?.total_reviews ?? 0
                    }
                  />
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
