import CustomBreadcrumb from '@/components/products/CustomBreadcrumb';
import {
  getTranslations,
  unstable_setRequestLocale
} from 'next-intl/server';
import { PiPrinterDuotone } from 'react-icons/pi';
import { HomeOutlined } from '@ant-design/icons';
// import { Link } from '@/navigation';
import {
  // DatasheetsPageIdsResponse,
  DatasheetsPageResponse
} from '@/types/DonwloadsPageResponse';
import { fetchGraphql } from '@/services/graphqlCrud';
import { Empty } from 'antd';
import { v4 } from 'uuid';
import { notFound } from 'next/navigation';
import { extractPageNumber } from '@/utils/stringHelpers';
import ControlPagination from '@/components/downloadPage/driversPage/ControlPagination';
import DownloadBtn from '@/components/UI/DownloadBtn';

const PAGE_SIZE = 10;

const getDatasheetsQuery = (
  locale: string,
  page: number | null = 1,
  pageSize = PAGE_SIZE
) => `{
    products(
        locale: "${locale ?? 'en'}"
        pagination: { page: ${page}, pageSize: ${pageSize} }
        filters: {
            new_datasheet: {
                and: [{ title: { notNull: true } }, { applicable_model: { notNull: true } }]
            }
        }
    ) {
        data {
            attributes {
                new_datasheet {
                    id
                    title
                    applicable_model
                    datasheet {
                        data {
                            attributes {
                                name
                                alternativeText
                                url
                            }
                        }
                    }
                }
            }
        }
        meta {
            pagination {
                total
                page
                pageSize
                pageCount
            }
        }
    }
}`;

// // Helper function to recursively fetch all datasheets
const fetchDatasheetsByLocale = async (locale: string) => {
  const allDatasheets: {
    page: number;
    // data: { id: string | number }[];
  }[] = [];
  let page = 1;
  let hasMore = true;
  const maxRetries = 3;
  const retryDelay = 1000;

  while (hasMore) {
    let retries = 0;
    let error;

    while (retries < maxRetries) {
      try {
        const { data, error: fetchError } = (await fetchGraphql(
          getDatasheetsQuery(locale, page)
        )) as DatasheetsPageResponse;

        // console.warn(JSON.stringify(data));

        if (
          fetchError ||
          !data?.products?.data ||
          data?.products?.data.length === 0
        ) {
          // hasMore = false; // No more data, stop fetching
          // break;
          error = fetchError; // Save the error for logging
          throw new Error('Fetch error'); // Force a retry on error
        }

        allDatasheets.push({
          page
          // data: data.downloadPage.data.attributes.datasheets
        });

        // Check if there are more pages to fetch
        const pagination = data?.products.meta?.pagination ?? null;
        // page += 1;
        page++; // Move to the next page
        hasMore = pagination ? page <= pagination.pageCount : false;

        break; // Exit retry loop if successful
      } catch (err: any) {
        console.error(
          `Attempt ${retries + 1} failed for fetching datasheets page ${page}:`,
          err.message
        );
        retries++;

        if (retries >= maxRetries) {
          console.error(
            'Max retries reached. Fetching datasheets failed:',
            error
          );
          hasMore = false;
          return allDatasheets; // Return collected data even if some pages failed
        }

        await new Promise((res) => setTimeout(res, retryDelay));
      }
    }
  }

  return allDatasheets;
};

async function getAllDatasheetsIds() {
  // Fetch all Datasheets IDs
  const [enDatasheets, arDatasheets] = await Promise.all([
    fetchDatasheetsByLocale('en'),
    fetchDatasheetsByLocale('ar')
  ]);

  if (!enDatasheets.length || !arDatasheets.length) {
    console.error('Failed to fetch datasheets data');
    return [];
  }

  // Create the params for static generation
  const enParams = enDatasheets.map((datasheets) => ({
    page: `page_${datasheets.page}`,
    locale: 'en'
    // data: datasheets?.data ?? null
  }));
  const arParams = arDatasheets.map((datasheets) => ({
    page: `page_${datasheets.page}`,
    locale: 'ar'
    // data: datasheets?.data ?? null
  }));

  const params = [...enParams, ...arParams];

  // console.log('Generated datasheets static params:', params);

  return params;
}

// Updated generateStaticParams function
export async function generateStaticParams() {
  const params = await getAllDatasheetsIds();
  console.log('Generated datasheets static params:', params);

  return params;
}

interface PropsType {
  params: {
    locale: string;
    page: string;
  };
}

