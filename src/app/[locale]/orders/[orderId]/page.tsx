import Image from 'next/image';

import {
  fetchGraphqlClient,
  fetchGraphqlClientAuthenticated
} from '@/services/graphqlCrud';
import { GetOrderResponseType } from '@/types/orderResponseTypes';
import { notFound } from 'next/navigation';
import { convertIsoStringToDateFormat } from '@/utils/dateHelpers';
import { capitalize } from '@/utils/helpers';
import { formatEnglishNumbers } from '@/utils/numbersFormating';
import DownloadButton from '@/components/invoice/DownloadButton';

const getOrderQuery = (orderId: string) => {
  return `{
    order(id: "${orderId}") {
        data {
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
                            zip_code
                            first_name
                            last_name
                            delivery_phone
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
  // const [isClient, setIsClient] = useState(false);

  // const locale = useLocale();

  // useEffect(() => {
  //   setIsClient(true);
  // }, []);

  const { data, error } = (await fetchGraphqlClient(
    getOrderQuery(orderId)
  )) as GetOrderResponseType;

  // console.log(JSON.stringify(data));

  const attributes = data?.order?.data?.attributes;
  const shippingAddress =
    attributes?.shipping_address?.data?.attributes;
  const invoiceUrl = attributes?.invoice?.data?.attributes?.url;

  if (!attributes || error) {
    notFound();
  }

  return (
    <>
      <DownloadButton invoiceUrl={invoiceUrl} orderId={orderId} />
      <div
        className='boder-gray-100 mt-5 rounded-lg border bg-white p-6 font-inter shadow 2xl:min-w-[850px]'
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
              `Address: ${capitalize(shippingAddress?.address_1)}`}
            {shippingAddress?.address_2 &&
              `, ${capitalize(shippingAddress?.address_2)}`}
            <br />
            {shippingAddress?.city &&
              `City: ${capitalize(shippingAddress.city)}`}
            {(
              shippingAddress?.zip_code &&
              shippingAddress?.zip_code > 0
            ) ?
              `, Postal code: ${shippingAddress?.zip_code}`
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
    </>
  );
}

export default InvoicePage;
