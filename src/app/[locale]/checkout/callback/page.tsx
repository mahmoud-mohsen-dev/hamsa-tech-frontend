'use client';
import { notFound, useSearchParams } from 'next/navigation';
import { Skeleton } from 'antd';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { formatCurrencyNumbers } from '@/utils/numbersFormating';
import { fetchGraphqlClient } from '@/services/graphqlCrud';
import {
  CallCallbackResponseType,
  GetOrderSummaryByIdType,
  OrderSummaryType
} from '@/types/getOrderSummaryType';
import {
  addDaysToIsoDate,
  formatDateByLocale
} from '@/utils/dateHelpers';
import DownloadButton from '@/components/invoice/DownloadButton';
import Btn from '@/components/UI/Btn';
import { IoStorefrontSharp } from 'react-icons/io5';
import { getCookie, getIdFromToken } from '@/utils/cookieUtils';
import { capitalize } from '@/utils/helpers';

const getOrderSummaryByIdQuery = (orderId: string) => {
  return `{
        order(id: "${orderId}") {
            data {
                id
                attributes {
                    total_order_cost
                    payment_method
                    payment_status
                    createdAt
                    guest_user {
                        data {
                            id
                        }
                    }
                    user {
                        data {
                            id
                        }
                    }
                    shipping_address {
                        data {
                            attributes {
                                shipping_cost {
                                    data {
                                        attributes {
                                            delivery_duration_in_days
                                        }
                                    }
                                }
                            }
                        }
                    }
                    invoice {
                        data {
                            attributes {
                                name
                                url
                            }
                        }
                    }
                }
            }        
        }
    }`;
};

const CallbackCheckoutPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const orderId = params.get('oid');
  const locale = useLocale();
  const t = useTranslations('CallbackCheckoutPage.content');
  const [orderData, setOrderData] = useState<OrderSummaryType | null>(
    null
  );

  useEffect(() => {
    if (typeof window !== 'undefined' && !orderId) {
      const url = window.location.origin; // URL (e.g., "https://example.com")
      const queryString =
        searchParams ?
          new URLSearchParams(searchParams).toString()
        : ''; // Convert searchParams to query string if available

      const apiUrl = `${url}/api/paymob/callback${queryString ? `?${queryString}` : ''}`; // e.g. http://localhost:3000/api/checkout/callback?order-id=90&test=55
      // console.log(apiUrl);

      const callCallback = async () => {
        try {
          const response = await fetch(apiUrl);
          if (!response.ok) {
            console.error(response);
            throw new Error(
              `Failed to fetch order summary: ${response.status}`
            );
          }
          const { data: resData, error: resError } =
            (await response.json()) as CallCallbackResponseType;
          console.log(resData);
          if (
            resError ||
            resData === null ||
            typeof resData?.orderId !== 'string'
          ) {
            console.error(resError?.message ?? error);
            setError(resError?.message ?? 'Error occurred');
            return;
          }

          const url = `/checkout/callback?oid=${resData.orderId}`;
          window.location.href = url; // This will change the URL and reload the page
        } catch (error) {
          console.error(error);
        }
      };

      callCallback();
    }
  }, []);

  useEffect(() => {
    if (orderId) {
      // console.log(orderId);
      const getOrderSummary = async () => {
        try {
          const guestUserId = getCookie('guestUserId');
          const userId = getIdFromToken();
          if (!userId && !guestUserId) {
            throw new Error(`Didn't provide credentials`);
          }

          const { data, error } = (await fetchGraphqlClient(
            getOrderSummaryByIdQuery(orderId)
          )) as GetOrderSummaryByIdType;

          if (error || !data?.order?.data) {
            console.error(error);
            console.error(data);
            throw new Error('Failed to fetch order summary');
          }

          const guestUserResponseID =
            data?.order?.data?.attributes?.guest_user?.data?.id ??
            null;
          const userResponseID =
            data?.order?.data?.attributes?.user?.data?.id ?? null;

          if (
            (userResponseID && userId && userResponseID === userId) ||
            (guestUserResponseID &&
              guestUserId &&
              guestUserResponseID === guestUserId)
          ) {
            setOrderData(data.order.data);
            return;
          }

          throw new Error('Unauthorized to view this order');
        } catch (err) {
          console.error(err);
          setError('Failed to fetch order summary');
        } finally {
          setLoading(false);
        }
      };
      getOrderSummary();
    }
  }, [orderId]);

  if (error) {
    return notFound();
  }

  return (
    <section className='flex min-h-[calc(100vh-64px)] flex-col items-center justify-center bg-gray-100 py-5'>
      <div className='w-full max-w-lg rounded-lg bg-white p-6 shadow-lg'>
        {loading || !orderId ?
          <div className='flex flex-col items-center justify-center gap-1 text-lg'>
            <Skeleton.Node
              active={loading}
              style={{ width: 70, height: 70 }}
            />
            <div>
              <Skeleton.Button
                active={loading}
                size={'small'}
                shape={'square'}
                style={{ width: '175px' }}
                block={true}
              />
            </div>
            <Skeleton.Button
              active={loading}
              size={'small'}
              shape={'square'}
              block={true}
            />
            <Skeleton.Input
              active={loading}
              size={'small'}
              block={true}
            />
            <div className='my-6 flex w-full flex-col gap-2 rounded-lg bg-gray-lighter px-4 py-6'>
              <Skeleton.Button
                active={loading}
                size={'small'}
                shape={'square'}
                style={{ width: '175px' }}
                block={true}
              />
              <Skeleton.Input
                active={loading}
                size={'small'}
                block={true}
              />
              <Skeleton.Input
                active={loading}
                size={'small'}
                block={true}
              />
              <Skeleton.Input
                active={loading}
                size={'small'}
                block={true}
              />
              <Skeleton.Input
                active={loading}
                size={'small'}
                block={true}
              />
              <Skeleton.Input
                active={loading}
                size={'small'}
                block={true}
              />
              <Skeleton.Input
                active={loading}
                size={'small'}
                block={true}
              />
              <Skeleton.Input
                active={loading}
                size={'small'}
                block={true}
              />
            </div>
            <div className='flex w-full flex-col items-center gap-2 sm:flex-row'>
              <div className='w-full'>
                <Skeleton.Button
                  active={loading}
                  size={'default'}
                  shape={'square'}
                  block={true}
                  style={{ width: '100%' }}
                />
              </div>
              <div className='w-full'>
                <Skeleton.Button
                  active={loading}
                  size={'default'}
                  shape={'square'}
                  block={true}
                />
              </div>
            </div>
          </div>
        : <>
            <Image
              src='/icons/submit-successfully.svg'
              alt='success icon'
              width={70}
              height={70}
              quality={100}
              className='mx-auto'
            />
            <h1 className='my-4 text-center text-3xl font-semibold text-green-600'>
              {t('orderSuccessTitle')}
            </h1>
            <p className='mb-6 text-center text-lg text-gray-700'>
              {t('orderSuccessMessage')}
            </p>
            <div className='my-6 flex flex-col gap-1.5 rounded-lg bg-gray-lighter px-4 py-6 font-sans text-lg'>
              <h2 className='text-xl font-medium text-gray-800'>
                {t('orderSummary')}
              </h2>
              <div className='flex justify-between'>
                <span className='text-gray-600'>{t('orderId')}</span>
                <span className='font-semibold text-black-light'>
                  #{orderId}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>
                  {t('orderDate')}
                </span>
                <span
                  className='font-semibold text-black-light'
                  //   dir='ltr'
                >
                  {formatDateByLocale(
                    orderData?.attributes?.createdAt,
                    locale
                  )}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>
                  {t('orderTotal')}
                </span>
                <span className='font-semibold text-black-light'>
                  {formatCurrencyNumbers(2000, t('currency'), locale)}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>
                  {t('shippingMethod')}
                </span>
                <span className='font-semibold text-black-light'>
                  {t('shippingStandard')}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>
                  {t('paymentMethod')}
                </span>
                <span className='font-semibold text-black-light'>
                  {orderData?.attributes?.payment_method ?
                    capitalize(orderData?.attributes?.payment_method)
                  : '-'}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>
                  {t('paymentStatus')}
                </span>
                <span className='font-semibold text-black-light'>
                  {orderData?.attributes?.payment_status ?
                    capitalize(orderData?.attributes?.payment_status)
                  : '-'}
                </span>
              </div>

              <div className='flex justify-between'>
                <span className='text-gray-600'>
                  {t('estimatedDelivery')}
                </span>
                <span className='font-semibold text-green-dark'>
                  {formatDateByLocale(
                    addDaysToIsoDate(
                      orderData?.attributes?.createdAt ?? null,
                      orderData?.attributes?.shipping_address?.data
                        ?.attributes?.shipping_cost?.data?.attributes
                        ?.delivery_duration_in_days ?? null
                    ),

                    locale
                  )}
                </span>
              </div>
            </div>
            <div className='flex flex-col items-center gap-2 sm:flex-row'>
              <Btn
                href={'/products'}
                className='w-full rounded-lg bg-blue-sky-accent px-[1rem] py-[.55rem] font-sans font-normal text-white hover:bg-blue-sky-medium'
              >
                <IoStorefrontSharp size={16} />
                <span>{t('backToShop')}</span>
              </Btn>
              <DownloadButton
                invoiceUrl={
                  orderData?.attributes?.invoice?.data?.attributes
                    ?.url ?? ''
                }
                orderId={orderId ?? ''}
                className='w-full rounded-lg font-sans'
              />
            </div>
          </>
        }
      </div>
    </section>
  );
};

export default CallbackCheckoutPage;