export default async function DatasheetsPage({
  params: { locale, page }
}: PropsType) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations(
    'DownloadsPage.content.children.datasheetsPage.content'
  );
  const d = await getTranslations('DownloadsPage.content');
  // const pageSize = 10;

  const pageID = extractPageNumber(page);

  const paramsResult = await getAllDatasheetsIds();
  const localePages = paramsResult.filter(
    (param) => param.locale === locale
  );
  // const totalDatasheetsPages = localePages.reduce(
  //   (acc, cur) => acc + cur.data.length,
  //   0
  // );

  if (!localePages.some((item) => item.page === page)) {
    return notFound();
  }

  const { data, error } = (await fetchGraphql(
    getDatasheetsQuery(locale, pageID)
  )) as DatasheetsPageResponse;
  const datasheetsData = data?.products?.data ?? null;

  // console.log(JSON.stringify(datasheetsData));

  if (error || !datasheetsData) {
    console.error(error);
    return notFound(); // 404 if no data
  }

  return (
    <div className='min-h-screen'>
      <div className='flex flex-col items-center gap-4 border-b border-b-gray-medium-light pb-6'>
        <h1
          className={`text-3xl font-bold uppercase ${locale === 'ar' ? '' : 'tracking-wide'} text-black-medium`}
        >
          {t('title')}
        </h1>
        <div className='flex w-fit items-center gap-5'>
          <div className='h-[2px] w-[90px] bg-red-shade-400'></div>
          <PiPrinterDuotone
            className='text-red-shade-400'
            size={32}
          />
          <div className='h-[2px] w-[90px] bg-red-shade-400'></div>
        </div>
        <CustomBreadcrumb
          items={[
            {
              href: '/',
              title: (
                <div className='flex items-center gap-2'>
                  <HomeOutlined />
                  <span className='capitalize'>
                    {d('breadcrumb.home')}
                  </span>
                </div>
              )
            },
            {
              href: '/downloads/datasheets',
              title: t('title')
            }
          ]}
          locale={locale}
        />
      </div>
      <div>
        {datasheetsData && datasheetsData?.length > 0 ?
          <>
            <ul>
              {datasheetsData.map((datasheet, i, arr) => (
                <li
                  key={
                    datasheet?.attributes?.new_datasheet?.id ?? v4()
                  }
                  className={`relative ${locale === 'ar' ? 'pl-[140px] pr-[15px]' : 'pl-[15px] pr-[160px]'} pb-2.5 pt-[30px] ${arr.length === i + 1 ? '' : 'border-b border-gray-medium-light'}`}
                >
                  <i
                    className={`absolute ${locale === 'ar' ? 'right-0' : 'left-0'} top-10 h-[6px] w-[6px] rounded-full bg-red-shade-400`}
                  />

                  <div className={`px-2.5`}>
                    <DownloadBtn
                      url={
                        (
                          datasheet?.attributes?.new_datasheet
                            ?.datasheet?.data?.attributes?.url
                        ) ?
                          datasheet?.attributes?.new_datasheet
                            ?.datasheet?.data?.attributes?.url
                        : '/downloads/datasheets'
                      }
                      name={
                        datasheet?.attributes?.new_datasheet?.title ??
                        datasheet?.attributes?.new_datasheet
                          ?.datasheet?.data?.attributes?.name
                      }
                      className={`text-lg font-semibold capitalize transition-colors duration-200 hover:text-orange-medium`}
                      target={'_self'}
                    >
                      {datasheet?.attributes?.new_datasheet?.title ??
                        ''}
                    </DownloadBtn>

                    {datasheet?.attributes?.new_datasheet
                      ?.applicable_model && (
                      <div className='mt-1 text-lg'>
                        <span className='font-medium capitalize text-red-shade-400'>
                          {t('listItem.applicableModel')}:
                        </span>{' '}
                        {datasheet?.attributes?.new_datasheet?.applicable_model.trim() && (
                          <div className='mt-1 inline font-mono text-base font-normal'>
                            {datasheet?.attributes?.new_datasheet?.applicable_model
                              .trim()
                              .split('\n')
                              .map((line, index) => (
                                <p
                                  key={index}
                                  className={`text-pretty break-all uppercase ${index === 0 ? 'inline' : ''}`}
                                >
                                  {line}
                                </p>
                              ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {datasheet?.attributes?.new_datasheet?.datasheet
                    ?.data?.attributes?.url && (
                    <DownloadBtn
                      url={
                        datasheet?.attributes?.new_datasheet
                          ?.datasheet?.data?.attributes?.url ?? null
                      }
                      name={
                        datasheet?.attributes?.new_datasheet?.title ??
                        datasheet?.attributes?.new_datasheet
                          ?.datasheet?.data?.attributes?.name
                      }
                      className={`absolute ${locale === 'ar' ? 'left-0 w-[120px]' : 'right-0 w-[140px]'} top-[30px] rounded-sm bg-red-shade-400 py-2 text-white hover:bg-orange-medium`}
                      target={
                        (
                          datasheet?.attributes?.new_datasheet?.datasheet?.data?.attributes?.url.includes(
                            'filebrowser.hamsatech-eg.com'
                          )
                        ) ?
                          '_self'
                        : '_blank'
                      }
                    >
                      {d('downloadButtonText')}
                    </DownloadBtn>
                  )}
                </li>
              ))}
            </ul>
            <div>
              {/* <Pagination /> */}
              <ControlPagination
                pageSize={PAGE_SIZE}
                page={pageID ?? 1}
                total={data?.products?.meta?.pagination?.total ?? 0}
                pageName='datasheets'
              />
            </div>
          </>
        : <div>
            <div className='mt-5 grid min-h-[400px] place-content-center'>
              <Empty />
            </div>
          </div>
        }
      </div>
    </div>
  );
}
