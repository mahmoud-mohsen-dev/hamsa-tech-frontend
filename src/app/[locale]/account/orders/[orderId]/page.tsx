import Image from 'next/image';

import {
  fetchGraphqlByArgsToken,
  // fetchGraphqlClient,
  fetchGraphqlServerAuthenticated
} from '@/services/graphqlCrud';
import {
  GetOrderResponseType,
  OrdersPaginationResponseType
} from '@/types/orderResponseTypes';
import { notFound } from 'next/navigation';
import { convertIsoStringToDateFormat } from '@/utils/dateHelpers';
import { capitalize } from '@/utils/helpers';
import { formatEnglishNumbers } from '@/utils/numbersFormating';
import DownloadButton from '@/components/invoice/DownloadButton';
import { unstable_setRequestLocale } from 'next-intl/server';

// Helper function to recursively fetch all orders
const fetchAllOrdersIds = async () => {
  let allOrdersId: { id: string }[] = [];
  let page = 1;
  let hasMore = true;
  const maxRetries = 3; // Maximum number of retries
  const retryDelay = 1000; // Delay in milliseconds between retries

  while (hasMore) {
    const query = `
      {
        orders(pagination: { page: ${page}, pageSize: 10 }) {
          data {
            id
          }
          meta {
            pagination {
              page
              pageSize
              pageCount
              total
            }
          }   
        }
      }
    `;

    let retries = 0;
    let error;

    while (retries < maxRetries) {
      try {
        const { data, error: fetchError } =
          (await fetchGraphqlServerAuthenticated(
            query
          )) as OrdersPaginationResponseType;

        // console.log(JSON.stringify(data));

        if (
          fetchError !== null ||
          !data?.orders?.data ||
          !data?.orders?.meta?.pagination?.page ||
          !data?.orders?.meta?.pagination?.pageCount ||
          !data?.orders?.meta?.pagination?.pageSize ||
          !data?.orders?.meta?.pagination?.total
        ) {
          error = fetchError; // Save the error for logging
          console.error(error);
          throw new Error('Fetch error'); // Force a retry on error
        }

        // Append the current page's order IDs to the list
        allOrdersId = [...allOrdersId, ...data.orders.data];

        // Check if there are more pages to fetch
        const pagination = data.orders.meta.pagination;
        page += 1;
        hasMore = page <= pagination.pageCount;

        break; // Exit retry loop if successful
      } catch (err: any) {
        console.error(
          `Attempt ${retries + 1} failed for fetching orders:`,
          err.message
        );
        retries += 1;

        if (retries >= maxRetries) {
          console.error(
            'Max retries reached. Fetching orders failed:',
            error
          );
          return []; // Return an empty array if max retries are reached
        }

        await new Promise((res) => setTimeout(res, retryDelay)); // Wait before retrying
      }
    }
  }

  // console.log('Fetched order IDs:', allOrdersId);
  return allOrdersId;
};

// Updated generateStaticParams function
export async function generateStaticParams() {
  // Fetch all order IDs
  const ordersIds = await fetchAllOrdersIds();

  if (!ordersIds.length) {
    console.error('Failed to fetch orders IDs');
    return [];
  }

  // Create the params for static generation
  const enParams = ordersIds.map((order) => ({
    orderId: order.id,
    locale: 'en'
  }));
  const arParams = ordersIds.map((order) => ({
    orderId: order.id,
    locale: 'ar'
  }));

  const params = [...enParams, ...arParams];

  console.log('Generated orders static params:', params);

  return params;
}

const getOrderQuery = (orderId: string) => {
  return `{
    order(id: "${orderId}") {
        data {
            id
            attributes {
                delivery_status
                payment_status
                subtotal_cart_cost
                total_order_cost
                payment_method
                createdAt
                delivery_cost
                coupon_applied_value
                shipping_address {
                    data {
                        attributes {
                            city
                            address_1
                            address_2
                            building
                            floor
                            apartment
                            zip_code
                            first_name
                            last_name
                            delivery_phone
                            shipping_cost {
                                data {
                                    attributes {
                                        governorate
                                    }
                                }
                            }
                        }
                    }
                }
                cart {
                    id
                    product {
                        data {
                            attributes {
                                name
                                final_product_price
                            }
                        }
                    }
                    quantity
                    total_cost
                }
                invoice {
                    data {
                        attributes {
                            url
                            ext
                            mime
                            size
                        }
                    }
                }
                
            }
        }        
    }
  }`;
};

