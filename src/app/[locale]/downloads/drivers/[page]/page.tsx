import CustomBreadcrumb from '@/components/products/CustomBreadcrumb';
import {
  getTranslations,
  unstable_setRequestLocale
} from 'next-intl/server';
import { PiPrinterDuotone } from 'react-icons/pi';
import { HomeOutlined } from '@ant-design/icons';
import { DriversPageResponse } from '@/types/DonwloadsPageResponse';
import { fetchGraphql } from '@/services/graphqlCrud';
import { Empty } from 'antd';
import { v4 } from 'uuid';
import { notFound } from 'next/navigation';
import { extractPageNumber } from '@/utils/stringHelpers';
import ControlPagination from '@/components/downloadPage/driversPage/ControlPagination';
import DownloadBtn from '@/components/UI/DownloadBtn';

const PAGE_SIZE = 10;

const getDriversQuery = (
  locale: string,
  page: number | null = 1,
  pageSize = PAGE_SIZE
) => `
  {
    products(
        locale: "${locale ?? 'en'}"
        pagination: { page: ${page}, pageSize: ${pageSize} }
        filters: {
            driver: {
                and: [
                    { title: { notNull: true } }
                    { system: { notNull: true } }
                    { applicable_model: { notNull: true } }
                    { file_link: { notNull: true } }
                ]
            }
        }
    ) {
        data {
            attributes {
                driver {
                    id
                    title
                    system
                    applicable_model
                    file_link
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
}
`;

const fetchDriversByLocale = async (locale: string) => {
  const allDrivers: {
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
          getDriversQuery(locale, page)
        )) as DriversPageResponse;

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

        allDrivers.push({
          page
          // data: data.products.data
        });

        // Check if there are more pages to fetch
        const pagination = data?.products.meta?.pagination ?? null;
        // page += 1;
        page++; // Move to the next page
        hasMore = pagination ? page <= pagination.pageCount : false;

        break; // Exit retry loop if successful
      } catch (err: any) {
        console.error(
          `Attempt ${retries + 1} failed for fetching drivers page ${page}:`,
          err.message
        );
        retries++;

        if (retries >= maxRetries) {
          console.error(
            'Max retries reached. Fetching drivers failed:',
            error
          );
          hasMore = false;
          return allDrivers; // Return collected data even if some pages failed
        }

        await new Promise((res) => setTimeout(res, retryDelay));
      }
    }
  }

  return allDrivers;
};

async function getAllDriversIds() {
  // Fetch all Drivers IDs
  const [enDrivers, arDrivers] = await Promise.all([
    fetchDriversByLocale('en'),
    fetchDriversByLocale('ar')
  ]);

  if (!enDrivers.length || !arDrivers.length) {
    console.error('Failed to fetch drivers data');
    return [];
  }

  // Create the params for static generation
  const enParams = enDrivers.map((driver) => ({
    page: `page_${driver.page}`,
    locale: 'en'
    // data: driver?.data ?? null
  }));
  const arParams = arDrivers.map((driver) => ({
    page: `page_${driver.page}`,
    locale: 'ar'
    // data: driver?.data ?? null
  }));

  const params = [...enParams, ...arParams];

  // console.log('Generated drivers static params:', params);

  return params;
}

// Updated generateStaticParams function
export async function generateStaticParams() {
  const params = await getAllDriversIds();
  console.log('Generated drivers static params:', params);

  return params;
}

interface PropsType {
  params: {
    locale: string;
    page: string;
  };
}

export default async function DriversPage({
  params: { locale, page }
}: PropsType) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations(
    'DownloadsPage.content.children.driversPage.content'
  );
  const d = await getTranslations('DownloadsPage.content');
  // const pageSize = 10;

  const pageID = extractPageNumber(page);

  const paramsResult = await getAllDriversIds();
  const localePages = paramsResult.filter(
    (param) => param.locale === locale
  );
  // const totalDriversPages = localePages.reduce(
  //   (acc, cur) => acc + cur.data.length,
  //   0
  // );

  if (!localePages.some((item) => item.page === page)) {
    return notFound();
  }

  const { data, error } = (await fetchGraphql(
    getDriversQuery(locale, pageID)
  )) as DriversPageResponse;
  const driversData = data?.products?.data ?? null;

  console.log(JSON.stringify(driversData));

  if (error || !driversData) {
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
              href: '/downloads/drivers',
              title: t('title')
            }
          ]}
          locale={locale}
        />
      </div>
      <div>
        {driversData && driversData?.length > 0 ?
          <>
            <ul>
              {driversData.map((driver, i, arr) => {
                return (
                  driver?.attributes?.driver &&
                  driver?.attributes?.driver.length > 0 &&
                  driver?.attributes?.driver.map((driveItem) => (
                    <li
                      key={driveItem?.id ?? v4()}
                      className={`relative ${locale === 'ar' ? 'pl-[140px] pr-[15px]' : 'pl-[15px] pr-[160px]'} pb-2.5 pt-[30px] ${arr.length === i + 1 ? '' : 'border-b border-gray-medium-light'}`}
                    >
                      <i
                        className={`absolute ${locale === 'ar' ? 'right-0' : 'left-0'} top-10 h-[6px] w-[6px] rounded-full bg-red-shade-400`}
                      />

                      <div className={`px-2.5`}>
                        <DownloadBtn
                          url={
                            driveItem?.file_link ?
                              driveItem?.file_link
                            : '/downloads/drivers'
                          }
                          name={driveItem?.title ?? null}
                          className={`text-lg font-semibold capitalize transition-colors duration-200 hover:text-orange-medium`}
                          target={
                            driveItem?.file_link ?
                              (
                                driveItem?.file_link?.includes(
                                  'filebrowser.hamsatech-eg.com'
                                )
                              ) ?
                                '_self'
                              : '_blank'
                            : '_self'
                          }
                          autoDownloadFile={false}
                        >
                          {driveItem?.title ?? ''}
                        </DownloadBtn>

                        {driveItem?.system && (
                          <p className='mt-1 text-lg'>
                            <span className='font-medium capitalize text-red-shade-400'>
                              {t('listItem.system')}:
                            </span>{' '}
                            <span className='text-base uppercase'>
                              {driveItem?.system}
                            </span>
                          </p>
                        )}

                        {driveItem?.applicable_model && (
                          <div className='mt-1 text-lg'>
                            <span className='font-medium capitalize text-red-shade-400'>
                              {t('listItem.applicableModel')}:
                            </span>{' '}
                            {driveItem?.applicable_model.trim() && (
                              <div className='mt-1 inline font-mono text-base font-normal'>
                                {driveItem?.applicable_model
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

                      {driveItem?.file_link && (
                        <DownloadBtn
                          url={driveItem?.file_link ?? null}
                          name={driveItem?.title}
                          className={`absolute ${locale === 'ar' ? 'left-0 w-[120px]' : 'right-0 w-[140px]'} top-[30px] rounded-sm bg-red-shade-400 py-2 text-white hover:bg-orange-medium`}
                          target={
                            (
                              driveItem?.file_link.includes(
                                'filebrowser.hamsatech-eg.com'
                              )
                            ) ?
                              '_self'
                            : '_blank'
                          }
                          autoDownloadFile={false}
                        >
                          {d('downloadButtonText')}
                        </DownloadBtn>
                      )}
                    </li>
                  ))
                );
              })}
            </ul>
            <div>
              {/* <Pagination /> */}
              <ControlPagination
                pageSize={PAGE_SIZE}
                page={pageID ?? 1}
                total={data?.products?.meta?.pagination?.total ?? 0}
                pageName='drivers'
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

// export default DriversPage;
