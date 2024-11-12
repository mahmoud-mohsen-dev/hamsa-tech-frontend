'use client';

import { usePathname, useRouter } from '@/navigation';
import {
  getCartId,
  getCookie,
  getIdFromToken
} from '@/utils/cookieUtils';
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
import { ValidateErrorEntity } from 'rc-field-form/lib/interface';
import { useMyContext } from '@/context/Store';
import {
  createAddress,
  getUserAddressesAuthenticated
} from '@/services/shippingAddress';
import { capitalize } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import useHandleMessagePopup from '@/hooks/useHandleMessagePopup';
import {
  fetchGraphql,
  fetchGraphqlClient
} from '@/services/graphqlCrud';
import { getShippingQuery } from '../../checkout/page';
import {
  GetShippingCostResponseType,
  ShippingCostDataType
} from '@/types/shippingCostResponseTypes';
import type { RadioChangeEvent } from 'antd';
import type { PopconfirmProps } from 'antd';
import { AdressesType } from '@/types/addressResponseTypes';

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

  const { contextHolder, loadingMessage } = useHandleMessagePopup();

  const [open, setOpen] = useState<boolean>(false);
  // const [loading, setLoading] = useState<boolean>(true);
  const [form] = useForm();
  const [defaultActiveAddress, setDefaultActiveAddress] = useState(0);

  const [shippingCostData, setShippingCostData] = useState<
    null | ShippingCostDataType[]
  >(null);
  const [addressesData, setAddressesData] = useState<
    null | AdressesType[]
  >(null);

  const showModal = () => {
    setOpen(true);
    // setLoading(true);

    // Simple loading mock. You should add cleanup logic in real world.
    // setTimeout(() => {
    //   setLoading(false);
    // }, 2000);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userId = getIdFromToken();
      if (userId) {
        setIsloading(false);
      }
      //   getOrdersAuthenticated(Number(pageParams) ?? 1, userId ?? '')
      //     .then((data) => {
      //       setOrders(data);
      //     })
      //     .finally(() => {
      //       setIsloading(false);
      //     });
    }
  }, [searchParams, pathname, router]);

  useEffect(() => {
    const updateShippingCostData = async () => {
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

    updateShippingCostData();

    const getAddressData = async () => {
      const { addressData, addressError } =
        await getUserAddressesAuthenticated();
      if (addressError || !addressData) {
        console.error(addressError);
        return;
      }
      setAddressesData(addressData);
    };

    getAddressData();
  }, []);

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
        deliveryPhone: shippingDetailsPhone ?? '',
        userId: getIdFromToken(),
        guestUserId: getCookie('guestUserId')
      });

      if (deliveryAddressError || !deliveryAddressId) {
        console.error('Failed to create delivery address');
        console.error(deliveryAddressError);
        console.error(deliveryAddressId);
        setLoadingMessage(false);
        setErrorMessage('Failed to create delivery address');
        return;
      }

      console.log('Created address id', deliveryAddressId);
      setSuccessMessage(checkoutTranslation('form.successMessage'));
    } catch (err) {
      console.error('Error occured while creating new address:', err);
      // setLoadingMessage(false);
      setErrorMessage('Error occured while creating new address');
    } finally {
      setLoadingMessage(false);
    }
  };

  const onChange = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value);
    setDefaultActiveAddress(e.target.value);
  };

  // Function to handle form submission failure (validation errors)
  const onFinishFailed = (errorInfo: any) => {
    setErrorMessage(
      errorInfo?.errorFields[0]?.errors[0] ??
        'Failed to apply your changes'
    );
    console.error('Address update form failed:', errorInfo);
  };

  const handleSubmit = async () => {
    try {
      const fields: AddressFormValuesType =
        await form.validateFields();

      console.log(fields);

      const result = await onFinish(fields);
      console.log('fields', result);
      form.resetFields();
      setOpen(false);
    } catch (err) {
      // console.error('Failed to validate fields:', err);
      onFinishFailed(err);
    }
  };

  const confirmDelete: PopconfirmProps['onConfirm'] = (e) => {
    console.error(e);
    setSuccessMessage('Click on Yes');
  };

  const cancelDelete: PopconfirmProps['onCancel'] = (e) => {
    console.error(e);
    setErrorMessage('Click on No');
  };

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
                Addresses
              </h2>

              <Button type='primary' onClick={showModal}>
                Add new address
              </Button>
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
                  addressesData.map((address, i) => (
                    <div
                      className={`${defaultActiveAddress === i ? 'border-blue-light shadow-featuredHovered' : 'border-gray-light shadow-featured'} rounded-md border p-4`}
                      key={i}
                    >
                      <Radio value={i} style={{ width: '100%' }}>
                        <div className='flex h-full w-full flex-col justify-between'>
                          <div className='flex flex-col flex-wrap gap-1 pl-2 font-inter'>
                            <h3 className='font-semibold'>
                              {address?.address_name ?? ''}
                            </h3>
                            <p>
                              <span>{address?.first_name ?? ''}</span>{' '}
                              <span>{address?.last_name ?? ''}</span>
                            </p>
                            <p>
                              <span>
                                {address?.address_1 ?? ''},{' '}
                              </span>
                              <span>{address?.address_2 ?? ''},</span>
                            </p>
                            <p>
                              <span>
                                building {address?.building ?? ''},{' '}
                              </span>
                              <span>
                                floor {address?.floor ?? ''},{' '}
                              </span>
                              <span>
                                apartment {address?.apartment ?? ''},{' '}
                              </span>
                            </p>
                            <p>
                              <span>{address?.city ?? ''}, </span>
                              <span>Egypt, </span>
                              <span>
                                {address?.zip_code ?? ''} postal code,
                              </span>
                            </p>
                            <p>{address?.delivery_phone ?? ''}</p>
                          </div>
                          <div className='space-y-1'>
                            {defaultActiveAddress === i ?
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
                                onClick={showModal}
                              >
                                Edit
                              </Button>
                              <Popconfirm
                                title='Delete this address'
                                description='Are you sure to delete this Address?'
                                onConfirm={confirmDelete}
                                onCancel={cancelDelete}
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
            title={<p>Create new address</p>}
            footer={
              <>
                <Button onClick={() => setOpen(false)}>Cancel</Button>
                <Button
                  type='primary'
                  color='primary'
                  htmlType='submit'
                  onClick={() => {
                    handleSubmit();
                  }}
                >
                  Ok
                </Button>
              </>
            }
            loading={loadingMessage}
            open={open}
            onCancel={() => setOpen(false)}
            className='fit-height-modal-account'
            style={{ top: '40px' }}
            width={760}
          >
            <div className='mt-4'>
              <Form
                name='shippinAddressForm'
                // onFinish={onFinish}
                colon={false}
                form={form}
                // onFinishFailed={onFinishFailed}
                initialValues={{ isDefault: false }}
              >
                <Form.Item
                  name={`addressName`}
                  rules={[
                    {
                      required: true,
                      message: 'Please enter an address name'
                    }
                  ]}
                  style={{ marginBottom: '20px' }}
                >
                  <Input
                    type='text'
                    placeholder={
                      "Address Name (e.g. 'Office', 'Home', etc...)"
                    }
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
                  <Checkbox>Set as default</Checkbox>
                </Form.Item>
              </Form>
            </div>
          </Modal>
        </section>
      </ConfigProvider>;
}

export default SettingsPage;
