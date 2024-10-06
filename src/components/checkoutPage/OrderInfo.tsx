'use client';

import { Button, ConfigProvider, Form, message } from 'antd';
import AddressFormItems from './AddressFormItems';
import BillingAddress from './BillingAddress';
import PaymentMethods from './PaymentMethods';
import Contact from './Contact';
import { useTranslations } from 'next-intl';
import ShippingCost from './ShippingCost';
import { useForm } from 'antd/es/form/Form';
import { ShippingCostDataType } from '@/types/shippingCostResponseTypes';
import { FreeShippingAttributesType } from '@/types/freeShippingResponseType';
import { useEffect } from 'react';
import { useMyContext } from '@/context/Store';
import { ValidateErrorEntity } from 'rc-field-form/lib/interface';
import { fetchGraphqlClient } from '@/services/graphqlCrud';
import { getCartId, getCookie } from '@/utils/cookieUtils';
import { UpdateGuestUserResponseType } from '@/types/guestUserReponses';
import {
  CreateAddressResponseType,
  updateAddressResponseType
} from '@/types/addressResponseTypes';
import { CreateOrderResponseType } from '@/types/orderResponseTypes';
import { CartDataType } from '@/types/cartResponseTypes';

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
  shippingAddressId,
  city,
  address1,
  address2,
  zipCode,
  guestUserId,
  firstName,
  lastName,
  deliveryPhone,
  shippingCostId
}: {
  shippingAddressId: string;
  city: string;
  address1: string;
  address2?: string;
  zipCode?: number;
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
            zip_code: ${zipCode ?? 0}
            guest_user: ${guestUserId}
            first_name: "${firstName}"
            last_name: "${lastName}"
            delivery_phone: "${deliveryPhone ?? ''}"
            shipping_cost: ${shippingCostId}
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
        cartItem?.cost &&
        cartItem?.total_cost
      ) {
        return `{
          quantity: ${cartItem.quantity},
          cost: ${cartItem.cost},
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
        }
    }
  }`;
};

interface CreateAddressProps {
  city: string;
  address1: string;
  address2: string;
  zipCode: number;
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
  zipCode,
  guestUserId,
  firstName,
  lastName,
  deliveryPhone,
  shippingCostId
}: CreateAddressProps) => {
  return `mutation CreateAddress {
    createAddress(
        data: {
            city: "${city}"
            address_1: "${address1}"
            address_2: "${address2 ?? ''}"
            zip_code: ${zipCode ?? 0}
            guest_user: ${guestUserId ? `"${guestUserId}"` : null}
            first_name: "${firstName}"
            last_name: "${lastName}"
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
  zipCode,
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
          zipCode,
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
  shippingDetailsCity: string;
  shippingDetailsCountry: string;
  shippingDetailsFirstName: string;
  shippingDetailsGovernorate: string;
  shippingDetailsLastName: string;
  shippingDetailsPhone?: string;
  shippingDetailsPostalCode?: number;
  // Optional billing details
  billingDetailsAddress?: string;
  billingDetailsAddress2?: string;
  billingDetailsCity?: string;
  billingDetailsCountry?: string;
  billingDetailsFirstName?: string;
  billingDetailsGovernorate?: string;
  billingDetailsLastName?: string;
  billingDetailsPhone?: string;
  billingDetailsPostalCode?: number;
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
    cart,
    calculateSubTotalCartCost,
    couponData,
    calculateNetDeliveryCost,
    calculateCouponDeductionValue,
    calculateTotalOrderCost
  } = useMyContext();
  const [messageApi, contextHolder] = message.useMessage();
  const t = useTranslations('CheckoutPage.content');

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
        shippingDetailsGovernorate,
        shippingDetailsCity,
        shippingDetailsPostalCode
      } = formValues;

      messageApi.open({
        type: 'loading',
        content: t('form.loading')
      });

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
            city: shippingDetailsCity,
            address1: shippingDetailsAddress,
            address2: shippingDetailsAddress2,
            zipCode: shippingDetailsPostalCode,
            guestUserId: getCookie('guestUserId') ?? '',
            firstName: shippingDetailsFirstName,
            lastName: shippingDetailsLastName,
            deliveryPhone: shippingDetailsPhone,
            shippingCostId: shippingCostId
          })
        )) as updateAddressResponseType;

      let billingAddressId =
        addressData?.updateAddress?.data?.id ?? null;
      if (formValues?.billingMethod === 'different') {
        const { addressData, addressError } =
          await createBillingAddress({
            firstName: formValues?.billingDetailsFirstName ?? '',
            lastName: formValues?.billingDetailsLastName ?? '',
            address1: formValues?.billingDetailsAddress ?? '',
            address2: formValues?.billingDetailsAddress2 ?? '',
            city: formValues?.billingDetailsCity ?? '',
            zipCode: formValues?.billingDetailsPostalCode ?? 0,
            shippingCostId: shippingCostId,
            guestUserId: getCookie('guestUserId'),
            deliveryPhone: formValues?.billingDetailsPhone ?? ''
          });
        if (addressError || !addressData) {
          console.error(
            'Failed to create billing address',
            addressError
          );
          messageApi.error(t('form.addressCreationError'));
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
            userId: null, // 1. TODO: get user value
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
        messageApi.error(t('form.guestUserError'));
      }

      if (addressError || !addressData?.updateAddress?.data?.id) {
        console.error('Failed to create address');
        console.error(addressError);
        console.error(addressData);
        messageApi.error(t('form.addressCreationError'));
      }

      if (orderError || !orderData?.createOrder?.data?.id) {
        console.error('Failed to create a new order');
        console.error(orderError);
        console.error(orderData);
        messageApi.error(t('form.orderCreationError'));
      } else {
        console.log(orderData);
      }

      await messageApi.success(t('form.successMessage'));

      // success();
    } catch (err) {
      console.error('Error during form submission:', err);
      messageApi.error(t('form.orderError'));
    } finally {
      messageApi.destroy();
    }
  };

  // Function to handle form submission failure (validation errors)
  const onFinishFailed = (errorInfo: ValidateErrorEntity<any>) => {
    messageApi.error(
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
      {contextHolder}
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
