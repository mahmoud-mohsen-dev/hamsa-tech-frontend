import { fetchGraphql } from '@/services/graphqlCrud';
import {
  getTranslations,
  unstable_setRequestLocale
} from 'next-intl/server';
import { notFound } from 'next/navigation';
import { GetReturnAndRefundPolicyResponseDataType } from '@/types/singlePageReponseType';
import { CreateBlockContent } from '@/components/UI/strapi-blocks/StrapiBlocks';
import { convertIsoStringToDateFormat } from '@/utils/dateHelpers';

interface PropsType {
  params: { locale: string };
}

const getPageByLocaleQuery = (locale: string) => `{
    returnAndRefundPolicy(locale: ${locale === 'ar' || 'en' ? `"${locale}"` : '"en"'}) {
        data {
            id
            attributes {
                title
                hidden
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
  const t = await getTranslations(
    'ReturnAndRefundPolicyPage.content'
  );
  const { data: responseData, error: responseError } =
    (await fetchGraphql(
      getPageByLocaleQuery(locale)
    )) as GetReturnAndRefundPolicyResponseDataType;
  //   console.log(JSON.stringify(responseData));

  const pageID = responseData?.returnAndRefundPolicy.data?.id ?? null;
  const pageData =
    responseData?.returnAndRefundPolicy.data?.attributes ?? null;
  const pageContent =
    responseData?.returnAndRefundPolicy.data?.attributes?.content ??
    null;
  if (responseError || !pageID || !pageContent || pageData?.hidden) {
    console.error('responseError:', responseError);
    console.error('pageID', pageID);
    console.error('pageContent', pageContent);
    console.error('hidden', pageData?.hidden ?? null);
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
