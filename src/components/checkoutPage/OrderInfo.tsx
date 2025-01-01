'use client';

import { Button, ConfigProvider, Form } from 'antd';
import AddressFormItems from './AddressFormItems';
import BillingAddress from './BillingAddress';
import PaymentMethods from './PaymentMethods';
import Contact from './Contact';
import { useLocale, useTranslations } from 'next-intl';
import ShippingCost from './ShippingCost';
import { useForm } from 'antd/es/form/Form';
import { ShippingCostDataType } from '@/types/shippingCostResponseTypes';
import { useMyContext } from '@/context/Store';
import { ValidateErrorEntity } from 'rc-field-form/lib/interface';
import { fetchGraphqlClient } from '@/services/graphqlCrud';
import {
  getCartId,
  getCookie,
  getIdFromToken
} from '@/utils/cookieUtils';
import { UpdateGuestUserResponseType } from '@/types/guestUserReponses';
import { CreateOrderResponseType } from '@/types/orderResponseTypes';
import { CartDataType } from '@/types/cartResponseTypes';
import { uploadInvoicePdf } from '@/services/invoicesPDFHandlers';
import { capitalize } from '@/utils/helpers';
import { useRouter } from '@/navigation';
import { PaymentDataType } from '@/types/paymentResonseType';
import { fetchGraphqlServerWebAuthenticated } from '@/services/graphqlCrudServerOnly';
import { createAddress } from '@/services/shippingAddress';
import { useUser } from '@/context/UserContext';
import { getDefaultActiveAddressId } from '@/services/handleAddresses';

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

