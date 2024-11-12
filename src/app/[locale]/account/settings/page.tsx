'use client';

import { Link, usePathname, useRouter } from '@/navigation';
import { getIdFromToken } from '@/utils/cookieUtils';
import {
  Button,
  ConfigProvider,
  DatePicker,
  Divider,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Spin
} from 'antd';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import UploadImage from '@/components/UI/account/settings/UploadImage';
import { IoIosArrowDown } from 'react-icons/io';
import { useLocale, useTranslations } from 'next-intl';
import { useForm } from 'antd/es/form/Form';
import type { FormProps } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;
const { confirm } = Modal;

type FieldType = {
  birth_date?: string;
};

const showConfirm = () => {
  confirm({
    title: 'Do you want to delete your account?',
    icon: <ExclamationCircleFilled style={{ color: '#d7150e' }} />,
    content: `This action is not reversible.`,
    okText: 'Yes',
    onOk: async () => {
      console.log('Ok');
      return new Promise((resolve) => setTimeout(resolve, 3000));
    },
    onClose: () => {
      console.log('close');
    },
    onCancel() {
      console.log('Cancel');
    },
    className: 'fit-height-modal-account'
  });
};

function SettingsPage({
  params: { locale }
}: {
  params: { locale: string };
}) {
  const [loading, setIsloading] = useState(true);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  // const locale = useLocale();
  const signUpTranslations = useTranslations('SignupPage.content');
  const [profileInfoForm] = useForm();
  const [updatePasswordForm] = useForm();

  const birthDateStamp = dayjs('2024-10-30T11:59:33.310Z').valueOf();

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

  const handleProfileInfoFormSubmit: FormProps<FieldType>['onFinish'] =
    (values) => {
      console.log('Form values:', values);
      // Perform your submission logic here
    };
  const handleUpdatePasswordFormSubmit: FormProps<FieldType>['onFinish'] =
    (values) => {
      console.log('Form values:', values);
      // Perform your submission logic here
    };

  const validatePhone = (_: any, value: string) => {
    const phoneNumberPattern = /^[0-9]*$/; // Regex to allow only numbers
    if (!value) {
      return Promise.reject(
        new Error(
          signUpTranslations(
            'formValidationErrorMessages.phoneRequired'
          )
        )
      );
    }
    if (!phoneNumberPattern.test(value)) {
      return Promise.reject(
        new Error(
          signUpTranslations(
            'formValidationErrorMessages.phoneTypeError'
          )
        )
      );
    }

    const prefix = profileInfoForm.getFieldValue(['phone', 'prefix']); // Use form instance to get prefix
    console.log(prefix);
    const isValidLength =
      prefix === 'Egypt_20' &&
      (value.length === 10 || value.length === 11); // Example for Egypt
    if (!isValidLength) {
      return Promise.reject(
        new Error(
          signUpTranslations(
            'formValidationErrorMessages.phoneLengthError'
          )
        )
      );
    }
    return Promise.resolve();
  };

  const validatePassword = (_: any, value: string) => {
    const minLength = 8;
    const maxLength = 20;

    if (!value) {
      return Promise.reject(
        new Error(
          // signUpTranslations(
          //   'formValidationErrorMessages.passwordRequired'
          // )
          'New password is required'
        )
      );
    }

    if (value.length < minLength) {
      return Promise.reject(
        new Error(
          signUpTranslations(
            'formValidationErrorMessages.minValidationPasswordError'
          )
        )
      );
    }
    if (value.length > maxLength) {
      return Promise.reject(
        new Error(
          signUpTranslations(
            'formValidationErrorMessages.maxValidationPasswordError'
          )
        )
      );
    }

    const hasLetter = /[a-zA-Z]/.test(value); // Check for at least one English letter
    const hasNumber = /\d/.test(value); // Check for at least one number

    // Check if it contains only valid characters (letters, numbers, special characters)
    const validCharactersPattern =
      /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;

    if (!validCharactersPattern.test(value)) {
      return Promise.reject(
        new Error(
          signUpTranslations(
            'formValidationErrorMessages.passwordInvalidCharacters'
          )
        )
      );
    }

    if (!hasLetter) {
      return Promise.reject(
        new Error(
          signUpTranslations(
            'formValidationErrorMessages.passwordLetterError'
          )
        )
      );
    }

    if (!hasNumber) {
      return Promise.reject(
        new Error(
          signUpTranslations(
            'formValidationErrorMessages.passwordNumberError'
          )
        )
      );
    }

    return Promise.resolve();
  };

  return loading ?
      <Spin
        className='grid min-h-full w-full place-content-center'
        size='large'
      />
    : <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#1677ff',
            fontFamily: 'var(--font-inter)'
          },
          components: {
            Form: {
              labelColor: '#1e3a8a'
            },
            Input: {
              colorBorder: '#3b82f6',
              activeBorderColor: '#1d4ed8',
              colorBgContainer: '#eff6ff',
              paddingInline: 14,
              // paddingBlock: 10,
              colorTextPlaceholder: 'rgba(0, 0, 0, 0.35)',
              colorText: '#1e3a8a',
              controlHeight: 45
            },
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
              // primaryShadow:
              //   'rgb(255, 255, 255) 0px 0px 0px 2px, #1677ffd1 0px 0px 0px 4px, rgba(0, 0, 0, 0) 0px 0px 0px 44px',
              controlHeight: 40,
              colorError: '#D62C26',
              colorErrorHover: '#AF241F'
            },
            Select: {
              colorBorder: '#3b82f6',
              colorBgContainer: '#eff6ff',
              activeBorderColor: '#1d4ed8',
              colorText: '#1e3a8a'
            },
            DatePicker: {
              colorBorder: '#3b82f6',
              colorBgContainer: '#eff6ff',
              activeBorderColor: '#1d4ed8',
              colorText: '#1e3a8a',
              colorTextPlaceholder: 'rgba(0, 0, 0, 0.35)',
              paddingInline: 20,
              controlHeight: 45
              // paddingBlock: 10
            }
          }
        }}
      >
        <section className='min-h-screen w-full font-inter'>
          <div className='w-full pb-8 lg:max-w-lg'>
            <div>
              <h2 className='text-xl font-semibold text-[#1e3a8a]'>
                Profile Settings
              </h2>

              <div className='mt-8'>
                <UploadImage />
                <div className='mt-8 sm:mt-12'>
                  <Form
                    name='personalInfo'
                    form={profileInfoForm}
                    layout='vertical'
                    requiredMark={false}
                    onFinish={handleProfileInfoFormSubmit}
                    initialValues={{
                      phone: { prefix: 'Egypt_20' },
                      birth_date: birthDateStamp
                    }}
                  >
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <Form.Item
                        label='Your first name'
                        name='first_name'
                        initialValue='Jane'
                        rules={[
                          {
                            required: true,
                            message: 'Please enter your first name'
                          }
                        ]}
                        style={{ flex: 1 }}
                      >
                        <Input placeholder='Your first name' />
                      </Form.Item>

                      <Form.Item
                        label='Your last name'
                        name='last_name'
                        initialValue='Ferguson'
                        rules={[
                          {
                            required: true,
                            message: 'Please enter your last name'
                          }
                        ]}
                        style={{ flex: 1 }}
                      >
                        <Input placeholder='Your last name' />
                      </Form.Item>
                    </div>

                    <Form.Item
                      label='Your email'
                      name='email'
                      rules={[
                        {
                          type: 'email',
                          message: 'Please enter a valid email'
                        },
                        {
                          required: true,
                          message: 'Please enter your email'
                        }
                      ]}
                    >
                      <Input placeholder='your.email@mail.com' />
                    </Form.Item>

                    <Form.Item label='Phone number'>
                      <Space.Compact block>
                        <Form.Item
                          name={['phone', 'prefix']}
                          noStyle
                          rules={[
                            {
                              required: true,
                              message: 'Select country code'
                            }
                          ]}
                        >
                          <Select
                            style={{ width: '160px', height: 45 }}
                            suffixIcon={<IoIosArrowDown size={18} />}
                          >
                            <Option value='Egypt_20'>
                              {locale === 'ar' ?
                                '‫Egypt‬ 20+'
                              : '+20 Egypt'}
                            </Option>
                          </Select>
                        </Form.Item>

                        <Form.Item
                          name={['phone', 'number']}
                          noStyle
                          rules={[{ validator: validatePhone }]}
                        >
                          <Input
                            // style={{ width: '100%' }}
                            // placeholder={signUpTranslations(
                            //   'phonePlaceholder'
                            // )}
                            placeholder={'1001234567'}
                          />
                        </Form.Item>
                      </Space.Compact>
                    </Form.Item>

                    <Form.Item<FieldType>
                      label='Birth date'
                      name='birth_date'
                      rules={[{ required: true }]}
                      getValueProps={(value) => ({
                        value: value && dayjs(Number(value))
                      })}
                      normalize={(value) =>
                        value && `${dayjs(value).valueOf()}`
                      }
                    >
                      <DatePicker />
                    </Form.Item>

                    <Form.Item
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginBottom: 0
                      }}
                    >
                      <Button type='primary' htmlType='submit'>
                        Save
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              </div>
            </div>
            <Divider />
            <div>
              <h2 className='text-xl font-semibold text-[#1e3a8a]'>
                Profile Settings
              </h2>
              <div className='mt-8'>
                <Form
                  name='updatePassword'
                  form={updatePasswordForm}
                  layout='vertical'
                  requiredMark={false}
                  onFinish={handleUpdatePasswordFormSubmit}
                >
                  <Form.Item
                    label='Old password'
                    name='old_password'
                    rules={[
                      {
                        required: true,
                        message: 'Old password is required'
                      }
                    ]}
                    // hasFeedback
                  >
                    <Input.Password placeholder={'Old Password'} />
                  </Form.Item>

                  <Form.Item
                    label='New password'
                    name='new_password'
                    rules={[{ validator: validatePassword }]}
                    hasFeedback
                  >
                    <Input.Password placeholder={'New password'} />
                  </Form.Item>

                  {/* Field */}
                  <Form.Item
                    label='Confirm password'
                    name='password2'
                    dependencies={['password']}
                    rules={[
                      {
                        required: true,
                        message: signUpTranslations(
                          'formValidationErrorMessages.confirmPassowrdRequired'
                        )
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (
                            !value ||
                            getFieldValue('password') === value
                          ) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(
                              signUpTranslations(
                                'formValidationErrorMessages.passwordMismatch'
                              )
                            )
                          );
                        }
                      })
                    ]}
                  >
                    <Input.Password placeholder='Confirm Password' />
                  </Form.Item>
                  <Form.Item
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      marginBottom: 0
                    }}
                  >
                    <div className='flex items-center gap-4'>
                      <Link
                        href='/forget-password'
                        className='text-blue-light hover:text-blue-light-dark hover:underline'
                      >
                        I forgot my password
                      </Link>
                      <Button type='primary' htmlType='submit'>
                        Save
                      </Button>
                    </div>
                  </Form.Item>
                </Form>
              </div>
              <Divider />
              <div>
                <h2 className='text-xl font-semibold text-blue-darker'>
                  Delete Account
                </h2>
                <p className='mt-4 text-sm font-normal leading-6'>
                  No longer want to use our service? You can delete
                  your account here. This action is not reversible.
                  All information related to this account will be
                  deleted permanently.
                </p>
                <div className='mt-4 flex justify-end'>
                  <Button
                    onClick={showConfirm}
                    // type='text'
                    color='danger'
                    variant='solid'
                  >
                    Yes, Delete my account
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ConfigProvider>;
}

export default SettingsPage;
