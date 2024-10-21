'use client';

import { Button, ConfigProvider, Form, message, Spin } from 'antd';
import AddressFormItems from './AddressFormItems';
import BillingAddress from './BillingAddress';
import PaymentMethods from './PaymentMethods';
import Contact from './Contact';
import { useTranslations } from 'next-intl';
import ShippingCost from './ShippingCost';
import { useForm } from 'antd/es/form/Form';
import { ShippingCostDataType } from '@/types/shippingCostResponseTypes';
import { FreeShippingAttributesType } from '@/types/freeShippingResponseType';
import { useEffect, useState } from 'react';
import { useMyContext } from '@/context/Store';
import { ValidateErrorEntity } from 'rc-field-form/lib/interface';
import { fetchGraphqlClient } from '@/services/graphqlCrud';
import {
  getCartId,
  getCookie,
  getIdFromToken
} from '@/utils/cookieUtils';
import { UpdateGuestUserResponseType } from '@/types/guestUserReponses';
import {
  CreateAddressResponseType,
  updateAddressResponseType
} from '@/types/addressResponseTypes';
import { CreateOrderResponseType } from '@/types/orderResponseTypes';
import { CartDataType } from '@/types/cartResponseTypes';
import { uploadInvoicePdf } from '@/services/invoicesPDFHandlers';
import { capitalize } from '@/utils/helpers';
import { useRouter } from '@/navigation';

const updateGuestUserQuery = (
  guestUserId: string,
  emailOrPhone: string,
  subscribedToNews: boolean,
  cartId: string
) => {
  return `mutation UpdateGuestUser {
    updateGuestUser(
        id: "${guestUserId}",
        data: { 
            email_or_phone: "${emailOrPhone}",
            subscribed_to_news_and_offers: ${subscribedToNews ?? false},
            cart: "${cartId}"
        }
    ) {
        data {
            id
        }
    }
  }`;
};

const updateAddressQuery = ({
  userId,
  shippingAddressId,
  city,
  address1,
  address2,
  building,
  floor,
  apartment,
  zipCode,
  guestUserId,
  firstName,
  lastName,
  deliveryPhone,
  shippingCostId
}: {
  userId: string | null;
  shippingAddressId: string;
  city: string;
  address1: string;
  address2?: string;
  building: string;
  floor: string;
  apartment: number;
  zipCode?: string;
  guestUserId: string;
  firstName: string;
  lastName: string;
  deliveryPhone?: string;
  shippingCostId: string;
}) => {
  return `mutation UpdateAddress {
    updateAddress(
        id: "${shippingAddressId}"
        data: {
            city: "${city}"
            address_1: "${address1}"
            address_2: "${address2 ?? ''}"
            zip_code: ${Number(zipCode) ?? 0}
            guest_user: ${guestUserId ? `"${guestUserId}"` : null}
            first_name: "${firstName}"
            last_name: "${lastName}"
            delivery_phone: "${deliveryPhone ?? ''}"
            shipping_cost: ${shippingCostId}
            user: ${userId ? `"${userId}"` : null}
            building: "${building}"
            floor: "${floor}"
            apartment: ${apartment}
        }
    ) {
        data {
            id
        }
    }
  }`;
};

const createOrderQuery = ({
  cart,
  subTotalCartCost,
  userId,
  guestUserId,
  shippingAddressId,
  paymentMethod,
  billingAddressId,
  couponId,
  deliveryCost,
  couponAppliedValue,
  totalOrderCost,
  deliveryStatus,
  paymentStatus
}: {
  cart: CartDataType[];
  subTotalCartCost: number;
  userId: string | null;
  guestUserId: string | null;
  shippingAddressId: string | null;
  paymentMethod: string;
  billingAddressId: string | null;
  couponId: string | null;
  deliveryCost: number;
  couponAppliedValue: number;
  totalOrderCost: number;
  deliveryStatus: string;
  paymentStatus: string;
}) => {
  // Convert cart products details to GraphQL-friendly string
  const cartString = `[${cart
    .map((cartItem) => {
      if (
        cartItem &&
        cartItem?.quantity &&
        cartItem?.product?.data?.id &&
        cartItem?.total_cost
      ) {
        return `{
          quantity: ${cartItem.quantity},
          total_cost: ${cartItem.total_cost},
          product: ${cartItem.product.data.id}
        }`;
      }
      return false;
    })
    .join(', ')}]`;

  console.log(cartString);

  return `mutation CreateOrder {
    createOrder(
        data: {
            cart: ${cartString}
            subtotal_cart_cost: ${subTotalCartCost}
            user: ${userId ? `"${userId}"` : null}
            guest_user: ${guestUserId ? `"${guestUserId}"` : null}
            shipping_address: ${shippingAddressId ? `"${shippingAddressId}"` : null}
            payment_method: ${paymentMethod}
            billing_address: ${billingAddressId ? `"${billingAddressId}"` : null}
            coupon: ${couponId ? `"${couponId}"` : null}
            delivery_cost: ${deliveryCost}
            coupon_applied_value: ${couponAppliedValue}
            total_order_cost: ${totalOrderCost}
            delivery_status: ${deliveryStatus}
            payment_status: ${paymentStatus}
            publishedAt: "${new Date().toISOString()}"
        }
    ) {
        data {
            id
            attributes {
                delivery_status
                total_order_cost
                payment_method
                payment_status
                delivery_cost
                coupon_applied_value
                subtotal_cart_cost
                createdAt
                user {
                    data {
                        id
                    }
                }
                guest_user {
                    data {
                        id
                    }
                }
                shipping_address {
                    data {
                        attributes {
                            city
                            address_1
                            zip_code
                            address_2
                            building
                            floor
                            apartment
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
                    product {
                        data {
                            id
                            attributes {
                                name
                                final_product_price
                            }
                        }
                    }
                    quantity
                    total_cost
                }
            }
        }
    }
  }`;
};

