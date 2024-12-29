import { fetchGraphql } from '@/services/graphqlCrud';
import { GetWarrantyTermsResponseMetaDataType } from '@/types/singlePageReponseType';
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
  warrantyTerm(locale: ${locale === 'ar' || 'en' ? `"${locale}"` : '"en"'}) {
    data {
      id
      attributes {
        title
        hidden
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
  const t = await getTranslations('WarrantyTermsPage.metaData');
  const { data: responseData, error: responseError } =
    (await fetchGraphql(
      getPageByLocaleQuery(locale)
    )) as GetWarrantyTermsResponseMetaDataType;
  // console.log(JSON.stringify(responseData));

  const pageData =
    responseData?.warrantyTerm?.data?.attributes ?? null;
  const seo = pageData?.seo;
  const seoImage = pageData?.seo_meta_image?.data?.attributes ?? null;

  if (responseError || !pageData || pageData?.hidden) {
    console.error('Meta tags - responseError:', responseError);
    console.error('Meta tags - pageData:', pageData);
    console.error('Meta tags - hidden:', pageData?.hidden ?? null);

    return {
      title: t('title'),
      description: t('description')
    };
  }

  const siteUrl = process.env.BASE_URL || 'https://hamsatech-eg.com'; // Base URL of your site
  const pageUrl = `${siteUrl}/${locale}/warranty-terms`;

  const title = seo?.metaTitle || pageData?.title || t('title');
  const description = seo?.metaDescription || t('description');
  const metaImageUrl =
    seoImage?.url || `${siteUrl}/image-not-found.png`;
  const metaImageAlt =
    seoImage?.alternativeText || 'Warranty Terms Image';

  return {
    title,
    description,
    keywords:
      seo?.keywords ||
      `${title}, Warranty Terms, Hamsa Tech, Warranty Policy, Product Repair, Product Replacement, Quality Guarantee, Warranty Duration, Manufacturing Defects, Electrical Issues, Technical Support`,
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
            'en-US': `${siteUrl}/en/warranty-terms`,
            'ar-EG': `${siteUrl}/ar/warranty-terms`
          }
        : {
            'en-US': `${siteUrl}/en/warranty-terms`,
            'ar-EG': `${siteUrl}/ar/warranty-terms`
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
