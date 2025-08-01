'use client';

import { usePathname, useRouter } from '@/navigation';
import { getCookie, getIdFromToken } from '@/utils/cookieUtils';
import {
  Button,
  Checkbox,
  ConfigProvider,
  Empty,
  Form,
  Input,
  Modal,
  Popconfirm,
  Radio,
  Spin
} from 'antd';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import AddressFormItems from '@/components/checkoutPage/AddressFormItems';
import { useForm } from 'antd/es/form/Form';
import { useMyContext } from '@/context/Store';
import {
  createAddress,
  deleteAddress,
  getShippingQuery,
  getUserAddressAuthenticated,
  getUserAddressesAuthenticated,
  getUserAddressesData,
  updateAddress,
  updateUserAddresses
} from '@/services/shippingAddress';
import { capitalize } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { fetchGraphqlClient } from '@/services/graphqlCrud';
import {
  GetShippingCostResponseType,
  ShippingCostsDataType,
  shppingConfigDataType
} from '@/types/shippingCostResponseTypes';
import type { RadioChangeEvent } from 'antd';
import { useUser } from '@/context/UserContext';
import {
  getDefaultActiveAddressId,
  updateDefaultAddressHandler
} from '@/services/handleAddresses';
import { fetchGraphqlServerWebAuthenticated } from '@/services/graphqlCrudServerOnly';

interface AddressFormValuesType {
  addressName: string;
  isDefault: boolean;
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
}

