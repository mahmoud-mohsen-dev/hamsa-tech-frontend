'use client';

import { usePathname, useRouter } from '@/navigation';
import { getIdFromToken } from '@/utils/cookieUtils';
import {
  Button,
  Checkbox,
  ConfigProvider,
  Divider,
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
  updateAddress,
  updateDefaultAddress,
  updateUserAddresses
} from '@/services/shippingAddress';
import { capitalize } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import useHandleMessagePopup from '@/hooks/useHandleMessagePopup';
import { fetchGraphqlClient } from '@/services/graphqlCrud';
import {
  GetShippingCostResponseType,
  ShippingCostDataType
} from '@/types/shippingCostResponseTypes';
import type { PopconfirmProps, RadioChangeEvent } from 'antd';
import { useUser } from '@/context/UserContext';
import { useIsMount } from '@/hooks/useIsMount';

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

function SettingsPage({
  params: { locale }
}: {
  params: { locale: string };
}) {
  const [isLoading, setIsloading] = useState(true);
  // const { setUserId } = useUser();
  //   const [orders, setOrders] = useState<{
  //     data: OrderDataType[];
  //     meta: {
  //       pagination: PaginationMeta;
  //     };
  //   } | null>(null);
  const t = useTranslations('AccountLayoutPage.AddressPage.content');
  const checkoutTranslation = useTranslations('CheckoutPage.content');
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const {
    governoratesData,
    setLoadingMessage,
    setErrorMessage,
    setSuccessMessage
  } = useMyContext();
  const { addressesData, setAddressesData } = useUser();

  const { contextHolder, loadingMessage } = useHandleMessagePopup();

  const [open, setOpen] = useState<boolean>(false);
  const [formAddress] = useForm<AddressFormValuesType>();

  const [shippingCostData, setShippingCostData] = useState<
    null | ShippingCostDataType[]
  >(null);
  const [defaultActiveAddress, setDefaultActiveAddress] = useState<
    string | null
  >(null);
  const [modalLoading, setModalLoading] = useState<boolean>(true);
  const [editAddressId, setEditAddressId] = useState<null | string>(
    null
  );
  const { didMount: isFirstRender } = useIsMount();

  const showModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setEditAddressId(null);
    formAddress.resetFields();
  };

  useEffect(() => {
    if (addressesData && addressesData.length > 0) {
      setDefaultActiveAddress(() => {
        return (
          addressesData
            .map((address) =>
              address?.attributes?.default ? address.id : null
            )
            .filter((address) => address)
            .at(-1) ?? null
        );
      });
    }
  }, [addressesData]);

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
        (await fetchGraphqlClient(
          getShippingQuery(locale)
        )) as GetShippingCostResponseType;
      if (shippingCostError || !shippingCostData) {
        console.error(shippingCostError);
        return;
      }

      setShippingCostData(
        shippingCostData?.shippingCosts?.data ?? []
      );
    };

    getShippingCostData();

    // const getAddressData = async () => {
    //   const { addressesData, addressesError } =
    //     await getUserAddressesAuthenticated();
    //   if (addressesError || !addressesData) {
    //     console.error(addressesError);
    //     return;
    //   }
    //   console.log(addressesData);
    //   setAddressesData(addressesData);
    // };

    // getAddressData();
  }, []);

  useEffect(() => {
    if (
      !addressesData ||
      addressesData?.length <= 0 ||
      typeof defaultActiveAddress !== 'string' ||
      isFirstRender
    ) {
      return;
    }

    const newArr = addressesData.map((address) => ({
      id: address?.id ?? null,
      isDefault: address?.attributes?.default ?? false
    }));

    const updateDefaultAddressHandler = async () => {
      const { addressesData: updatedAddressesData, addressesError } =
        await updateDefaultAddress({
          addresses: newArr,
          defaultAddressId: defaultActiveAddress
        });

      if (addressesError || !updatedAddressesData) {
        console.error('addressesError', addressesError);
        console.error('updatedAddressesData', updatedAddressesData);
        setErrorMessage(
          typeof addressesError === 'string' ? addressesError : (
            'Some thing went wrong'
          )
        );
        return;
      }

      console.log(updatedAddressesData);
      setAddressesData(updatedAddressesData);
    };

    updateDefaultAddressHandler();
  }, [defaultActiveAddress]);

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

      setLoadingMessage(true);

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
        shippingCostId: shippingCostId,
        zipCode: shippingDetailsPostalCode,
        deliveryPhone: shippingDetailsPhone ?? ''
        // userId: getIdFromToken(),
        // guestUserId: getCookie('guestUserId')
      });

      if (deliveryAddressError || !deliveryAddressId) {
        console.error('Failed to create delivery address');
        console.error(deliveryAddressError);
        console.error(deliveryAddressId);
        setLoadingMessage(false);
        setErrorMessage('Failed to create delivery address');
        return null;
      }

      console.log('Created address id', deliveryAddressId);
      // setSuccessMessage(checkoutTranslation('form.successMessage'));
      return deliveryAddressId;
    } catch (err) {
      console.error('Error occured while creating new address:', err);
      // setLoadingMessage(false);
      setErrorMessage('Error occured while creating new address');
      return null;
    } finally {
      setLoadingMessage(false);
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

      setLoadingMessage(true);

      const shippingCostId =
        governoratesData.find(
          (item) =>
            item?.attributes?.governorate &&
            item?.attributes?.governorate ===
              shippingDetailsGovernorate
        )?.id ?? '';

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
        shippingCostId: shippingCostId,
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
        setLoadingMessage(false);
        setErrorMessage('Failed to edit delivery address');
        return null;
      }

      console.log('edit address id', deliveryAddressId);
      // setSuccessMessage(checkoutTranslation('form.successMessage'));
      return deliveryAddressId;
    } catch (err) {
      console.error('Error occured while editing address:', err);
      // setLoadingMessage(false);
      setErrorMessage('Error occured while editing address');
      return null;
    } finally {
      setLoadingMessage(false);
    }
  };

  // Function to handle form submission failure (validation errors)
  const onFinishFailed = (errorInfo: any) => {
    setErrorMessage(
      errorInfo?.errorFields[0]?.errors[0] ??
        'Failed to apply your changes'
    );
    console.error('Address update form failed:', errorInfo);
  };

  const getAddressesData = async () => {
    const { addressesData, addressesError } =
      await getUserAddressesAuthenticated();
    if (addressesError || !addressesData) {
      console.error(addressesError);
      return;
    }
    console.log(addressesData);
    setAddressesData(addressesData);
  };

  const handleSubmit = async () => {
    try {
      console.log('handleSubmit was called');
      const fields: AddressFormValuesType =
        await formAddress.validateFields();

      console.log('fields', fields);

      const fieldsValue = formAddress.getFieldsValue();
      console.log('fieldsValue', fieldsValue);

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

      if (updatedAddressesData && updatedAddressesData.length > 0) {
        setAddressesData(updatedAddressesData);

        setSuccessMessage(checkoutTranslation('form.successMessage'));

        formAddress.resetFields();
        setOpen(false);
      } else if (updatedAdderssesError) {
        console.error(updatedAdderssesError);
        throw new Error(
          checkoutTranslation('form.formSubmissionFailed')
        );
      }
    } catch (err) {
      console.error('Failed to validate fields:', err);
      onFinishFailed(err);
    }
  };

  const handleEdit = async () => {
    try {
      setModalLoading(true);
      const fields = await formAddress.validateFields();
      console.log('fields', fields);

      // const formValues = formAddress.getFieldsValue();
      // console.log('formValues', formValues);

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
      await getAddressesData();
      setSuccessMessage(checkoutTranslation('form.successMessage'));

      formAddress.resetFields();
    } catch (err) {
      console.error('Failed to validate fields:', err);
      onFinishFailed(err);
    } finally {
      setModalLoading(false);
      setOpen(false);
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
              isDefault: addressData?.attributes?.default ?? '',
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
                    addressData?.attributes?.shipping_cost?.data
                      ?.attributes?.locale === 'ar'
                  ) ?
                    addressData?.attributes?.shipping_cost?.data
                      ?.attributes?.governorate || ''
                  : addressData?.attributes?.shipping_cost?.data
                      ?.attributes?.localizations?.data[0]?.attributes
                      ?.governorate || ''
                : (
                  addressData?.attributes?.shipping_cost?.data
                    ?.attributes?.locale === 'ar'
                ) ?
                  addressData?.attributes?.shipping_cost?.data
                    ?.attributes?.localizations?.data[0]?.attributes
                    ?.governorate || ''
                : addressData?.attributes?.shipping_cost?.data
                    ?.attributes?.governorate || '',
              shippingDetailsCity:
                addressData?.attributes?.city ?? '',
              shippingDetailsPostalCode: `${addressData?.attributes?.zip_code || ''}`
            });
          }, 0);

          resolve(addressData);
        })
        .catch((error) => {
          reject(error);
          return;
        })
        .finally(() => {
          setModalLoading(false);
        });
    });
    // setTimeout(() => {
    //   setModalLoading(false);
    // }, 2000);
  };

  const onChange = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value);
    setDefaultActiveAddress(e.target.value);
  };

  const confirmDelete = async (addressId: string | null) => {
    // console.error(e);
    // setSuccessMessage('Click on Yes');

    const { deletedAddressId, deletedAddressError } =
      await deleteAddress(addressId);

    if (deletedAddressError || !deletedAddressId) {
      console.error(deletedAddressError);
      setErrorMessage(deletedAddressError);
      return;
    }

    await getAddressesData();
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
        {contextHolder}
        <section className='addresses-page min-h-screen w-full font-inter'>
          <div className='w-full pb-8'>
            <div className='flex flex-wrap items-center justify-between gap-4'>
              <h2 className='text-xl font-semibold text-blue-darker'>
                {t('title')}
              </h2>

              {addressesData && addressesData.length <= 100 && (
                <Button type='primary' onClick={showModal}>
                  {t('addNewAddressButton')}
                </Button>
              )}
            </div>

            {/* content addresses */}
            <div className='mt-8'>
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
                value={defaultActiveAddress}
                onChange={onChange}
              >
                {addressesData &&
                  addressesData.length > 0 &&
                  addressesData.map((address, i) => (
                    <div
                      className={`${defaultActiveAddress === address.id ? 'border-blue-light shadow-featuredHovered' : 'border-gray-light shadow-featured'} rounded-md border p-4`}
                      key={i}
                    >
                      <Radio
                        value={address.id}
                        style={{ width: '100%' }}
                      >
                        <div className='flex h-full w-full flex-col justify-between'>
                          <div className='flex flex-col flex-wrap gap-1 pl-2 font-inter'>
                            <h3 className='font-semibold'>
                              {address?.attributes?.address_name ??
                                ''}
                            </h3>
                            <p>
                              <span>
                                {address?.attributes?.first_name ??
                                  ''}
                              </span>{' '}
                              <span>
                                {address?.attributes?.last_name ?? ''}
                              </span>
                            </p>
                            <p>
                              <span>
                                {address?.attributes?.address_1 ?? ''}
                                ,{' '}
                              </span>
                              <span>
                                {address?.attributes?.address_2 ?? ''}
                                ,
                              </span>
                            </p>
                            <p>
                              <span>
                                building{' '}
                                {address?.attributes?.building ?? ''},{' '}
                              </span>
                              <span>
                                floor{' '}
                                {address?.attributes?.floor ?? ''},{' '}
                              </span>
                              <span>
                                apartment{' '}
                                {address?.attributes?.apartment ?? ''}
                                ,{' '}
                              </span>
                            </p>
                            <p>
                              <span>
                                {address?.attributes?.city ?? ''},{' '}
                              </span>
                              <span>
                                {locale === 'ar' ? 'مصر,' : 'Egypt, '}
                              </span>
                              <span>
                                {address?.attributes?.zip_code ?? ''}{' '}
                                postal code,
                              </span>
                            </p>
                            <p>
                              {address?.attributes?.delivery_phone ??
                                ''}
                            </p>
                          </div>
                          <div className='space-y-1'>
                            {defaultActiveAddress === address.id ?
                              <div className='my-4 w-fit rounded bg-green-dark px-4 py-2 text-white'>
                                Default address
                              </div>
                            : <div className='my-4 w-fit rounded font-medium text-green-dark'>
                                Set as Default
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
                                Edit
                              </Button>
                              <Popconfirm
                                title='Delete this address'
                                description='Are you sure to delete this Address?'
                                onConfirm={() =>
                                  confirmDelete(address.id)
                                }
                                okText='Yes'
                                cancelText='No'
                              >
                                <Button
                                  color='danger'
                                  variant='filled'
                                >
                                  Delete
                                </Button>
                              </Popconfirm>
                            </div>
                          </div>
                        </div>
                      </Radio>
                    </div>
                  ))}
              </Radio.Group>
            </div>
          </div>

          <Modal
            title={
              <p>
                {editAddressId ?
                  locale === 'ar' ?
                    'تعديل العنوان'
                  : 'Edit address'
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
                // onFinishFailed={onFinishFailed}
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
                  shippingCostData={shippingCostData}
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

export default SettingsPage;
