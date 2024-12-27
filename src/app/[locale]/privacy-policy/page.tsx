import { fetchGraphql } from '@/services/graphqlCrud';
import {
  getTranslations,
  unstable_setRequestLocale
} from 'next-intl/server';
import { notFound } from 'next/navigation';
import { GetPrivacyPolicyResponseDataType } from '@/types/singlePageReponseType';
import { CreateBlockContent } from '@/components/UI/strapi-blocks/StrapiBlocks';
import { convertIsoStringToDateFormat } from '@/utils/dateHelpers';

interface PropsType {
  params: { locale: string };
}

const getPageByLocaleQuery = (locale: string) => `{
    privacyPolicy(locale: ${locale === 'ar' || 'en' ? `"${locale}"` : '"en"'}) {
        data {
            id
            attributes {
                title
                content
                updatedAt
                publishedAt
            }
        }
    }
    }`;

export default async function page({
  params: { locale }
}: PropsType) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('PrivacyPolicyPage.content');
  const { data: responseData, error: responseError } =
    (await fetchGraphql(
      getPageByLocaleQuery(locale)
    )) as GetPrivacyPolicyResponseDataType;
  //   console.log(JSON.stringify(responseData));

  const pageID = responseData?.privacyPolicy.data?.id ?? null;
  const pageData =
    responseData?.privacyPolicy.data?.attributes ?? null;
  const pageContent =
    responseData?.privacyPolicy.data?.attributes?.content ?? null;
  if (responseError || !pageID || !pageContent) {
    console.error(responseError);
    return notFound(); // 404 if no data
  }

  return (
    <div className='container font-inter'>
      <h1 className='mb-6 text-center text-3xl font-bold'>
        {pageData?.title ?? ''}
      </h1>
      <h5 className='my-3 text-base font-medium'>
        {t('lastUpdated')}{' '}
        {convertIsoStringToDateFormat(
          pageData?.updatedAt ?
            pageData?.updatedAt
          : pageData?.publishedAt || null
        )}
      </h5>
      {pageContent && <CreateBlockContent content={pageContent} />}
    </div>
  );
}