function Addresses({
  params: { locale, isAComponent }
}: {
  params: { locale: string; isAComponent?: boolean };
}) {
  const [isLoading, setIsloading] = useState(true);
  const t = useTranslations('AccountLayoutPage.AddressPage.content');
  const checkoutTranslation = useTranslations('CheckoutPage.content');
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const {
    governoratesData,
    setErrorMessage,
    setSuccessMessage,
    updateGovernoratesData
  } = useMyContext();
  const { addressesData, setAddressesData } = useUser();

  // const { contextHolder } = useHandleMessagePopup();
  console.log(addressesData);

  const [open, setOpen] = useState<boolean>(false);
  const [formAddress] = useForm<AddressFormValuesType>();

  // const [shippingCostData, setShippingCostData] =
  //   useState<null | shppingConfigDataType>(null);
  // const [defaultActiveAddress, setDefaultActiveAddress] = useState<
  //   string | null
  // >(null);
  const [modalLoading, setModalLoading] = useState<boolean>(false);
  const [editAddressId, setEditAddressId] = useState<null | string>(
    null
  );
  const defaultActiveAddressId =
    getDefaultActiveAddressId(addressesData);

  // const { didMount: isFirstRender } = useIsMount();

  console.log('defaultActiveAddress', defaultActiveAddressId);
  console.log('editAddressId', editAddressId);
  console.log('modalLoading', modalLoading);

  const showModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setEditAddressId(null);
    formAddress.resetFields();
  };

  // useEffect(() => {
  //   if (addressesData && addressesData.length > 0) {
  //     setDefaultActiveAddress(() => {
  //       return (
  //         addressesData
  //           .map((address) =>
  //             address?.attributes?.default ? address.id : null
  //           )
  //           .filter((address) => address)
  //           .at(-1) ?? addressesData[0].id
  //       );
  //     });
  //   }
  // }, [addressesData]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userId = getIdFromToken();
      if (userId) {
        setIsloading(false);
      }
    }
  }, [searchParams, pathname, router]);

  useEffect(() => {
    const getShippingCostData = async () => {
      const { data: shippingCostData, error: shippingCostError } =
        (await fetchGraphqlServerWebAuthenticated(
          getShippingQuery()
        )) as GetShippingCostResponseType;
      if (shippingCostError || !shippingCostData) {
        console.error(shippingCostError);
        return;
      }

      const shippingConfigData =
        shippingCostData?.shippingConfig?.data?.attributes ?? null;
      const governoratesData =
        shippingConfigData?.default_shipping_company?.data?.attributes
          ?.delivery_zones ?? [];

      if (shippingConfigData) {
        // setShippingCostData(shippingConfigData);
        updateGovernoratesData(governoratesData);
      }
      // const { data: shippingCostData, error: shippingCostError } =
      //   (await fetchGraphqlClient(
      //     getShippingQuery(locale)
      //   )) as GetShippingCostResponseType;
      // if (shippingCostError || !shippingCostData) {
      //   console.error(shippingCostError);
      //   return;
      // }

      // setShippingCostData(
      //   shippingCostData?.shippingCosts?.data ?? []
      // );
    };

    if (!isAComponent) getShippingCostData();
  }, [locale]);

  useEffect(() => {
    if (
      !defaultActiveAddressId &&
      addressesData &&
      addressesData.length > 0 &&
      addressesData[0]?.id
    ) {
      console.warn('updating default active address');
      updateDefaultAddressHandler({
        newDefaultAddressId: addressesData[0].id,
        addressesData,
        setErrorMessage,
        setAddressesData
      });
    }
  }, [addressesData]);

  // useEffect(
  //   () => {
  //     if (
  //       !addressesData ||
  //       addressesData?.length <= 0 ||
  //       typeof defaultActiveAddress !== 'string' ||
  //       isFirstRender
  //     ) {
  //       return;
  //     }

  //     const newArr = addressesData.map((address) => ({
  //       id: address?.id ?? null,
  //       isDefault: address?.attributes?.default ?? false
  //     }));

  //     const updateDefaultAddressHandler = async () => {
  //       const {
  //         addressesData: updatedAddressesData,
  //         addressesError
  //       } = await updateDefaultAddress({
  //         addresses: newArr,
  //         defaultAddressId: defaultActiveAddress
  //       });

  //       if (addressesError || !updatedAddressesData) {
  //         console.error('addressesError', addressesError);
  //         console.error('updatedAddressesData', updatedAddressesData);
  //         setErrorMessage(
  //           typeof addressesError === 'string' ? addressesError : (
  //             'Some thing went wrong'
  //           )
  //         );
  //         return;
  //       }

  //       console.log(updatedAddressesData);
  //       setAddressesData(updatedAddressesData);
  //     };

  //     updateDefaultAddressHandler();
  //   },
  //   [
  //     // defaultActiveAddress,
  //     // addressesData,
  //     // // isFirstRender,
  //     // setAddressesData,
  //     // setErrorMessage
  //   ]
  // );

  // Function to handle form submission
  const onFinish = async (formValues: AddressFormValuesType) => {
    try {
      console.log('Received values of form: ', formValues);
      const {
        addressName,
        isDefault,
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

      const selectedDeliveryZone =
        governoratesData.find((item) =>
          locale === 'ar' ?
            item?.zone_name_in_arabic &&
            item?.zone_name_in_arabic === shippingDetailsGovernorate
          : item?.zone_name_in_english &&
            item?.zone_name_in_english === shippingDetailsGovernorate
        ) ?? null;

      // Create a new address
      const {
        addressData: deliveryAddressId,
        addressError: deliveryAddressError
      } = await createAddress({
        userId: getIdFromToken(),
        guestUserId: getCookie('guestUserId'),
        addressName: capitalize(addressName ?? ''),
        isDefault: isDefault ?? false,
        firstName: capitalize(shippingDetailsFirstName ?? ''),
        lastName: capitalize(shippingDetailsLastName ?? ''),
        address1: capitalize(shippingDetailsAddress ?? ''),
        address2: capitalize(shippingDetailsAddress2 ?? ''),
        building: shippingDetailsBuilding,
        floor: shippingDetailsFloor,
        apartment: shippingDetailsApartment,
        city: capitalize(shippingDetailsCity ?? ''),
        deliveryZone:
          selectedDeliveryZone !== null ?
            {
              zoneNameInArabic:
                selectedDeliveryZone?.zone_name_in_arabic ?? null,
              zoneNameInEnglish:
                selectedDeliveryZone?.zone_name_in_english ?? null,
              minimumDeliveryDurationInDays:
                selectedDeliveryZone?.minimum_delivery_duration_in_days ??
                0,
              maximumDeliveryDurationInDays:
                selectedDeliveryZone?.maximum_delivery_duration_in_days ??
                0
            }
          : null,
        zipCode: shippingDetailsPostalCode,
        deliveryPhone: shippingDetailsPhone ?? ''
        // userId: getIdFromToken(),
        // guestUserId: getCookie('guestUserId')
      });

      if (deliveryAddressError || !deliveryAddressId) {
        console.error('Failed to create delivery address');
        console.error(deliveryAddressError);
        console.error(deliveryAddressId);
        setErrorMessage('Failed to create delivery address');
        return null;
      }

      console.log('Created address id', deliveryAddressId);
      // setSuccessMessage(checkoutTranslation('form.successMessage'));
      return deliveryAddressId;
    } catch (err) {
      console.error('Error occured while creating new address:', err);
      setErrorMessage('Error occured while creating new address');
      return null;
    }
  };

  const onEditFinish = async (
    formValues: AddressFormValuesType,
    addressId: string | null
  ) => {
    try {
      const {
        addressName,
        isDefault,
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

      setModalLoading(true);

      const selectedDeliveryZone =
        governoratesData.find((item) =>
          locale === 'ar' ?
            item?.zone_name_in_arabic &&
            item?.zone_name_in_arabic === shippingDetailsGovernorate
          : item?.zone_name_in_english &&
            item?.zone_name_in_english === shippingDetailsGovernorate
        ) ?? null;

      // update address
      const {
        addressData: deliveryAddressId,
        addressError: deliveryAddressError
      } = await updateAddress({
        addressId: addressId,
        addressName: capitalize(addressName ?? ''),
        isDefault: isDefault ?? false,
        firstName: capitalize(shippingDetailsFirstName ?? ''),
        lastName: capitalize(shippingDetailsLastName ?? ''),
        address1: capitalize(shippingDetailsAddress ?? ''),
        address2: capitalize(shippingDetailsAddress2 ?? ''),
        building: shippingDetailsBuilding,
        floor: shippingDetailsFloor,
        apartment:
          !isNaN(Number(shippingDetailsApartment)) ?
            Number(shippingDetailsApartment)
          : 0,
        city: capitalize(shippingDetailsCity ?? ''),
        deliveryZone:
          selectedDeliveryZone !== null ?
            {
              zoneNameInArabic:
                selectedDeliveryZone?.zone_name_in_arabic ?? null,
              zoneNameInEnglish:
                selectedDeliveryZone?.zone_name_in_english ?? null,
              minimumDeliveryDurationInDays:
                selectedDeliveryZone?.minimum_delivery_duration_in_days ??
                null,
              maximumDeliveryDurationInDays:
                selectedDeliveryZone?.maximum_delivery_duration_in_days ??
                null
            }
          : null,
        zipCode:
          !isNaN(Number(shippingDetailsPostalCode)) ?
            Number(shippingDetailsPostalCode)
          : 0,
        deliveryPhone: shippingDetailsPhone ?? ''
        // userId: getIdFromToken(),
        // guestUserId: getCookie('guestUserId')
      });

      if (deliveryAddressError || !deliveryAddressId) {
        console.error('Failed to edit delivery address');
        console.error(deliveryAddressError);
        console.error(deliveryAddressId);
        setErrorMessage('Failed to edit delivery address');
        return null;
      }

      console.log('edit address id', deliveryAddressId);
      // setSuccessMessage(checkoutTranslation('form.successMessage'));
      return deliveryAddressId;
    } catch (err) {
      console.error('Error occured while editing address:', err);
      setErrorMessage('Error occured while editing address');
      return null;
    } finally {
      setModalLoading(false);
    }
  };

  // Function to handle form submission failure (validation errors)
  const onFinishFailed = (errorInfo: any) => {
    setModalLoading(false);
    setErrorMessage(
      errorInfo?.errorFields[0]?.errors[0] ??
        'Failed to apply your changes'
    );
    console.error('Address update form failed:', errorInfo);
  };

  const handleSubmit = async () => {
    try {
      console.log('handleSubmit was called');
      const fields: AddressFormValuesType =
        await formAddress.validateFields();

      console.log('fields', fields);
      setModalLoading(true);

      const createdAddressId = await onFinish(fields);
      console.log('createdAddressId', createdAddressId);

      if (!createdAddressId) {
        throw new Error(
          checkoutTranslation('form.formSubmissionFailed')
        );
        // await getAddressData();
      }

      const addressesId = [
        ...(addressesData
          ?.map((address) => address?.id ?? null)
          .filter((address) => address) ?? []),
        createdAddressId
      ];
      console.log(addressesId);
      const {
        addressesData: updatedAddressesData,
        addressesError: updatedAdderssesError
      } = await updateUserAddresses({
        addressesId: addressesId
      });

      if (updatedAdderssesError || !updatedAddressesData) {
        console.error(updatedAdderssesError);
        throw new Error(
          checkoutTranslation('form.formSubmissionFailed')
        );
      }

      const isDefaultChecked = fields?.isDefault ?? false;
      console.log(isDefaultChecked);
      if (!isDefaultChecked) {
        setAddressesData(updatedAddressesData);
        setSuccessMessage(checkoutTranslation('form.successMessage'));

        formAddress.resetFields();
        setOpen(false);
        return;
      }

      const updatedAddresses = await updateDefaultAddressHandler({
        newDefaultAddressId: `${createdAddressId}`,
        addressesData: updatedAddressesData,
        setAddressesData,
        setErrorMessage
      });
      console.log(
        'updatedAddresses updatedAddresses',
        updatedAddresses
      );
      setSuccessMessage(checkoutTranslation('form.successMessage'));
      formAddress.resetFields();
      setOpen(false);
    } catch (err) {
      console.error('Failed to validate fields:', err);
      onFinishFailed(err);
    } finally {
      setModalLoading(false);
    }
  };

  const handleEdit = async () => {
    try {
      const fields = await formAddress.validateFields();
      console.log('fields', fields);

      setModalLoading(true);

      const updatedAddressId = await onEditFinish(
        fields,
        editAddressId
      );
      console.log('updatedAddressId', updatedAddressId);

      if (!updatedAddressId) {
        throw new Error(
          checkoutTranslation('form.formSubmissionFailed')
        );
      }

      const isDefaultChecked = fields?.isDefault ?? false;
      console.log(isDefaultChecked);
      const newAddressesData = await getUserAddressesData();
      console.log(newAddressesData);
      if (!isDefaultChecked) {
        setAddressesData(newAddressesData);
        setSuccessMessage(checkoutTranslation('form.successMessage'));

        setOpen(false);
        setEditAddressId(null);
        formAddress.resetFields();
        return;
      }

      const updatedAddresses = await updateDefaultAddressHandler({
        newDefaultAddressId: `${editAddressId}`,
        addressesData: newAddressesData,
        setAddressesData,
        setErrorMessage
      });
      console.log('edit updatedAddresses', updatedAddresses);
      setSuccessMessage(checkoutTranslation('form.successMessage'));

      setOpen(false);
      setEditAddressId(null);
      formAddress.resetFields();
    } catch (err) {
      console.error('Failed to validate fields:', err);
      onFinishFailed(err);
    } finally {
      setModalLoading(false);
    }
  };

  const editAddressHandler = async (id: string) => {
    setOpen(true);
    setModalLoading(true);
    setEditAddressId(id);

    // formAddress.setFieldsValue({addressName: "sfd"})

    new Promise((resolve, reject) => {
      getUserAddressAuthenticated(id)
        .then(({ addressData, addressError }) => {
          if (addressError) {
            reject(addressError);
            return;
          }
          console.log(addressData);
          if (!addressData) {
            reject('Failed to fetch address');
            return;
          }

          // I added setTimeout here to get rid of this error `Instance created by `useForm` is not connected to any Form element. Forget to pass `form` prop?`
          setTimeout(function () {
            formAddress.setFieldsValue({
              addressName:
                addressData?.attributes?.address_name ?? '',
              isDefault: addressData?.attributes?.default ?? false,
              shippingDetailsFirstName:
                addressData?.attributes?.first_name ?? '',
              shippingDetailsLastName:
                addressData?.attributes?.last_name ?? '',
              shippingDetailsPhone:
                addressData?.attributes?.delivery_phone ?? '',
              shippingDetailsAddress:
                addressData?.attributes?.address_1 ?? '',
              shippingDetailsAddress2:
                addressData?.attributes?.address_2 ?? '',
              shippingDetailsBuilding:
                addressData?.attributes?.building ?? '',
              shippingDetailsFloor:
                addressData?.attributes?.floor ?? '',
              shippingDetailsApartment: `${addressData?.attributes?.apartment ?? ''}`,
              shippingDetailsGovernorate:
                locale === 'ar' ?
                  (
                    addressData?.attributes?.delivery_zone
                      ?.zone_name_in_arabic
                  ) ?
                    addressData?.attributes?.delivery_zone
                      ?.zone_name_in_arabic
                  : ''
                : (
                  addressData?.attributes?.delivery_zone
                    ?.zone_name_in_english
                ) ?
                  addressData?.attributes?.delivery_zone
                    ?.zone_name_in_english
                : '',
              shippingDetailsCity:
                addressData?.attributes?.city ?? '',
              shippingDetailsPostalCode: `${addressData?.attributes?.zip_code || ''}`
            });
          }, 0);

          resolve(addressData);
        })
        .catch((error) => {
          console.error(error);
          return;
        })
        .finally(() => {
          setModalLoading(false);
        });
    });
  };

  const onChange = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value);
    // setDefaultActiveAddress(e.target.value);

    updateDefaultAddressHandler({
      newDefaultAddressId: e.target.value,
      addressesData,
      setAddressesData,
      setErrorMessage
    });
  };

  const confirmDelete = async (addressId: string | null) => {
    const { deletedAddressId, deletedAddressError } =
      await deleteAddress(addressId);

    if (deletedAddressError || !deletedAddressId) {
      console.error(deletedAddressError);
      setErrorMessage(deletedAddressError);
      return;
    }

    const newAddresses = await getUserAddressesData();
    setAddressesData(newAddresses);
    setSuccessMessage('Address was deleted successfully');
  };

  // console.log(addressesData);
  // console.log(defaultActiveAddress);

  return isLoading ?
      <Spin
        className='grid min-h-full w-full place-content-center'
        size='large'
      />
    : <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#1d4ed8',
            colorBorder: '#dedede',
            colorTextPlaceholder: '#9b9b9bbd',
            fontFamily: 'var(--font-inter)',
            borderRadius: 4,
            lineWidth: 1
          },
          components: {
            Button: {
              colorPrimary: '#1d4ed8',
              colorPrimaryBg: '#1d4ed8',
              colorPrimaryActive: '#1e40af',
              colorPrimaryHover: '#1e40af',
              paddingInline: 20,
              paddingBlock: 10,
              fontSize: 14,
              lineHeight: 20,
              fontWeight: 500,
              controlHeight: 40
            },
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
        {/* {contextHolder} */}
        <section
          className={`addresses-page ${isAComponent ? '' : 'min-h-screen'} w-full font-inter`}
        >
          <div className={`w-full ${isAComponent ? 'pb-4' : 'pb-8'}`}>
            <div className='flex flex-wrap items-center justify-between gap-4'>
              <h2
                className={`${isAComponent ? 'text-lg text-blue-sky-dark' : 'text-xl text-blue-darker'} font-semibold`}
              >
                {t('title')}
              </h2>

              {addressesData && addressesData.length <= 100 && (
                <Button
                  type='primary'
                  onClick={showModal}
                  size={isAComponent ? 'small' : 'middle'}
                  style={{
                    paddingBlock: isAComponent ? '15px' : '10px',
                    paddingInline: isAComponent ? '15px' : '20px',
                    backgroundColor:
                      isAComponent ? '#1773b0' : '#1d4ed8'
                  }}
                >
                  {t('addNewAddressButton')}
                </Button>
              )}
            </div>

            {/* content addresses */}
            <div className={isAComponent ? 'mt-4' : 'mt-8'}>
              {addressesData && addressesData.length > 0 ?
                <Radio.Group
                  style={{
                    width: '100%',
                    display: 'grid',
                    gap: '20px',
                    gridTemplateColumns:
                      'repeat(auto-fill, minmax(315px, 1fr))'
                  }}
                  // id='shippingAddress'
                  name='defaultAddress'
                  // defaultValue={defaultActiveAddress}
                  value={defaultActiveAddressId}
                  onChange={onChange}
                >
                  {addressesData.map((address, i) => {
                    const comma = locale === 'ar' ? '،' : ',';
                    return (
                      <div
                        className={`${defaultActiveAddressId === address.id ? `${isAComponent ? 'chekoutPage border-blue-sky-dark' : 'border-blue-light'} shadow-featuredHovered` : 'border-gray-light shadow-featured'} rounded-md border p-4`}
                        key={i}
                      >
                        <Radio
                          value={address.id}
                          style={{
                            width: '100%'
                            // backgroundColor:
                            //   isAComponent ? '#1773b0' : '##1d4ed8'
                          }}
                        >
                          <div className='flex h-full w-full flex-col justify-between'>
                            <div className='flex flex-col flex-wrap gap-1 pl-2 font-inter'>
                              <h3 className='font-semibold capitalize'>
                                {address?.attributes?.address_name ??
                                  ''}
                              </h3>
                              <p className='capitalize'>
                                <span>
                                  {address?.attributes?.first_name ??
                                    ''}
                                </span>{' '}
                                <span>
                                  {address?.attributes?.last_name ??
                                    ''}
                                </span>
                              </p>
                              <p className='capitalize'>
                                <span>
                                  {address?.attributes?.address_1 ??
                                    ''}
                                  {comma}{' '}
                                </span>
                                {address?.attributes?.address_2 && (
                                  <span>
                                    {address?.attributes?.address_2}{' '}
                                    {comma}
                                  </span>
                                )}
                              </p>
                              <p className='capitalize'>
                                <span>
                                  {t('card.building')}{' '}
                                  {address?.attributes?.building ??
                                    ''}
                                  {comma}{' '}
                                </span>
                                <span>
                                  {t('card.floor')}{' '}
                                  {address?.attributes?.floor ?? ''}
                                  {comma}{' '}
                                </span>
                                <span>
                                  {t('card.apartment')}{' '}
                                  {address?.attributes?.apartment ??
                                    ''}
                                  {comma}{' '}
                                </span>
                              </p>
                              <p>
                                <span className='capitalize'>
                                  {locale === 'ar' ?
                                    address?.attributes?.delivery_zone
                                      ?.zone_name_in_arabic || ''
                                  : address?.attributes?.delivery_zone
                                      ?.zone_name_in_english || ''
                                  }
                                  {comma}{' '}
                                </span>
                                <span className='capitalize'>
                                  {address?.attributes?.city ?? ''}
                                  {comma}{' '}
                                </span>
                                <span>
                                  {locale === 'ar' ?
                                    'مصر' + comma + ' '
                                  : 'Egypt' + comma + ' '}
                                </span>
                                <span className='capitalize'>
                                  {t('card.postalCode')}{' '}
                                  {address?.attributes?.zip_code ??
                                    ''}{' '}
                                  {comma}
                                </span>
                              </p>
                              <p>
                                {address?.attributes
                                  ?.delivery_phone ?? ''}
                              </p>
                            </div>
                            <div className='space-y-1'>
                              {defaultActiveAddressId === address.id ?
                                <div className='my-4 w-fit rounded bg-green-dark px-4 py-2 text-white'>
                                  {t('card.defaultAddress')}
                                </div>
                              : <div className='my-4 w-fit rounded font-medium text-green-dark'>
                                  {t('card.setAsDefault')}
                                </div>
                              }
                              <div className='flex gap-2'>
                                <Button
                                  type='link'
                                  variant='filled'
                                  className='filled-button'
                                  onClick={() =>
                                    editAddressHandler(address.id)
                                  }
                                >
                                  {t('card.edit')}
                                </Button>
                                <Popconfirm
                                  title={t('confirm.title')}
                                  description={t(
                                    'confirm.description'
                                  )}
                                  onConfirm={() =>
                                    confirmDelete(address.id)
                                  }
                                  okText={t('confirm.ok')}
                                  cancelText={t('confirm.cancel')}
                                >
                                  <Button
                                    color='danger'
                                    variant='filled'
                                  >
                                    {t('card.delete')}
                                  </Button>
                                </Popconfirm>
                              </div>
                            </div>
                          </div>
                        </Radio>
                      </div>
                    );
                  })}
                </Radio.Group>
              : <div className='mt-5 grid min-h-[400px] place-content-center'>
                  <Empty />
                </div>
              }
            </div>
          </div>

          <Modal
            title={
              <p>
                {editAddressId ?
                  t('modal.editTitle')
                : t('modal.title')}
              </p>
            }
            footer={
              locale === 'ar' ?
                <>
                  <Button
                    type='primary'
                    color='primary'
                    htmlType='submit'
                    onClick={() => {
                      // console.log(editAddressId);
                      editAddressId ? handleEdit() : handleSubmit();
                    }}
                  >
                    {t('modal.ok')}
                  </Button>
                  <Button onClick={closeModal}>
                    {t('modal.cancel')}
                  </Button>
                </>
              : <>
                  <Button onClick={closeModal}>
                    {t('modal.cancel')}
                  </Button>
                  <Button
                    type='primary'
                    color='primary'
                    htmlType='submit'
                    onClick={() => {
                      // console.log(editAddressId);
                      editAddressId ? handleEdit() : handleSubmit();
                    }}
                  >
                    {t('modal.ok')}
                  </Button>
                </>
            }
            loading={modalLoading}
            open={open}
            onCancel={closeModal}
            className='fit-height-modal-account'
            style={{ top: '40px' }}
            width={760}
          >
            <div className='mt-4'>
              <Form
                name='shippinAddressForm'
                // onFinish={onFinish}
                colon={false}
                form={formAddress}
                onFinishFailed={onFinishFailed}
                initialValues={{
                  isDefault: false,
                  shippingDetailsCountry: 'egypt'
                }}
              >
                <Form.Item
                  name={`addressName`}
                  rules={[
                    {
                      required: true,
                      message: t(
                        'messages.formValidationErrors.addressNameRequired'
                      )
                    }
                  ]}
                  style={{ marginBottom: '20px' }}
                >
                  <Input
                    type='text'
                    placeholder={t('form.placeholder.addressName')}
                  />
                </Form.Item>
                <AddressFormItems
                  name='shippingDetails'
                  hidden={false}
                  updateShippingCostsData={false}
                  // shippingCostData={shippingCostData}
                />

                <Form.Item
                  name='isDefault'
                  valuePropName='checked'
                  style={{ marginBottom: '20px' }}
                >
                  <Checkbox
                    style={
                      locale === 'ar' ?
                        { fontSize: '16px' }
                      : { fontSize: '14px' }
                    }
                  >
                    {t('form.setAsDefaultLabel')}
                  </Checkbox>
                </Form.Item>
              </Form>
            </div>
          </Modal>
        </section>
      </ConfigProvider>;
}

export default Addresses;
