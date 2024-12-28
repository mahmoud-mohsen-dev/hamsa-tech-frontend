import { fetchGraphql } from '@/services/graphqlCrud';
import { GetReturnAndRefundPolicyResponseMetaDataType } from '@/types/singlePageReponseType';
import {
  getTranslations,
  unstable_setRequestLocale
} from 'next-intl/server';

export const revalidate = 1800; // invalidate every 30 minutes

interface PropsType {
  children: React.ReactNode;
  params: { locale: string };
}

const getPageByLocaleQuery = (locale: string) => `{
  returnAndRefundPolicy(locale: ${locale === 'ar' || 'en' ? `"${locale}"` : '"en"'}) {
    data {
      id
      attributes {
        title
        seo {
          metaTitle
          metaDescription
          keywords
        }
        seo_meta_image {
          data {
            attributes {
              name
              url
              alternativeText
            }
          }
        }
      }
    }
  }
}`;

export async function generateMetadata({
  params: { locale }
}: PropsType) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations(
    'ReturnAndRefundPolicyPage.metaData'
  );
  const { data: responseData, error: responseError } =
    (await fetchGraphql(
      getPageByLocaleQuery(locale)
    )) as GetReturnAndRefundPolicyResponseMetaDataType;

  const pageData =
    responseData?.returnAndRefundPolicy.data?.attributes ?? null;
  const seo = pageData?.seo;
  const seoImage = pageData?.seo_meta_image?.data?.attributes ?? null;

  if (responseError || !pageData) {
    console.error(responseError);
    return {
      title: t('title'),
      description: t('description')
    };
  }

  const siteUrl = process.env.BASE_URL || 'https://hamsatech-eg.com'; // Base URL of your site
  const pageUrl = `${siteUrl}/${locale}/return-and-refund-policy`;

  const title = seo?.metaTitle || pageData?.title || t('title');
  const description = seo?.metaDescription || t('description');
  const metaImageUrl =
    seoImage?.url || `${siteUrl}/image-not-found.png`;
  const metaImageAlt =
    seoImage?.alternativeText || 'Return and Refund Policy Image';

  return {
    title,
    description,
    keywords:
      seo?.keywords ||
      `${title}, return policy, refund policy, product returns, Hamsa Tech, refund methods, customer service, return instructions, shipping costs, defective items, return conditions`,
    openGraph: {
      title,
      description,
      url: pageUrl,
      images: [
        {
          url: metaImageUrl,
          alt: metaImageAlt
        }
      ],
      locale: locale === 'ar' ? 'ar_EG' : 'en_US',
      siteName: locale === 'ar' ? 'همسة تك' : 'Hamsa Tech',
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      site: '@hamsa_tech',
      title,
      description,
      image: metaImageUrl,
      imageAlt: metaImageAlt
    },
    alternates: {
      canonical: pageUrl,
      languages:
        locale === 'ar' ?
          {
            'en-US': `${siteUrl}/en/return-and-refund-policy`,
            'ar-EG': `${siteUrl}/ar/return-and-refund-policy`
          }
        : {
            'en-US': `${siteUrl}/en/return-and-refund-policy`,
            'ar-EG': `${siteUrl}/ar/return-and-refund-policy`
          }
    }
  };
}

function layout({ children, params: { locale } }: PropsType) {
  // Enable static rendering
  unstable_setRequestLocale(locale);
  return <section className='container py-12'>{children}</section>;
}

export default layout;
