import { Form, Input, Select, Tooltip } from 'antd';
import { IoIosArrowDown } from 'react-icons/io';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import { ShippingCostDataType } from '@/types/shippingCostResponseTypes';
import { convertShippingCostsToOptions } from '@/utils/getEgyptianGovernorates';
import { useEffect } from 'react';
import { useMyContext } from '@/context/Store';

function AddressFormItems({
  name,
  shippingCostData
}: {
  name: string;
  shippingCostData: ShippingCostDataType[];
}) {
  const {
    updateGovernoratesData,
    governoratesData,
    setSelectedGovernorate
  } = useMyContext();
  // const locale = useLocale();
  const t = useTranslations('CheckoutPage.content');

  useEffect(() => {
    if (shippingCostData.length > 0) {
      updateGovernoratesData(shippingCostData);
    }
  }, [shippingCostData]);

  return (
    <>
      <Form.Item
        name={`${name}Country`}
        style={{
          marginTop: '20px',
          marginBottom: '20px'
        }}
        rules={[
          {
            required: true,
            message: t('formValidationErrorMessages.selectCountry')
          }
        ]}
      >
        <Select
          options={[{ label: t('countryValueOne'), value: 'egypt' }]}
          placeholder={t('countryOrRegionTitle')}
          suffixIcon={<IoIosArrowDown size={18} />}
        />
      </Form.Item>
      <div className='flex w-full gap-4'>
        <Form.Item
          name={`${name}FirstName`}
          rules={[
            {
              required: true,
              message: t('formValidationErrorMessages.inputFirstName')
            }
          ]}
          className='basis-1/2'
          style={{ marginBottom: '20px' }}
        >
          <Input type='text' placeholder={t('firstNameTitle')} />
        </Form.Item>
        <Form.Item
          name={`${name}LastName`}
          rules={[
            {
              required: true,
              message: t('formValidationErrorMessages.inputLastName')
            }
          ]}
          className='basis-1/2'
          style={{ marginBottom: '20px' }}
        >
          <Input type='text' placeholder={t('lastNameTitle')} />
        </Form.Item>
      </div>
      <Form.Item
        name={`${name}Address`}
        rules={[
          {
            required: true,
            message: t('formValidationErrorMessages.inputAddress')
          }
        ]}
        style={{ marginBottom: '20px' }}
      >
        <Input type='text' placeholder={t('streetTitle')} />
      </Form.Item>
      <Form.Item
        name={`${name}Address2`}
        style={{ marginBottom: '20px' }}
      >
        <Input
          type='text'
          placeholder={t('additionalAddressTitle')}
        />
      </Form.Item>
      <div className='flex w-full gap-4'>
        <Form.Item
          name={`${name}Building`}
          rules={[
            {
              required: true,
              message: t('formValidationErrorMessages.inputBuilding')
            }
          ]}
          style={{ marginBottom: '20px' }}
          className='basis-1/3'
        >
          <Input
            type='text'
            placeholder={t('buildingTitle')}
            style={{ height: '45px' }}
          />
        </Form.Item>
        <Form.Item
          name={`${name}Floor`}
          rules={[
            {
              required: true,
              message: t('formValidationErrorMessages.inputFloor')
            }
          ]}
          style={{ marginBottom: '20px' }}
          className='basis-1/3'
        >
          <Input
            type='text'
            placeholder={t('floorTitle')}
            style={{ height: '45px' }}
          />
        </Form.Item>
        <Form.Item
          name={`${name}Apartment`}
          rules={[
            {
              required: true,
              message: t('formValidationErrorMessages.inputApartment')
            },
            {
              validator: (_, value) => {
                if (value && value > 0) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(
                    t(
                      'formValidationErrorMessages.apartmentNumberValidation'
                    )
                  )
                );
              }
            }
          ]}
          style={{ marginBottom: '20px' }}
          className='basis-1/3'
        >
          <Input
            type='number'
            placeholder={t('apartmentTitle')}
            style={{ height: '45px' }}
            // min={0}
          />
        </Form.Item>
      </div>

      {/*  */}
      <div className='flex w-full gap-4'>
        <Form.Item
          name={`${name}City`}
          rules={[
            {
              required: true,
              message: t('formValidationErrorMessages.inputCity')
            }
          ]}
          style={{ marginBottom: '20px' }}
          className='basis-1/3'
        >
          <Input
            type='text'
            placeholder={t('cityTitle')}
            style={{ height: '45px' }}
          />
        </Form.Item>
        <Form.Item
          name={`${name}Governorate`}
          rules={[
            {
              required: true,
              message: t(
                'formValidationErrorMessages.selectGovernorate'
              )
            }
          ]}
          style={{ marginBottom: '20px' }}
          className='basis-1/3'
        >
          <Select
            showSearch
            options={convertShippingCostsToOptions(governoratesData)}
            onChange={(value: string) => {
              governoratesData.map((item) => {
                if (item?.attributes?.governorate === value) {
                  setSelectedGovernorate(item);
                }
              });
            }}
            style={{ height: '45px' }}
            placeholder={t('governorateTitle')}
            suffixIcon={<IoIosArrowDown size={18} />}
          />
        </Form.Item>
        <Form.Item
          name={`${name}PostalCode`}
          style={{ marginBottom: '20px' }}
          className='basis-1/3'
          rules={[
            {
              pattern: /^[0-9]{5}$/, // The pattern for postal code format (e.g., 5 digits)
              message: t(
                'formValidationErrorMessages.postalCodeValidation'
              )
            }
          ]}
        >
          <Input
            type='text'
            placeholder={t('postalCode')}
            style={{ height: '45px' }}
          />
        </Form.Item>
      </div>
      <Form.Item
        name={`${name}Phone`}
        style={{ marginBottom: '20px' }}
        rules={[
          {
            required: true,
            message: t(
              'formValidationErrorMessages.inputDeliveryPhone'
            )
          }
        ]}
      >
        <Input
          type='text'
          placeholder={t('phone')}
          suffix={
            <Tooltip
              title={t('phoneTooltip')}
              className='text-red-400'
              overlayStyle={{ width: 190 }}
            >
              <QuestionCircleOutlined
                style={{ color: '#9b9b9bbd' }}
              />
            </Tooltip>
          }
        />
      </Form.Item>
    </>
  );
}

export default AddressFormItems;
