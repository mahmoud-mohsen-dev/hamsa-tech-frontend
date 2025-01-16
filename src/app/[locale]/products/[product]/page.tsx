import { fetchGraphql } from '@/services/graphqlCrud';
import { ProductResponseType } from '@/types/getProduct';
import {
  getTranslations,
  unstable_setRequestLocale
} from 'next-intl/server';
import {
  FaAddressBook,
  FaBook,
  FaFacebookF,
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
import ProductCard from '@/components/products/ProductCard';
import { v4 } from 'uuid';
import { getBadge } from '@/utils/getBadge';
import TabsSection from '@/components/productPage/TabsSection';
import DownloadBtn from '@/components/UI/DownloadBtn';
import { getQueryProductPage } from '@/services/getProduct';
import { TbMail } from 'react-icons/tb';
import { appendAutoplayParameter } from '@/utils/helpers';
import { fetchGraphqlServerWebAuthenticated } from '@/services/graphqlCrudServerOnly';
import { trimText } from '@/utils/helpers';

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

  const response = (await fetchGraphqlServerWebAuthenticated(
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

  const productUrl = `${process.env.BASE_URL || 'http://localhost:3000'}/${locale}/products/${product}`;

  const getCurrentAndNextProductId = () => {
    let enId = 'not-found';
    let arId = 'not-found';

    if (productResData?.product?.data?.attributes?.locale === 'ar') {
      arId = productResData?.product?.data?.id ?? 'not-found';
      enId =
        productResData?.product?.data?.attributes?.localizations
          ?.data[0]?.id ?? 'not-found';
    } else {
      arId =
        productResData?.product?.data?.attributes?.localizations
          ?.data[0]?.id ?? 'not-found';
      enId = productResData?.product?.data?.id ?? 'not-found';
    }

    return { enId, arId };
  };

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
            className={`mx-2 grid items-start md:mt-5 2xl:grid-cols-2 2xl:gap-2`}
          >
            <ProductSlider
              productData={productData}
              enId={getCurrentAndNextProductId().enId}
              arId={getCurrentAndNextProductId().arId}
            />
            <div className='mt-5 2xl:mt-0'>
              {/* Basic Data */}
              <section>
                <div className='flex items-center gap-4'>
                  <h4 className='capitalize text-blue-dark'>
                    {productData?.sub_category?.data?.attributes
                      ?.name ?? ''}
                  </h4>
                  <div
                    className={`availability rounded border px-2.5 py-1 font-inter text-sm capitalize ${productData?.stock > 0 ? 'border-green-500 text-green-500' : 'border-red-shade-350 text-red-shade-350'}`}
                    data-original={
                      productData?.stock > 0 ?
                        t('inStockText')
                      : t('outOfStockText')
                    }
                    data-class={
                      productData?.stock > 0 ?
                        'in-stock'
                      : 'out-of-stock'
                    }
                  >
                    <span className='availability-text'>
                      {productData?.stock > 0 ?
                        t('inStockText')
                      : t('outOfStockText')}
                    </span>
                  </div>
                </div>
                <h1 className='mt-3 text-3xl font-semibold capitalize text-black-medium'>
                  {trimText(productData?.name ?? '')}
                </h1>
                <h2 className='mt-5 text-sm font-normal text-gray-500 sm:text-base md:text-xl'>
                  {trimText(productData?.description ?? '')}
                </h2>
                <div className='mt-5 flex items-center gap-2'>
                  <Rate
                    defaultValue={productData?.average_reviews ?? 0}
                    value={productData?.average_reviews ?? 0}
                    allowHalf
                    disabled
                  />
                  <h6 className='text-sm font-medium text-blue-dark'>
                    ({productData?.total_reviews ?? 0}{' '}
                    {productData?.total_reviews > 1 ?
                      t('reviewsText')
                    : t('reviewText')}
                    )
                  </h6>
                </div>

                <div className='mt-3 flex items-center gap-3 font-inter'>
                  {productData?.sale_price > 0 && (
                    <span className='text-xl font-semibold text-red-500'>
                      EGP {productData?.sale_price ?? 0}
                    </span>
                  )}

                  <span
                    className={`${productData?.sale_price > 0 ? 'text-lg font-medium text-blue-sky-dark line-through' : 'text-xl font-semibold text-red-500'}`}
                  >
                    EGP {productData?.price ?? 0}
                  </span>

                  {productData?.sale_price > 0 && offPercent > 10 ?
                    <span className='rounded border border-red-shade-350 px-3 py-1 font-sans text-base font-medium text-red-shade-300'>
                      {offPercent.toFixed(2)}% {t('offText')}
                    </span>
                  : null}
                </div>

                {productData?.stock > 0 && (
                  <h4 className='my-2 flex items-center gap-2 text-base font-normal'>
                    <span className='text-blue-gray-medium'>
                      {t('availabilityText')}:
                    </span>
                    <span className='font-semibold text-green-dark'>
                      {productData?.stock}
                    </span>
                    <span className='text-blue-gray-medium'>
                      {t('stockText')}
                    </span>
                  </h4>
                )}

                {productData?.stock > 0 && (
                  <OrderProduct
                    productId={product}
                    maxQuantity={productData?.stock ?? 0}
                    minQuantity={productData?.stock > 0 ? 1 : 0}
                    localeParentName={productData?.locale}
                    localeChildName={
                      productData?.localizations?.data[0]?.attributes
                        ?.locale
                    }
                    localeChildId={
                      productData?.localizations?.data[0]?.id ?? ''
                    }
                  />
                )}
                {/* <div className='mt-4 text-sm capitalize text-gray-medium'>
                  <p>-&nbsp;&nbsp;&nbsp;&nbsp;{t('deliveryText')}</p>
                  <p className='mt-1'>
                    -&nbsp;&nbsp;&nbsp;&nbsp;{t('returnText')}
                  </p>
                </div> */}
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
                  value={
                    productResData?.product?.data?.attributes
                      ?.edara_item_code ?? ''
                  }
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
                    value={
                      <div className='flex flex-wrap items-center'>
                        {/* {productData?.tags?.data.map(
                          (tag, i, arr) => (
                            <div key={tag?.id}>
                              <Link
                                href={
                                  tag?.attributes?.slug ?
                                    `/products/tags/${tag?.attributes?.slug}`
                                  : '/'
                                }
                                className='transition-colors duration-150 ease-out hover:text-yellow-medium'
                              >
                                {tag?.attributes?.name ?? ''}
                              </Link>
                              {i < arr.length - 1 && (
                                <span className='mr-2'>,</span>
                              )}
                            </div>
                          )
                        )} */}
                        {productData?.tags?.data.map(
                          (tag, i, arr) => (
                            <div key={tag?.id}>
                              <span>
                                {tag?.attributes?.name ?? ''}
                              </span>
                              {i < arr.length - 1 && (
                                <span className='mr-2'>,</span>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    }
                  />
                )}
                <Info
                  infoKey={`${t('shareText')}:`}
                  // className='mb-[50px]'
                  value={
                    <div className='flex flex-wrap items-center gap-3'>
                      <Link
                        href={`https://www.facebook.com/sharer/sharer.php?u=${productUrl}`}
                        target='_blank'
                        className='rounded-[4px] bg-blue-sky-ultralight p-2 transition-colors duration-150 ease-out hover:text-blue-accent'
                      >
                        <FaFacebookF size={20} />
                      </Link>
                      <Link
                        href={`https://twitter.com/intent/tweet?text=${
                          locale === 'ar' ?
                            `🔥 لا تفوّت الفرصة! احصل على ${productData?.name || productData?.modal_name || ''} بسعر مذهل لفترة محدودة.%0A%0A🛒 تسوّق الآن ➡️ ${productUrl}
`
                          : `🔥 Don’t miss out! Get the ${productData?.name || productData?.modal_name || ''} at an amazing price for a limited time.%0A%0A🛒 Shop now ➡️ ${productUrl}`
                        }`}
                        target='_blank'
                        className='rounded-[4px] bg-blue-sky-ultralight p-2 transition-colors duration-150 ease-out hover:text-blue-accent'
                      >
                        <RiTwitterXLine size={20} />
                      </Link>
                      <Link
                        href={`https://api.whatsapp.com/send?text=Check out this amazing product: ${productUrl}`}
                        target='_blank'
                        className='rounded-[4px] bg-blue-sky-ultralight p-2 transition-colors duration-150 ease-out hover:text-blue-accent'
                      >
                        <FaWhatsapp size={20} />
                      </Link>
                      <Link
                        href={`https://mail.google.com/mail/u/0/?to=%7Bemail_address%7D&su=Check+out+this+product&body=Hello,%0AI%27m+reaching+out+to+share+with+you+this+amazing+product+:%0A%0A${productUrl}%0A%0AI+hope+you+will+find+it+useful.%0ABest+regards,&bcc=%7Bemail_address%7D&cc=%7Bemail_address%7D&fs=1&tf=cm`}
                        target='_blank'
                        className='rounded-[4px] bg-blue-sky-ultralight p-2 transition-colors duration-150 ease-out hover:text-blue-accent'
                      >
                        {/* <FaInstagram size={20} /> */}
                        <TbMail size={20} />
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
                        productData?.youtube_video?.link_source ?
                          appendAutoplayParameter(
                            productData.youtube_video.link_source
                          )
                        : ''
                      }
                      title={productData?.youtube_video?.title ?? ''}
                      frameBorder='0'
                      allow='accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
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
                className={`${locale === 'ar' ? 'mr-5' : 'ml-5'} list-disc ${
                  (
                    productData?.datasheet?.data?.attributes?.url ||
                    productData?.user_manual?.data?.attributes?.url
                  ) ?
                    'mt-5 2xl:mt-10'
                  : 'mt-5'
                }`}
              >
                {productData?.features.map((item) => (
                  <li
                    key={item?.id ?? v4()}
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
                reviews: productData?.reviews?.data ?? [],
                averageReviews: productData?.average_reviews ?? 0,
                totalReviews: productData?.total_reviews ?? 0
              }}
              productIds={{
                enId:
                  (
                    getCurrentAndNextProductId().enId &&
                    getCurrentAndNextProductId().enId !== 'not-found'
                  ) ?
                    getCurrentAndNextProductId().enId
                  : null,
                arId:
                  (
                    getCurrentAndNextProductId().arId &&
                    getCurrentAndNextProductId().arId !== 'not-found'
                  ) ?
                    getCurrentAndNextProductId().arId
                  : null
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
                    key={v4()}
                    id={product?.id ?? ''}
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
                    imgSrc={
                      product?.attributes?.image_thumbnail?.data
                        ?.attributes?.url ?? ''
                    }
                    alt={
                      product?.attributes?.image_thumbnail?.data
                        ?.attributes?.alternativeText ?? ''
                    }
                    // avgRate={
                    //   product?.attributes?.average_reviews ?? 0
                    // }
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
                      product?.attributes?.updatedAt ?? '',
                      product?.attributes?.stock ?? 0,
                      product?.attributes?.price ?? 0,
                      product?.attributes?.sale_price ?? 0
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
                    // totalRates={
                    //   product?.attributes?.total_reviews ?? 0
                    // }
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