interface CreateAddressProps {
  city: string;
  address1: string;
  address2: string;
  building: string;
  floor: string;
  apartment: number;
  zipCode?: string;
  userId: string | null;
  guestUserId: string | null;
  firstName: string;
  lastName: string;
  deliveryPhone: string;
  shippingCostId: string | null;
}

const getCreateShippingAddressQuery = ({
  city,
  address1,
  address2,
  building,
  floor,
  apartment,
  zipCode,
  userId,
  guestUserId,
  firstName,
  lastName,
  deliveryPhone,
  shippingCostId
}: CreateAddressProps) => {
  return `mutation CreateAddress {
    createAddress(
        data: {
            city: "${capitalize(city ?? '')}"
            address_1: "${capitalize(address1 ?? '')}"
            address_2: "${capitalize(address2 ?? '')}"
            building: "${building}"
            floor: "${floor}"
            apartment: ${apartment}
            zip_code: ${Number(zipCode) ?? 0}
            user: ${userId ? `"${userId}"` : null}
            guest_user: ${guestUserId ? `"${guestUserId}"` : null}
            first_name: "${capitalize(firstName ?? '')}"
            last_name: "${capitalize(lastName ?? '')}"
            delivery_phone: "${deliveryPhone ?? ''}"
            shipping_cost: ${shippingCostId ? `"${shippingCostId}"` : null}
            publishedAt: "${new Date().toISOString()}"
        }
    ) {
        data {
            id
            
        }
    }
  }`;
};

const createBillingAddress = async ({
  city,
  address1,
  address2,
  building,
  floor,
  apartment,
  zipCode,
  userId,
  guestUserId,
  firstName,
  lastName,
  deliveryPhone,
  shippingCostId
}: CreateAddressProps) => {
  try {
    const { data: addressData, error: addressError } =
      (await fetchGraphqlClient(
        getCreateShippingAddressQuery({
          city,
          address1,
          address2,
          building,
          floor,
          apartment,
          zipCode,
          userId,
          guestUserId,
          firstName,
          lastName,
          deliveryPhone,
          shippingCostId
        })
      )) as CreateAddressResponseType;

    if (addressData?.createAddress?.data?.id) {
      return {
        addressData: addressData.createAddress.data.id,
        addressError: null
      };
    }
    console.error(addressError);
    return { addressData: null, addressError: addressError };
  } catch (err) {
    console.error('Error creating billing address:', err);
    return { addressData: null, addressError: err };
  }
};

interface OderFormValuesType {
  billingMethod: 'same' | 'different';
  emailOrPhone: string;
  paymentMethod: 'card' | 'cash_on_delivery';
  sendNewsLetter: boolean;
  shippingDetailsAddress: string;
  shippingDetailsAddress2?: string;
  shippingDetailsBuilding: string;
  shippingDetailsFloor: string;
  shippingDetailsApartment: number;
  shippingDetailsCity: string;
  shippingDetailsCountry: string;
  shippingDetailsFirstName: string;
  shippingDetailsGovernorate: string;
  shippingDetailsLastName: string;
  shippingDetailsPhone?: string;
  shippingDetailsPostalCode?: string;

