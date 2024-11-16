import { getQueryProductPage } from '@/services/getProduct';
import { fetchGraphql } from '@/services/graphqlCrud';
import { ProductResponseType } from '@/types/getProduct';
import {
  getTranslations,
  unstable_setRequestLocale
} from 'next-intl/server';

type PropsType = {
  children: React.ReactNode;
  params: { locale: string; product: string };
};

export const revalidate = 60; // invalidate every 60 seconds
// export function generateStaticParams() {
//   //   return locales.map((locale) => ({ locale }));
// }

export async function generateMetadata({
  params: { locale, product }
}: Omit<PropsType, 'children'>) {
  const t = await getTranslations({
    locale,
    namespace: 'HomePage.metaData'
  });

  const response = (await fetchGraphql(
    getQueryProductPage(product)
  )) as ProductResponseType;
  // console.log(JSON.stringify(response));
  const { data: productResData, error: productError } = response;
  const productData =
    productResData?.product?.data?.attributes || null;
  if (!productData || productError) {
    return {
      title: t('title'),
      description: t('description')
    };
  }

  const siteUrl = process.env.BASE_URL || 'https://hamsatech-eg.com'; // Base URL of your site
  const productUrl = `${siteUrl}/${locale}/products/${product}`;
  const isArabic = locale === 'ar';
  const nextProductId = productData?.localizations?.data[0]?.id;

  const title = productData?.name || productData?.modal_name || '';
  const description =
    productData?.description ||
    productData?.brand?.data?.attributes?.name ||
    '';

  return {
    title: title,
    description: description.split('\n').join(' '),
    openGraph: {
      title: title,
      description: description.split('\n').join(' '),
      url: productUrl,
      images: [
        {
          url:
            productData?.image_thumbnail?.data?.attributes?.url ||
            `${siteUrl}/icons/product-not-available.png`,
          // width: 800,
          // height: 600,
          alt:
            productData?.image_thumbnail?.data?.attributes
              ?.alternativeText ||
            title ||
            ''
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      site: '@hamsa_tech', // Twitter handle
      title: title,
      description: description.split('\n').join(' '),
      image:
        productData?.image_thumbnail?.data?.attributes?.url ||
        `${siteUrl}/icons/product-not-available.png`,
      imageAlt: title
    },
    alternates: {
      canonical: productUrl,
      languages:
        isArabic ?
          {
            'en-US': `${siteUrl}/en/products/${nextProductId}`,
            'ar-EG': `${siteUrl}/ar/products/${product}`
          }
        : {
            'en-US': `${siteUrl}/en/products/${product}`,
            'ar-EG': `${siteUrl}/ar/products/${nextProductId}`
          }
    },
    other: {
      ['og:type']: 'product',
      ['product:price.amount']:
        productData?.final_product_price ?? '0',
      ['product:price.currency']: 'EGP'
    }
  };
}

function layout({ children, params: { locale } }: PropsType) {
  // Enable static rendering
  unstable_setRequestLocale(locale);
  return <div>{children}</div>;
}

export default layout;