// const createAddressQuery = ({
//   userId,
//   // shippingAddressId,
//   city,
//   address1,
//   address2,
//   building,
//   floor,
//   apartment,
//   zipCode,
//   guestUserId,
//   firstName,
//   lastName,
//   deliveryPhone,
//   shippingCostId
// }: {
//   userId: string | null;
//   // shippingAddressId: string;
//   city: string;
//   address1: string;
//   address2?: string;
//   building: string;
//   floor: string;
//   apartment: string;
//   zipCode?: string;
//   guestUserId: string;
//   firstName: string;
//   lastName: string;
//   deliveryPhone?: string;
//   shippingCostId: string;
// }) => {
//   return `mutation CreateAddress {
//     createAddress(
//         data: {
//             city: "${city}"
//             address_1: "${address1}"
//             address_2: "${address2 ?? ''}"
//             zip_code: ${!isNaN(Number(zipCode)) ? Number(zipCode) : 0}
//             apartment: ${!isNaN(Number(apartment)) ? Number(apartment) : 0}
//             guest_user: ${guestUserId ? `"${guestUserId}"` : null}
//             first_name: "${firstName}"
//             last_name: "${lastName}"
//             delivery_phone: "${deliveryPhone ?? ''}"
//             shipping_cost: ${shippingCostId}
//             user: ${userId ? `"${userId}"` : null}
//             building: "${building}"
//             floor: "${floor}"
//             publishedAt: "${new Date().toISOString()}"
//         }
//     ) {
//         data {
//             id
//         }
//     }
//   }`;
// };

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
        // this was on the last line on the return down after the parenthesis // description: "${cartItem?.product?.data?.attributes?.description ?? ''}"
      ) {
        return `{
          quantity: ${cartItem.quantity},
          total_cost: ${cartItem.total_cost},
          product: ${cartItem.product.data.id},
          description: "(Product ID: ${cartItem?.id ?? ''})"
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
                billing_address {
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
                                description
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

interface OrderFormValuesType {
  billingMethod: 'same' | 'different';
  emailOrPhone: string;
  paymentMethod: 'card' | 'cash_on_delivery';
  sendNewsLetter: boolean;
  shippingDetailsAddress: string;
  shippingDetailsAddress2?: string;
  shippingDetailsBuilding: string;
  shippingDetailsFloor: string;
  shippingDetailsApartment: string;
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
  billingDetailsApartment: string;
  billingDetailsCity?: string;
  billingDetailsCountry?: string;
  billingDetailsFirstName?: string;
  billingDetailsGovernorate?: string;
  billingDetailsLastName?: string;
  billingDetailsPhone?: string;
  billingDetailsPostalCode?: string;
}

function OrderInfo({
  shippingCostData
}: {
  shippingCostData: ShippingCostDataType[] | [];
}) {
  const [form] = useForm();
  const {
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
    setSuccessMessage,
    isCartCheckoutLoading,
    isAddressIsLoading
  } = useMyContext();
  const { addressesData } = useUser();
  // const [defaultAddress, setDefaultAddress] =
  //   useState<null | AdressesType>(null);

  // const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('CheckoutPage.content');
  // const [loading, setLoading] = useState(false);
  const defaultActiveAddressId =
    getDefaultActiveAddressId(addressesData);

  console.log('defaultActiveAddressId', defaultActiveAddressId);

  const isPageLoading = isAddressIsLoading || isCartCheckoutLoading;

  const handlePayment = async ({
    emailOrPhone,
    shippingAddressData,
    billingAddressData,
    total_order_cost,
    items,
    order_id
  }: PaymentDataType) => {
    // setLoadingMessage(true);

    // const customerDetails = {
    //   first_name: 'John',
    //   last_name: 'Doe',
    //   phone_number: '+201234567890',
    //   email: 'johndoe@example.com',
    //   city: 'Cairo',
    //   country: 'EG',
    //   street: '123 Nile Street',
    //   building: '12',
    //   floor: '5',
    //   apartment: '20'
    // };
    if (
      !emailOrPhone ||
      shippingAddressData === null ||
      billingAddressData === null ||
      total_order_cost === null ||
      items === null ||
      order_id === null
    ) {
      console.error('Invalid order details', {
        emailOrPhone,
        shippingAddressData,
        billingAddressData,
        total_order_cost,
        items,
        order_id
      });
      setErrorMessage('Invalid order details');
    }

    const response = await fetch('/api/paymob', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        emailOrPhone,
        shippingAddressData,
        billingAddressData,
        total_order_cost,
        items,
        order_id
      })
    });
    console.log(response);
    const data = await response.json();
    console.log(data);
    // setLoadingMessage(false);

    if (data.success) {
      // Redirect user to Paymob payment URL
      // window.location.href = data.paymentUrl;
      window.location.replace(data.paymentUrl);
    } else {
      console.error('Payment gateway failed', data.error);
      setErrorMessage('Payment gateway failed');
    }
  };

  // Function to handle form submission
  const onFinish = async (formValues: OrderFormValuesType) => {
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

      // Create a new address
      const {
        addressData: deliveryAddressId,
        addressError: deliveryAddressError
      } = await createAddress({
        firstName: capitalize(shippingDetailsFirstName ?? ''),
        lastName: capitalize(shippingDetailsLastName ?? ''),
        address1: capitalize(shippingDetailsAddress ?? ''),
        address2: capitalize(shippingDetailsAddress2 ?? ''),
        building: shippingDetailsBuilding,
        floor: shippingDetailsFloor,
        apartment: shippingDetailsApartment,
        city: capitalize(shippingDetailsCity ?? ''),
        shippingCostId: shippingCostId,
        zipCode: shippingDetailsPostalCode,
        deliveryPhone: shippingDetailsPhone ?? ''
        // userId: getIdFromToken(),
        // guestUserId: getCookie('guestUserId')
      });

      if (deliveryAddressError || !deliveryAddressId) {
        console.error('Failed to create delivery address data');
        console.error(deliveryAddressError);
        console.error(deliveryAddressId);
        setLoadingMessage(false);
        setErrorMessage(t('form.orderCreationError'));
        return;
      }

      // console.warn('deliveryAddressId', deliveryAddressId);
      // console.warn('deliveryAddressError', deliveryAddressError);

      let billingAddressId = deliveryAddressId ?? null;
      if (formValues?.billingMethod === 'different') {
        const {
          addressData: billingAddressResponseId,
          addressError: billingAddressError
        } = await createAddress({
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
          building: formValues?.billingDetailsBuilding ?? '',
          floor: formValues?.billingDetailsFloor ?? '',
          apartment: formValues?.billingDetailsApartment ?? '0',
          city: capitalize(formValues?.billingDetailsCity ?? ''),
          shippingCostId: shippingCostId,
          zipCode: formValues?.billingDetailsPostalCode ?? '',
          deliveryPhone: formValues?.billingDetailsPhone ?? ''
          // userId: getIdFromToken(),
          // guestUserId: getCookie('guestUserId')
        });

        if (billingAddressError || !billingAddressResponseId) {
          console.error(
            'Failed to create billing address',
            billingAddressError
          );
          console.error(billingAddressResponseId);
          setLoadingMessage(false);
          setErrorMessage(t('form.addressCreationError'));
          return;
        }
        if (billingAddressResponseId) {
          billingAddressId = billingAddressResponseId;
        }
      }

      const { data: orderData, error: orderError } =
        (await fetchGraphqlServerWebAuthenticated(
          createOrderQuery({
            cart,
            subTotalCartCost: calculateSubTotalCartCost(),
            userId: getIdFromToken(), // 1. TODO: get user value
            guestUserId: getCookie('guestUserId'),
            shippingAddressId: deliveryAddressId,
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

      // if (addressError || !addressData?.updateAddress?.data?.id) {
      //   console.error('Failed to update address');
      //   console.error(addressError);
      //   console.error(addressData);
      //   setLoadingMessage(false);
      //   setErrorMessage(t('form.addressCreationError'));
      //   return;
      // }

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
      console.log(orderData?.createOrder?.data);
      if (orderData?.createOrder?.data) {
        const response = await uploadInvoicePdf(
          orderData?.createOrder?.data ?? null
        );
        console.log(response);
      }

      const paymentData: PaymentDataType = {
        emailOrPhone,
        billingAddressData:
          orderData?.createOrder?.data?.attributes?.billing_address
            ?.data?.attributes ?? null,
        shippingAddressData:
          orderData?.createOrder?.data?.attributes?.shipping_address
            ?.data?.attributes ?? null,
        items: orderData?.createOrder?.data?.attributes?.cart ?? null,
        order_id: orderData?.createOrder?.data?.id ?? null,
        total_order_cost:
          orderData?.createOrder?.data?.attributes
            ?.total_order_cost ?? null
      };

      if (
        orderData?.createOrder?.data?.attributes?.payment_method ===
        'card'
      ) {
        console.log('handlePayment was called');
        await handlePayment(paymentData);
      }

      setLoadingMessage(false);
      setSuccessMessage(t('form.successMessage')); // Trigger success

      if (
        orderData?.createOrder?.data?.attributes?.payment_method ===
        'cash_on_delivery'
      ) {
        router.push(
          `/checkout/callback?oid=${orderData.createOrder.data.id}`
        );
      }
      // success();
    } catch (err) {
      console.error('Error during form submission:', err);
      setLoadingMessage(false);
      setErrorMessage(t('form.orderError'));
    } finally {
      setLoadingMessage(false);
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

  console.log('addresses', addressesData);
  // console.log('default address', defaultAddress);

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
          // paymentMethod: 'card',
          paymentMethod: 'cash_on_delivery',
          billingMethod: 'same'
        }}
      >
        {/* Deliver Section */}
        <Contact isPageLoading={isPageLoading} />
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
        <p className='text-lg font-bold text-red-shade-500'>
          {locale === 'ar' ?
            `الموقع قيد التطوير، ستتمكن من الشراء من الموقع قريبًا جدًا 😊`
          : `The site is under development you will able to buy from the
          site very soon 😊`
          }
        </p>
        <Button
          type='primary'
          htmlType='submit'
          className='mt-3 w-full capitalize'
          disabled={true}
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
