'use client';

import { Button, ConfigProvider, Form, Skeleton } from 'antd';
import AddressFormItems from './AddressFormItems';
import BillingAddress from './BillingAddress';
import PaymentMethods from './PaymentMethods';
import Contact from './Contact';
import { useLocale, useTranslations } from 'next-intl';
import ShippingCost from './ShippingCost';
import { useForm } from 'antd/es/form/Form';
import {
  ShippingCostsDataType,
  shppingConfigDataType
} from '@/types/shippingCostResponseTypes';
import { useMyContext } from '@/context/Store';
import { ValidateErrorEntity } from 'rc-field-form/lib/interface';
import {
  fetchGraphqlClient,
  fetchGraphqlClientAuthenticated
} from '@/services/graphqlCrud';
import {
  getCartIdFromCookie,
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
import {
  createAddress,
  getUserAddressesData
} from '@/services/shippingAddress';
import { useUser } from '@/context/UserContext';
import {
  getDefaultActiveAddressData,
  getDefaultActiveAddressId
} from '@/services/handleAddresses';
import { validateOrder } from '@/utils/cartUtils';
import { useEffect, useState } from 'react';
import { getShippingCosts } from '@/services/getShippingCostsData';
import Addresses from '@/app/[locale]/account/addresses/page';
import { v4 } from 'uuid';

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
        typeof cartItem?.quantity === 'number' &&
        cartItem.quantity > 0 &&
        cartItem?.product?.data?.id &&
        typeof cartItem?.total_cost === 'number'
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

  // console.log(cartString);

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
            coupon_applied: ${couponId ? `"${couponId}"` : null}
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
                            delivery_zone {
                              zone_name_in_arabic
                              zone_name_in_english
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
                            delivery_zone {
                              zone_name_in_arabic
                              zone_name_in_english
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
  shippingConfigData
}: {
  shippingConfigData: shppingConfigDataType | null;
}) {
  const [form] = useForm();
  const {
    governoratesData,
    // setGlobalLoading,
    cart,
    calculateSubTotalCartCost,
    couponData,
    setCouponData,
    calculateNetDeliveryCost,
    calculateCouponDeductionValue,
    calculateTotalOrderCost,
    setLoadingMessage,
    setErrorMessage,
    setSuccessMessage,
    isCartCheckoutLoading,
    isAddressIsLoading,
    setSelectedGovernorate,
    selectedGovernorate,
    updateGovernoratesData
  } = useMyContext();
  const { addressesData } = useUser();
  const [userId, setUserId] = useState<null | string>(null);

  // console.log(shippingConfigData);

  // const [defaultAddressData, setDefaultAddressData] =
  //   useState<null | AdressType>(null);

  // const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('CheckoutPage.content');
  // const [loading, setLoading] = useState(false);
  // const defaultActiveAddressId =
  //   getDefaultActiveAddressId(addressesData);
  const defaultActiveAddressData =
    getDefaultActiveAddressData(addressesData);

  const isPageLoading = isAddressIsLoading || isCartCheckoutLoading;

  const shippingCompanyData =
    shippingConfigData?.default_shipping_company?.data?.attributes ??
    null;

  const totalOrderCost = calculateTotalOrderCost();

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
      console.log('Invalid order details', {
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
    // console.log(response);
    const data = await response.json();
    // console.log(data);
    // setLoadingMessage(false);

    if (data.success) {
      // Redirect user to Paymob payment URL
      // window.location.href = data.paymentUrl;
      window.location.replace(data.paymentUrl);
    } else {
      console.log('Payment gateway failed', data.error);
      setErrorMessage('Payment gateway failed');
    }
  };

  // Function to handle form submission
  const onFinish = async (formValues: OrderFormValuesType) => {
    try {
      console.log('Received values of form order info: ', formValues);
      const cartId = getCartIdFromCookie() ?? '';
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

      if (!cart || cart.length === 0) {
        setErrorMessage(
          t('formValidationErrorMessages.cartEmptyValidation')
        );
        return;
      }

      console.log(
        'shippingDetailsGovernorate',
        shippingDetailsGovernorate
      );
      console.log('selectedGovernorate', selectedGovernorate);

      const alreadySelectedShippingDeliveryZone =
        governoratesData.find((item) => {
          if (
            item?.zone_name_in_english &&
            defaultActiveAddressData?.delivery_zone
              ?.zone_name_in_english &&
            item.zone_name_in_english ===
              defaultActiveAddressData?.delivery_zone
                ?.zone_name_in_english
          ) {
            return true;
          }
          if (
            item?.zone_name_in_arabic &&
            defaultActiveAddressData?.delivery_zone
              ?.zone_name_in_arabic &&
            item.zone_name_in_arabic ===
              defaultActiveAddressData?.delivery_zone
                ?.zone_name_in_arabic
          ) {
            return true;
          }
          if (
            item?.zone_name_in_english &&
            selectedGovernorate?.zone_name_in_english &&
            item.zone_name_in_english ===
              selectedGovernorate.zone_name_in_english
          ) {
            return true;
          }
          if (
            item?.zone_name_in_arabic &&
            selectedGovernorate?.zone_name_in_arabic &&
            item.zone_name_in_english ===
              selectedGovernorate.zone_name_in_arabic
          ) {
            return true;
          }

          return false;
        }) ?? null;

      console.log('*/*'.repeat(50));
      console.log('governoratesData', governoratesData);
      console.log(
        'defaultActiveAddressData',
        defaultActiveAddressData
      );
      console.log(
        'alreadySelectedShippingDeliveryZone',
        alreadySelectedShippingDeliveryZone
      );
      console.log('*/*'.repeat(50));

      if (alreadySelectedShippingDeliveryZone === null) {
        console.log(
          'Please select a governorate name. If the issue persists, try refreshing the page.'
        );
        console.log(
          'alreadySelectedShippingDeliveryZone',
          alreadySelectedShippingDeliveryZone
        );
        setLoadingMessage(false);
        setErrorMessage(t('form.addressNotFoundError'));
        return;
      }

      const { data: guestUserData, error: guestUserError } =
        (await fetchGraphqlClient(
          updateGuestUserQuery(
            getCookie('guestUserId') ?? '',
            emailOrPhone,
            sendNewsLetter,
            cartId
          )
        )) as UpdateGuestUserResponseType;

      console.log(getCookie('guestUserId'));
      console.log(guestUserData);

      // Create a new address
      const {
        addressData: deliveryAddressId,
        addressError: deliveryAddressError
      } = await createAddress({
        userId: userId,
        guestUserId: getCookie('guestUserId'),
        firstName: capitalize(
          userId && defaultActiveAddressData?.first_name ?
            defaultActiveAddressData.first_name
          : (shippingDetailsFirstName ?? '')
        ),
        lastName: capitalize(
          userId && defaultActiveAddressData?.last_name ?
            defaultActiveAddressData.last_name
          : (shippingDetailsLastName ?? '')
        ),
        address1: capitalize(
          userId && defaultActiveAddressData?.address_1 ?
            defaultActiveAddressData.address_1
          : (shippingDetailsAddress ?? '')
        ),
        address2: capitalize(
          userId && defaultActiveAddressData?.address_2 ?
            defaultActiveAddressData?.address_2
          : (shippingDetailsAddress2 ?? '')
        ),
        building:
          userId && defaultActiveAddressData?.building ?
            defaultActiveAddressData.building
          : shippingDetailsBuilding,
        floor:
          userId && defaultActiveAddressData?.floor ?
            defaultActiveAddressData.floor
          : shippingDetailsFloor,
        apartment:
          userId && defaultActiveAddressData?.apartment ?
            `${defaultActiveAddressData.apartment}`
          : `${shippingDetailsApartment}`,
        city: capitalize(
          userId && defaultActiveAddressData?.city ?
            defaultActiveAddressData.city
          : (shippingDetailsCity ?? '')
        ),
        deliveryZone: {
          zoneNameInArabic:
            alreadySelectedShippingDeliveryZone?.zone_name_in_arabic ??
            null,
          zoneNameInEnglish:
            alreadySelectedShippingDeliveryZone?.zone_name_in_english ??
            null,
          minimumDeliveryDurationInDays:
            alreadySelectedShippingDeliveryZone?.minimum_delivery_duration_in_days ??
            null,
          maximumDeliveryDurationInDays:
            alreadySelectedShippingDeliveryZone?.maximum_delivery_duration_in_days ??
            null
        },
        zipCode:
          userId && defaultActiveAddressData?.zip_code ?
            `${defaultActiveAddressData?.zip_code}`
          : shippingDetailsPostalCode,
        deliveryPhone:
          userId && defaultActiveAddressData?.delivery_phone ?
            defaultActiveAddressData.delivery_phone
          : (shippingDetailsPhone ?? '')
        // userId: getIdFromToken(),
        // guestUserId: getCookie('guestUserId')
      });

      if (deliveryAddressError || !deliveryAddressId) {
        console.log('Failed to create delivery address data');
        console.log(deliveryAddressError);
        console.log(deliveryAddressId);
        setLoadingMessage(false);
        setErrorMessage(t('form.orderCreationError'));
        return;
      }

      // console.warn('deliveryAddressId', deliveryAddressId);
      // console.warn('deliveryAddressError', deliveryAddressError);

      let billingAddressId = deliveryAddressId ?? null;
      if (formValues?.billingMethod === 'different') {
        const alreadySelectedBillingDeliveryZone =
          governoratesData.find((item) => {
            if (
              item?.zone_name_in_english &&
              formValues?.billingDetailsGovernorate &&
              item.zone_name_in_english ===
                formValues.billingDetailsGovernorate
            ) {
              return true;
            }
            if (
              item?.zone_name_in_arabic &&
              formValues?.billingDetailsGovernorate &&
              item.zone_name_in_arabic ===
                formValues.billingDetailsGovernorate
            ) {
              return true;
            }

            return false;
          }) ?? null;

        console.log(
          'alreadySelectedBillingDeliveryZone',
          alreadySelectedBillingDeliveryZone
        );

        const {
          addressData: billingAddressResponseId,
          addressError: billingAddressError
        } = await createAddress({
          userId: getIdFromToken(),
          guestUserId: getCookie('guestUserId'),
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
          deliveryZone: {
            zoneNameInArabic:
              alreadySelectedBillingDeliveryZone?.zone_name_in_arabic ??
              null,
            zoneNameInEnglish:
              alreadySelectedBillingDeliveryZone?.zone_name_in_english ??
              null,
            minimumDeliveryDurationInDays:
              alreadySelectedBillingDeliveryZone?.minimum_delivery_duration_in_days ??
              null,
            maximumDeliveryDurationInDays:
              alreadySelectedBillingDeliveryZone?.maximum_delivery_duration_in_days ??
              null
          },
          zipCode: formValues?.billingDetailsPostalCode ?? '',
          deliveryPhone: formValues?.billingDetailsPhone ?? ''
          // userId: getIdFromToken(),
          // guestUserId: getCookie('guestUserId')
        });

        if (billingAddressError || !billingAddressResponseId) {
          console.log(
            'Failed to create billing address',
            billingAddressError
          );
          console.log(billingAddressResponseId);
          setLoadingMessage(false);
          setErrorMessage(t('form.addressCreationError'));
          return;
        }
        if (billingAddressResponseId) {
          billingAddressId = billingAddressResponseId;
        }
      }
      try {
        await validateOrder({
          cart,
          subTotalCartCost: calculateSubTotalCartCost(),
          userId: getIdFromToken(),
          guestUserId: getCookie('guestUserId'),
          shippingAddressId: deliveryAddressId,
          billingAddressId,
          deliveryCost: calculateNetDeliveryCost(),
          couponAppliedValue: calculateCouponDeductionValue(),
          totalOrderCost,
          generalErrorMessage: t('form.generalError'),
          invalidProductErrorMessage: t('form.invalidProduct'),
          totalCostErrorMessage: t('form.totalCostError')
        });
      } catch (err: any) {
        console.log('Error during form submission:', err);
        console.log('Error message:', err?.message);
        setLoadingMessage(false);
        setErrorMessage(
          err?.message ?? 'Error during form submission'
        );
        // throw new Error(
        //   err?.message ?? 'Error during form submission'
        // );
        return;
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
            totalOrderCost,
            deliveryStatus: 'pending',
            paymentStatus: 'pending'
          })
        )) as CreateOrderResponseType;

      if (
        guestUserError ||
        !guestUserData?.updateGuestUser?.data?.id
      ) {
        console.log('Failed to create guest user data');
        console.log(guestUserError);
        console.log(guestUserData);
        setLoadingMessage(false);
        setErrorMessage(t('form.guestUserError'));
        return;
      }

      // if (addressError || !addressData?.updateAddress?.data?.id) {
      //   console.log('Failed to update address');
      //   console.log(addressError);
      //   console.log(addressData);
      //   setLoadingMessage(false);
      //   setErrorMessage(t('form.addressCreationError'));
      //   return;
      // }

      if (
        orderError ||
        !orderData?.createOrder?.data?.id ||
        !orderData?.createOrder?.data
      ) {
        console.log('Failed to create a new order');
        console.log(orderError);
        console.log(orderData);
        setLoadingMessage(false);
        setErrorMessage(t('form.orderCreationError'));
        return;
      }
      if (orderData?.createOrder?.data) {
        console.log(orderData?.createOrder?.data);
        const response = await uploadInvoicePdf(
          orderData?.createOrder?.data ?? null,
          locale
        );
        // console.log(response);
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
        // console.log('handlePayment was called');
        await handlePayment(paymentData);
      }

      // setLoadingMessage(false);
      setSuccessMessage(t('form.successMessage')); // Trigger success

      if (
        orderData?.createOrder?.data?.attributes?.payment_method ===
        'cash_on_delivery'
      ) {
        router.replace(
          `/checkout/callback?oid=${orderData.createOrder.data.id}`
        );
      }
      // success();
    } catch (err) {
      console.log('Error during form submission:', err);
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
    // console.log('Form failed:', errorInfo);
  };

  // useEffect(() => {
  //   const defaultAddress = async () => {
  //     const userAddressesData = await getUserAddressesData();
  //     console.log(userAddressesData);

  // const defaultAddressData =
  //   (
  //     Array.isArray(userAddressesData) &&
  //     userAddressesData?.length > 0
  //   ) ?
  //     (userAddressesData?.find(
  //       (address) => address?.attributes?.default === true
  //     ) ?? null)
  //   : null;
  //     if (defaultAddressData) {
  //       console.log(defaultAddressData);
  //       setDefaultAddressData(defaultAddressData);
  //     }
  //   };

  //   defaultAddress();
  // }, []);

  // if the user logged in and there was at least an address find the default address and update selected governorate to it and if there is a reload on the cart and addresses changed update the selected governorate to the default address
  useEffect(() => {
    if (
      cart.length > 0 &&
      Array.isArray(addressesData) &&
      addressesData.length > 0 &&
      defaultActiveAddressData
    ) {
      setSelectedGovernorate(
        governoratesData.find(
          (governorate) =>
            (governorate?.zone_name_in_arabic &&
              governorate.zone_name_in_arabic ===
                defaultActiveAddressData?.delivery_zone
                  ?.zone_name_in_arabic) ||
            (governorate?.zone_name_in_english &&
              governorate.zone_name_in_english ===
                defaultActiveAddressData?.delivery_zone
                  ?.zone_name_in_english)
        ) ?? null
      );
    }
    if (cart.length > 0) {
      setSelectedGovernorate(
        governoratesData.find(
          (governorate) =>
            (governorate?.zone_name_in_arabic &&
              governorate.zone_name_in_arabic ===
                selectedGovernorate?.zone_name_in_arabic) ||
            (governorate?.zone_name_in_english &&
              governorate.zone_name_in_english ===
                selectedGovernorate?.zone_name_in_english)
        ) ?? null
      );
    }
    // else {
    //   setSelectedGovernorate(null);
    // }
  }, [
    cart,
    governoratesData,
    defaultActiveAddressData,
    addressesData
  ]);

  // console.log('=-='.repeat(10));
  // console.log(JSON.stringify(selectedGovernorate));
  // console.log('=-='.repeat(10));

  useEffect(() => {
    const userLoggedInId = getIdFromToken();
    setUserId(userLoggedInId);

    if (Array.isArray(cart) && cart.length > 0) {
      const shippingCostsData = getShippingCosts({
        shippingCompanyData,
        shippingConfigData,
        totalOrderCost,
        cart
      });

      // console.log('__*__'.repeat(10));
      // console.log('shippingCostsData', shippingCostsData);
      // console.log('__*__'.repeat(10));

      if (shippingCostsData && shippingCostsData.length > 0) {
        updateGovernoratesData(shippingCostsData);
        // setSelectedGovernorate(null);
      }
    } else {
      console.log('no cart');
      updateGovernoratesData([]);
      // setSelectedGovernorate(null);
    }

    return () => {
      updateGovernoratesData([]);
      setSelectedGovernorate(null);
      setCouponData(null);
    };
  }, [cart]);

  // // To make governate select button has no selection when the cart is updated
  // useEffect(() => {
  //   if (!selectedGovernorate) {
  //     form.setFieldValue('shippingDetailsGovernorate', undefined);
  //   }
  // }, [cart, selectedGovernorate]);

  // console.log(JSON.stringify(governoratesData));
  // console.log('addresses', addressesData);
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
        {isPageLoading ?
          <Skeleton.Node
            key={v4()}
            active={true}
            style={{
              width: '120px',
              height: '32px',
              marginTop: '24px',
              marginBottom: '16px'
            }}
          />
        : <h2 className='mt-4 text-xl font-semibold'>
            {t('deliveryTitle')}
          </h2>
        }

        {userId ?
          isPageLoading ?
            <>
              <div className='mt-4 flex items-center justify-between'>
                <Skeleton.Node
                  key={v4()}
                  active={true}
                  style={{
                    width: '70px',
                    height: '28px'
                  }}
                />
                <Skeleton.Node
                  key={v4()}
                  active={true}
                  style={{
                    width: '120px',
                    height: '32px'
                  }}
                />
              </div>
              <div className='mt-5 grid w-full grid-cols-[repeat(auto-fill,minmax(315px,1fr))] gap-5'>
                <Skeleton.Node
                  key={v4()}
                  active={true}
                  style={{
                    width: '100%',
                    height: '295px',
                    borderRadius: '6px'
                  }}
                />
                <Skeleton.Node
                  key={v4()}
                  active={true}
                  style={{
                    width: '100%',
                    height: '295px',
                    borderRadius: '6px'
                  }}
                />
              </div>
            </>
          : <div className='mt-4'>
              <Addresses
                params={{
                  locale,
                  isAComponent: true
                  // name: 'shippingDetails'
                }}
              />
              {/* <AddressFormItems name='shippingDetails' hidden={false} /> */}
            </div>

        : isPageLoading ?
          <div className='flex w-full flex-col gap-3'>
            <Skeleton.Node
              key={v4()}
              active={true}
              style={{
                width: '100%',
                height: '43px',
                marginBottom: '12px'
              }}
            />
            <div className='mb-3 grid grid-cols-2 sm:gap-4'>
              <Skeleton.Node
                key={v4()}
                active={true}
                style={{ width: '100%', height: '43px' }}
              />
              <Skeleton.Node
                key={v4()}
                active={true}
                style={{ width: '100%', height: '43px' }}
              />
            </div>
            <Skeleton.Node
              key={v4()}
              active={true}
              style={{
                width: '100%',
                height: '43px',
                marginBottom: '12px'
              }}
            />
            <Skeleton.Node
              key={v4()}
              active={true}
              style={{
                width: '100%',
                height: '43px',
                marginBottom: '12px'
              }}
            />
            <div className='mb-3 grid grid-cols-3 sm:gap-4'>
              <Skeleton.Node
                key={v4()}
                active={true}
                style={{
                  width: '100%',
                  height: '43px'
                }}
              />
              <Skeleton.Node
                key={v4()}
                active={true}
                style={{
                  width: '100%',
                  height: '43px'
                }}
              />
              <Skeleton.Node
                key={v4()}
                active={true}
                style={{
                  width: '100%',
                  height: '43px'
                }}
              />
            </div>
            <div className='mb-3 grid grid-cols-3 sm:gap-4'>
              <Skeleton.Node
                key={v4()}
                active={true}
                style={{
                  width: '100%',
                  height: '43px'
                }}
              />
              <Skeleton.Node
                key={v4()}
                active={true}
                style={{
                  width: '100%',
                  height: '43px'
                }}
              />
              <Skeleton.Node
                key={v4()}
                active={true}
                style={{
                  width: '100%',
                  height: '43px'
                }}
              />
            </div>
            <Skeleton.Node
              key={v4()}
              active={true}
              style={{
                width: '100%',
                height: '43px'
              }}
            />
          </div>
        : <AddressFormItems name='shippingDetails' hidden={false} />}

        {/* Shipping Cost*/}
        {isPageLoading ?
          <div className='mt-6 flex flex-col gap-4'>
            <Skeleton.Node
              key={v4()}
              active={true}
              style={{
                width: '145px',
                height: '32px'
              }}
            />
            <Skeleton.Node
              key={v4()}
              active={true}
              style={{
                width: '100%',
                height: '48px'
              }}
            />
          </div>
        : <ShippingCost />}

        {/* Payment Methods*/}
        {isPageLoading ?
          <div className='mt-6 flex flex-col gap-4'>
            <Skeleton.Node
              key={v4()}
              active={true}
              style={{
                width: '145px',
                height: '32px'
              }}
            />
            <Skeleton.Node
              key={v4()}
              active={true}
              style={{
                width: '100%',
                height: '110px'
              }}
            />
          </div>
        : <PaymentMethods form={form} />}

        {/* Billing Address */}
        {isPageLoading ?
          <div className='mb-8 mt-6 flex flex-col gap-4'>
            <Skeleton.Node
              key={v4()}
              active={true}
              style={{
                width: '145px',
                height: '32px'
              }}
            />
            <Skeleton.Node
              key={v4()}
              active={true}
              style={{
                width: '100%',
                height: '48px'
              }}
            />
          </div>
        : <BillingAddress form={form} />}

        {!shippingConfigData?.enable_checkout ?
          isPageLoading ?
            <div className='mb-5 flex flex-col'>
              <Skeleton.Node
                key={v4()}
                active={true}
                style={{
                  width: '100%',
                  height: '48px'
                }}
              />
            </div>
          : <p className='text-lg font-bold text-red-shade-500'>
              {locale === 'ar' ?
                `الموقع قيد التطوير، ستتمكن من الشراء من الموقع قريبًا جدًا 😊`
              : `The site is under development you will able to buy from the
          site very soon 😊`
              }
            </p>

        : null}

        {isPageLoading ?
          <div className='flex flex-col'>
            <Skeleton.Node
              key={v4()}
              active={true}
              style={{
                width: '100%',
                height: '48px',
                borderRadius: '2px'
              }}
            />
          </div>
        : <Button
            type='primary'
            htmlType='submit'
            className='mt-3 w-full capitalize'
            disabled={
              !shippingConfigData?.enable_checkout ? true : false
            }
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
        }
      </Form>
    </ConfigProvider>
  );
}

export default OrderInfo;