  // Optional billing details
  billingDetailsAddress?: string;
  billingDetailsAddress2?: string;
  billingDetailsBuilding: string;
  billingDetailsFloor: string;
  billingDetailsApartment: number;
  billingDetailsCity?: string;
  billingDetailsCountry?: string;
  billingDetailsFirstName?: string;
  billingDetailsGovernorate?: string;
  billingDetailsLastName?: string;
  billingDetailsPhone?: string;
  billingDetailsPostalCode?: string;
}

function OrderInfo({
  shippingCostData,
  freeShippingData
}: {
  shippingCostData: ShippingCostDataType[] | [];
  freeShippingData: FreeShippingAttributesType | undefined;
}) {
  const [form] = useForm();
  const {
    setFreeShippingAt,
    governoratesData,
    // setGlobalLoading,
    cart,
    calculateSubTotalCartCost,
    couponData,
    calculateNetDeliveryCost,
    calculateCouponDeductionValue,
    calculateTotalOrderCost,
    setLoadingMessage,
    setErrorMessage,
    setSuccessMessage
  } = useMyContext();
  // const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const t = useTranslations('CheckoutPage.content');
  // const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      typeof freeShippingData === 'object' &&
      freeShippingData.apply_free_shipping_if_total_cart_cost_equals &&
      freeShippingData.enable
    ) {
      setFreeShippingAt(freeShippingData);
    }
  }, [freeShippingData]);
  // Function to handle form submission
  const onFinish = async (formValues: OderFormValuesType) => {
    try {
      console.log('Received values of form: ', formValues);
      const cartId = getCartId() ?? '';
      const {
        emailOrPhone,
        sendNewsLetter,
        shippingDetailsFirstName,
        shippingDetailsLastName,
        shippingDetailsPhone,
        shippingDetailsAddress,
        shippingDetailsAddress2,
        shippingDetailsBuilding,
        shippingDetailsFloor,
        shippingDetailsApartment,
        shippingDetailsGovernorate,
        shippingDetailsCity,
        shippingDetailsPostalCode
      } = formValues;

      setLoadingMessage(true);

      const { data: guestUserData, error: guestUserError } =
        (await fetchGraphqlClient(
          updateGuestUserQuery(
            getCookie('guestUserId') ?? '',
            emailOrPhone,
            sendNewsLetter,
            cartId
          )
        )) as UpdateGuestUserResponseType;

      const shippingCostId =
        governoratesData.find(
          (item) =>
            item?.attributes?.governorate &&
            item?.attributes?.governorate ===
              shippingDetailsGovernorate
        )?.id ?? '';

      // Get address information
      const { data: addressData, error: addressError } =
        (await fetchGraphqlClient(
          updateAddressQuery({
            shippingAddressId: getCookie('shippingAddressId') ?? '',
            city: capitalize(shippingDetailsCity ?? ''),
            address1: capitalize(shippingDetailsAddress ?? ''),
            address2: capitalize(shippingDetailsAddress2 ?? ''),
            building: shippingDetailsBuilding,
            floor: shippingDetailsFloor,
            apartment: shippingDetailsApartment,
            zipCode: shippingDetailsPostalCode,
            userId: getIdFromToken(),
            guestUserId: getCookie('guestUserId') ?? '',
            firstName: capitalize(shippingDetailsFirstName ?? ''),
            lastName: capitalize(shippingDetailsLastName ?? ''),
            deliveryPhone: shippingDetailsPhone,
            shippingCostId: shippingCostId
          })
        )) as updateAddressResponseType;

      let billingAddressId =
        addressData?.updateAddress?.data?.id ?? null;
      if (formValues?.billingMethod === 'different') {
        const { addressData, addressError } =
          await createBillingAddress({
            firstName: capitalize(
              formValues?.billingDetailsFirstName ?? ''
            ),
            lastName: capitalize(
              formValues?.billingDetailsLastName ?? ''
            ),
            address1: capitalize(
              formValues?.billingDetailsAddress ?? ''
            ),
            address2: capitalize(
              formValues?.billingDetailsAddress2 ?? ''
            ),
            building: formValues?.billingDetailsBuilding,
            floor: formValues?.billingDetailsFloor,
            apartment: formValues?.billingDetailsApartment,
            city: capitalize(formValues?.billingDetailsCity ?? ''),
            zipCode: formValues?.billingDetailsPostalCode,
            userId: getIdFromToken(),
            shippingCostId: shippingCostId,
            guestUserId: getCookie('guestUserId'),
            deliveryPhone: formValues?.billingDetailsPhone ?? ''
          });
        if (addressError || !addressData) {
          console.error(
            'Failed to create billing address',
            addressError
          );
          setLoadingMessage(false);
          setErrorMessage(t('form.addressCreationError'));
          return;
        }
        if (addressData) {
          billingAddressId = addressData;
        }
      }

      const { data: orderData, error: orderError } =
        (await fetchGraphqlClient(
          createOrderQuery({
            cart,
            subTotalCartCost: calculateSubTotalCartCost(),
            userId: getIdFromToken(), // 1. TODO: get user value
            guestUserId: getCookie('guestUserId'),
            shippingAddressId:
              addressData?.updateAddress?.data?.id ?? null,
            paymentMethod: formValues?.paymentMethod,
            billingAddressId,
            couponId: couponData?.id ?? null, // 2. TODO: get coupon ID value
            deliveryCost: calculateNetDeliveryCost(),
            couponAppliedValue: calculateCouponDeductionValue(),
            totalOrderCost: calculateTotalOrderCost(),
            deliveryStatus: 'pending',
            paymentStatus: 'pending'
          })
        )) as CreateOrderResponseType;

      if (
        guestUserError ||
        !guestUserData?.updateGuestUser?.data?.id
      ) {
        console.error('Failed to create guest user data');
        console.error(guestUserError);
        console.error(guestUserData);
        setLoadingMessage(false);
        setErrorMessage(t('form.guestUserError'));
        return;
      }

      if (addressError || !addressData?.updateAddress?.data?.id) {
        console.error('Failed to create address');
        console.error(addressError);
        console.error(addressData);
        setLoadingMessage(false);
        setErrorMessage(t('form.addressCreationError'));
        return;
      }

      if (
        orderError ||
        !orderData?.createOrder?.data?.id ||
        !orderData?.createOrder?.data
      ) {
        console.error('Failed to create a new order');
        console.error(orderError);
        console.error(orderData);
        setLoadingMessage(false);
        setErrorMessage(t('form.orderCreationError'));
        return;
      } else {
        console.log(orderData);
      }

      const response = await uploadInvoicePdf(
        orderData?.createOrder?.data ?? null
      );
      console.log(response);
      // Your API calls and logic here
      setLoadingMessage(false);
      setSuccessMessage(t('form.successMessage')); // Trigger success
      router.push(`/orders/${orderData.createOrder.data.id}`);
      // success();
    } catch (err) {
      console.error('Error during form submission:', err);
      setLoadingMessage(false);
      setErrorMessage(t('form.orderError'));
    } finally {
      setLoadingMessage(false);
      // messageApi.destroy();
    }
  };

  // Function to handle form submission failure (validation errors)
  const onFinishFailed = (errorInfo: ValidateErrorEntity<any>) => {
    setErrorMessage(
      errorInfo?.errorFields[0]?.errors[0] ??
        t('form.formSubmissionFailed')
    );
    console.log('Form failed:', errorInfo);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1677ff',
          colorBorder: '#dedede',
          colorTextPlaceholder: '#9b9b9bbd',
          borderRadius: 4,
          lineWidth: 1
        },
        components: {
          Input: {
            activeShadow: '0 0 0 3px rgba(5, 145, 255, 0.1)',
            paddingBlock: 10,
            paddingInline: 15
          },
          Checkbox: {
            borderRadiusSM: 4
          },
          Select: {
            controlHeight: 45
          }
        }
      }}
    >
      <Form
        name='order-info'
        onFinish={onFinish}
        colon={false}
        form={form}
        onFinishFailed={onFinishFailed}
        initialValues={{
          sendNewsLetter: false,
          shippingDetailsCountry: 'egypt',
          billingDetailsCountry: 'egypt',
          paymentMethod: 'card',
          billingMethod: 'same'
        }}
      >
        {/* Deliver Section */}
        <Contact />
        {/* Deliver Section */}
        <h2 className='mt-4 text-xl font-semibold'>
          {t('deliveryTitle')}
        </h2>
        <AddressFormItems
          name='shippingDetails'
          shippingCostData={shippingCostData}
        />

        {/* Shipping Cost*/}
        <ShippingCost />

        {/* Payment Methods*/}
        <PaymentMethods form={form} />
        {/* Billing Address */}
        <BillingAddress
          form={form}
          shippingCostData={shippingCostData}
        />
        <Button
          type='primary'
          htmlType='submit'
          className='mt-3 w-full capitalize'
          style={{
            paddingBlock: '20px',
            fontSize: '16px',
            lineHeight: '24px',
            fontWeight: '600',
            borderRadius: 2
          }}
        >
          {t('submitButtonText')}
        </Button>
      </Form>
    </ConfigProvider>
  );
}

export default OrderInfo;
