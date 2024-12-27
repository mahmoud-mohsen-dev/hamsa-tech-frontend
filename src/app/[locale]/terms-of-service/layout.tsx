import { fetchGraphql } from '@/services/graphqlCrud';
import { GetTermsOfServiceResponseMetaDataType } from '@/types/singlePageReponseType';
import {
  getTranslations,
  unstable_setRequestLocale
} from 'next-intl/server';

export const revalidate = 86400; // invalidate every day

interface PropsType {
  children: React.ReactNode;
  params: { locale: string };
}

const getPageByLocaleQuery = (locale: string) => `{
  termsOfService(locale: ${locale === 'ar' || 'en' ? `"${locale}"` : '"en"'}) {
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
  const t = await getTranslations('TermsOfServicePage.metaData');
  const { data: responseData, error: responseError } =
    (await fetchGraphql(
      getPageByLocaleQuery(locale)
    )) as GetTermsOfServiceResponseMetaDataType;

  const pageData =
    responseData?.termsOfService.data?.attributes ?? null;
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
  const pageUrl = `${siteUrl}/${locale}/terms-of-service`;

  const title = seo?.metaTitle || pageData?.title || t('title');
  const description = seo?.metaDescription || t('description');
  const metaImageUrl =
    seoImage?.url || `${siteUrl}/image-not-found.png`;
  const metaImageAlt =
    seoImage?.alternativeText || 'Terms of Service Image';

  return {
    title,
    description,
    keywords:
      seo?.keywords ||
      `${title}, terms of service, Hamsa Tech, account rules, order policies, intellectual property`,
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
            'en-US': `${siteUrl}/en/terms-of-service`,
            'ar-EG': `${siteUrl}/ar/terms-of-service`
          }
        : {
            'en-US': `${siteUrl}/en/terms-of-service`,
            'ar-EG': `${siteUrl}/ar/terms-of-service`
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
