import { Form, Input, Select, Tooltip } from 'antd';
import { IoIosArrowDown } from 'react-icons/io';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useLocale, useTranslations } from 'next-intl';
import { getEgyptianGovernorates } from '@/utils/getEgyptianGovernorates';

function AddressFormItems({ name }: { name: string }) {
  const locale = useLocale();
  const t = useTranslations('CheckoutPage.content');
  return (
    <>
      <Form.Item
        name={`${name}Country`}
        style={{
          marginTop: '20px',
          marginBottom: '20px'
        }}
        rules={[
          { required: true, message: 'Please select a country!' }
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
              message: 'Please input your first name!'
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
              message: 'Please input your last name!'
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
            message: 'Please input your address!'
          }
        ]}
        style={{ marginBottom: '20px' }}
      >
        <Input type='text' placeholder={t('addressTitle')} />
      </Form.Item>
      <Form.Item
        name={`${name}Apartment`}
        style={{ marginBottom: '20px' }}
      >
        <Input type='text' placeholder={t('streetTitle')} />
      </Form.Item>
      <div className='flex w-full gap-4'>
        <Form.Item
          name={`${name}City`}
          rules={[
            {
              required: true,
              message: 'Please input your city!'
            }
          ]}
          style={{ marginBottom: '20px' }}
          className='basis-1/3'
        >
          <Input type='text' placeholder={t('cityTitle')} />
        </Form.Item>
        <Form.Item
          name={`${name}Governorate`}
          rules={[
            {
              required: true,
              message: 'Please select your governorate!'
            }
          ]}
          style={{ marginBottom: '20px' }}
          className='basis-1/3'
        >
          <Select
            options={getEgyptianGovernorates(locale)}
            placeholder={t('governorateTitle')}
            suffixIcon={<IoIosArrowDown size={18} />}
          />
        </Form.Item>
        <Form.Item
          name={`${name}PostalCode`}
          style={{ marginBottom: '20px' }}
          className='basis-1/3'
        >
          <Input type='text' placeholder={t('postalCode')} />
        </Form.Item>
      </div>
      <Form.Item
        name={`${name}Phone`}
        style={{ marginBottom: '20px' }}
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