async function InvoicePage({
  params: { locale, orderId }
}: {
  params: { orderId: string; locale: string };
}) {
  unstable_setRequestLocale(locale);
  // const [isClient, setIsClient] = useState(false);

  // const locale = useLocale();

  // useEffect(() => {
  //   setIsClient(true);
  // }, []);
  const { data, error } = (await fetchGraphqlByArgsToken(
    getOrderQuery(orderId),
    process.env.API_TOKEN
  )) as GetOrderResponseType;

  // console.log(JSON.stringify(data ?? null));
  // console.log(JSON.stringify(error ?? null));

  const attributes = data?.order?.data?.attributes;
  const shippingAddress =
    attributes?.shipping_address?.data?.attributes;
  const invoiceUrl = attributes?.invoice?.data?.attributes?.url;

  if (!attributes || error) {
    console.error('Invalid order', error);
    console.error('Attributes', attributes);
    notFound();
  }

  return (
    <section className='mx-auto w-fit'>
      <DownloadButton invoiceUrl={invoiceUrl} orderId={orderId} />
      <div
        className='boder-gray-100 mt-5 rounded-lg border bg-white p-6 font-inter shadow 2xl:w-[850px]'
        dir='ltr'
      >
        <div className='flex flex-col'>
          <div className='mb-2 flex items-center justify-between'>
            <div>
              <div className='text-xl font-semibold text-gray-800'>
                Invoice #{orderId}
              </div>
              <div className='mt-2.5 text-sm font-semibold text-gray-600'>
                Date:{' '}
                {convertIsoStringToDateFormat(
                  attributes?.createdAt ?? ''
                )}
              </div>
            </div>
            <Image
              src='/hamsa-logo.svg'
              alt='hamsa logo'
              width={45}
              height={45}
              quality={100}
              className={`${locale === 'ar' ? 'ml-5' : 'mr-5'} block`}
            />
          </div>
          <div className='ml-auto flex items-center gap-1 text-sm font-medium uppercase text-gray-600'>
            <span className='text-blue-dark'>Hamsa</span>
            <span className='text-red-shade-350'>Tech</span>
          </div>
        </div>
        <div className='mt-2'>
          <div className='text-md font-semibold'>Bill to</div>
          <p className='text-sm text-gray-700'>
            {shippingAddress?.first_name && (
              <span className='text-[15px] leading-5'>
                {capitalize(shippingAddress?.first_name)}
              </span>
            )}{' '}
            {shippingAddress?.last_name && (
              <span className='text-[15px] leading-5'>
                {capitalize(shippingAddress?.last_name)}
              </span>
            )}
            {(shippingAddress?.address_1 ||
              shippingAddress?.address_2) && <br />}
            {shippingAddress?.address_1 &&
              `${capitalize(shippingAddress?.address_1)}`}
            {shippingAddress?.address_2 &&
              ` - ${capitalize(shippingAddress?.address_2)}`}
            <br />
            {shippingAddress?.building &&
              `Building: ${shippingAddress.building}`}
            {shippingAddress?.floor &&
              ` - Floor: ${shippingAddress.floor}`}
            {(
              shippingAddress?.apartment &&
              shippingAddress?.apartment > 0
            ) ?
              ` - Apartment: ${shippingAddress?.apartment}`
            : ''}
            <br />
            {shippingAddress?.city &&
              `${capitalize(shippingAddress.city)}`}
            {shippingAddress?.shipping_cost?.data?.attributes
              ?.governorate &&
              ` - ${capitalize(shippingAddress.shipping_cost.data.attributes.governorate)}`}
            {(
              shippingAddress?.zip_code &&
              shippingAddress?.zip_code > 0
            ) ?
              ` - ${shippingAddress?.zip_code}`
            : ''}
            <br />
            {shippingAddress?.delivery_phone ?? ''}
          </p>
        </div>
        {/* Table */}
        <div className='mt-5 overflow-x-auto'>
          <table className='min-w-full border border-gray-200 bg-white'>
            <thead className='bg-gray-200'>
              <tr>
                <th className='px-4 py-2 text-left text-sm font-medium text-gray-600'>
                  Item
                </th>
                <th className='px-4 py-2 text-left text-sm font-medium text-gray-600'>
                  Price
                </th>
                <th className='px-4 py-2 text-left text-sm font-medium text-gray-600'>
                  Quantity
                </th>
                <th className='px-4 py-2 text-left text-sm font-medium text-gray-600'>
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {attributes.cart.map((item) => {
                return (
                  <tr key={item.id} className='text-sm'>
                    <td className='px-4 py-2'>
                      {item?.product?.data?.attributes?.name ?? ''}
                    </td>
                    <td className='px-4 py-2'>
                      {formatEnglishNumbers(
                        item?.product?.data?.attributes
                          ?.final_product_price ?? 0,
                        'EGP'
                      )}
                    </td>
                    <td className='px-4 py-2'>
                      {item?.quantity ?? 1}
                    </td>
                    <td className='px-4 py-2'>
                      {formatEnglishNumbers(
                        item?.total_cost ?? 0,
                        'EGP'
                      )}
                    </td>
                  </tr>
                );
              })}

              <tr className='border-t border-gray-200 text-sm font-semibold'>
                <td className='px-4 py-2' colSpan={3}>
                  Subtotal
                </td>
                <td className='px-4 py-2'>
                  {formatEnglishNumbers(
                    attributes?.subtotal_cart_cost ?? 0,
                    'EGP'
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className='mb-5 ml-auto mt-4 flex w-2/5 flex-col gap-1 pb-2 text-sm'>
          <div className='flex justify-between'>
            <span>Subtotal</span>
            <span>
              {formatEnglishNumbers(
                attributes?.subtotal_cart_cost ?? 0,
                'EGP'
              )}
            </span>
          </div>
          <div className='flex justify-between'>
            <span>Discount</span>
            <span>
              {formatEnglishNumbers(
                attributes?.coupon_applied_value ?? 0,
                'EGP'
              )}
              {/* {attributes?.coupon_applied_value > 0 && ' - '} */}
            </span>
          </div>
          <div className='flex justify-between'>
            <span>Shipping</span>
            <span>
              {formatEnglishNumbers(
                attributes?.delivery_cost ?? 0,
                'EGP'
              )}
            </span>
          </div>
          <div className='flex justify-between font-semibold text-blue-sky-accent'>
            <span>Total</span>
            <span>
              {formatEnglishNumbers(
                attributes?.total_order_cost ?? 0,
                'EGP'
              )}
            </span>
          </div>
        </div>
      </div>
      {/* // : <Spin size='large' />} */}
    </section>
  );
}

export default InvoicePage;
