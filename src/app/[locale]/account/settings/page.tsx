'use client';

import { Link, usePathname, useRouter } from '@/navigation';
import {
  getIdFromToken,
  removeCookie,
  setCookie
} from '@/utils/cookieUtils';
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
import { useCallback, useEffect, useState } from 'react';
import UploadImage from '@/components/UI/account/settings/UploadImage';
import { IoIosArrowDown } from 'react-icons/io';
import { useLocale, useTranslations } from 'next-intl';
import { useForm } from 'antd/es/form/Form';
import type { FormProps } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  changePassword,
  deleteUser,
  getProfileSettignsData,
  updateProfileSettignsData
} from '@/services/userInfo';
import useHandleMessagePopup from '@/hooks/useHandleMessagePopup';
import { useMyContext } from '@/context/Store';
import { useUser } from '@/context/UserContext';

const { Option } = Select;
const { confirm } = Modal;

type FieldType = {
  firstName?: string;
  lastName?: string;
  email?: string;
  birthDate?: string;
  phone?: {
    number: string;
    prefix: string;
  };
};

type changePasswordType = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
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
  const t = useTranslations('AccountLayoutPage.SettingsPage.content');
  const signUpTranslations = useTranslations('SignupPage.content');
  const [profileInfoForm] = useForm();
  const [updatePasswordForm] = useForm();
  const { contextHolder, loadingMessage } = useHandleMessagePopup();
  const { setErrorMessage, setSuccessMessage, setLoadingMessage } =
    useMyContext();
  const { setUserId } = useUser();

  // const birthDateStamp = dayjs('2024-10-30T11:59:33.310Z').valueOf();

  const showConfirm = useCallback(() => {
    confirm({
      title: t('messages.confirm.title'),
      icon: <ExclamationCircleFilled style={{ color: '#d7150e' }} />,
      content: t('messages.confirm.description'),
      okText: t('deleteAccount.deleteButton'),
      cancelText: t('deleteAccount.cancelButton'),
      onOk: async () => {
        return new Promise((resolve) => {
          deleteUser()
            .then((response) => {
              console.log('response', response);
              setSuccessMessage(t('messages.accountDeleted'));

              removeCookie('token');
              setUserId(null);
              router.push('/signin');
            })
            .catch((error) => {
              console.error(error);
              console.error(error?.message ?? '');
              setErrorMessage(
                error?.message ||
                  error ||
                  t(
                    'messages.validationErrors.errorOccuredWhileDeletingAccount'
                  )
              );
            })
            .finally(() => {
              resolve(true);
            });
          // setTimeout(resolve, 3000);
        });
      },
      // onClose: () => {
      //   console.log('close');
      // },
      // onCancel() {
      //   console.log('Cancel');
      // },
      className: 'fit-height-modal-account'
    });
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userId = getIdFromToken();
      if (userId) {
        getProfileSettignsData().then((profileSettings) => {
          profileInfoForm.setFieldsValue({
            firstName: profileSettings?.first_name ?? '',
            lastName: profileSettings?.last_name ?? '',
            email: profileSettings?.email ?? '',
            phone: {
              number: profileSettings?.phone ?? ''
            },
            birthDate:
              profileSettings?.birth_date ?
                dayjs(profileSettings.birth_date).valueOf()
              : ''
          });
        });
        setIsloading(false);
      }
    }
  }, [searchParams, pathname, router]);

  const handleProfileInfoFormSubmit: FormProps<FieldType>['onFinish'] =
    (values) => {
      setLoadingMessage(true);
      updateProfileSettignsData({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values?.phone?.number ?? '',
        birthDate:
          (
            Number(values.birthDate) > 0 &&
            !isNaN(Number(values.birthDate)) &&
            dayjs(Number(values.birthDate)).isValid()
          ) ?
            dayjs(Number(values.birthDate)).format('YYYY-MM-DD')
          : null
      })
        .then((updatedData) => {
          // console.log(updatedData);
          // Update the form with the new values
          profileInfoForm.setFieldsValue({
            firstName: updatedData?.first_name ?? '',
            lastName: updatedData?.last_name ?? '',
            email: updatedData?.email ?? '',
            phone: {
              number: updatedData?.phone ?? ''
            },
            birthDate:
              updatedData?.birth_date ?
                dayjs(updatedData.birth_date).valueOf()
              : ''
          });
          setSuccessMessage(t('messages.profileUpdated'));
        })
        .catch((err) => {
          console.error(err);
          setErrorMessage(err?.message || err);
        })
        .finally(() => {
          setLoadingMessage(false);
        });
    };

  const handleUpdatePasswordFormSubmit: FormProps<changePasswordType>['onFinish'] =
    (values) => {
      console.log('Form values:', values);

      // setIsloading(true);
      setLoadingMessage(true);
      changePassword({
        currentPassword: values.oldPassword,
        newPassword: values.newPassword,
        confirmNewPassword: values.confirmNewPassword
      })
        .then((responseData) => {
          console.log(responseData);
          if (responseData?.jwt && responseData?.id) {
            setCookie('token', responseData.jwt);
            setUserId(responseData.id);
            setSuccessMessage(t('messages.passwordUpdated'));
            updatePasswordForm.resetFields();
          }
        })
        .catch((error) => {
          console.error(error?.message ?? '');
          setErrorMessage(error?.message ?? '');
        })
        .finally(() => {
          setLoadingMessage(false);
        });
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
    // console.log(prefix);
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
        new Error(t('messages.validationErrors.newPasswordRequired'))
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

  return loading || loadingMessage ?
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
        {contextHolder}
        <section className='min-h-screen w-full font-inter'>
          <div className='w-full pb-8 lg:max-w-lg'>
            <div>
              <h2 className='text-xl font-semibold text-[#1e3a8a]'>
                {t('profileSettings')}
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
                      phone: { prefix: 'Egypt_20' }
                      // birth_date: birthDateStamp
                    }}
                  >
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <Form.Item
                        label={t('form.firstNameLabel')}
                        name='firstName'
                        rules={[
                          {
                            max: 16,
                            message: signUpTranslations(
                              'formValidationErrorMessages.firstNameMaxLengthError'
                            )
                          },
                          {
                            pattern: /^[a-zA-Z\u0621-\u064A]+$/,
                            message: signUpTranslations(
                              'formValidationErrorMessages.firstNameOnlyLetters'
                            )
                          }
                        ]}
                        style={{ flex: 1 }}
                      >
                        <Input
                          placeholder={t(
                            'form.placeholder.firstName'
                          )}
                        />
                      </Form.Item>

                      <Form.Item
                        label={t('form.lastNameLabel')}
                        name='lastName'
                        rules={[
                          {
                            max: 16,
                            message: signUpTranslations(
                              'formValidationErrorMessages.lastNameMaxLengthError'
                            )
                          },
                          {
                            pattern: /^[a-zA-Z\u0621-\u064A]+$/,
                            message: signUpTranslations(
                              'formValidationErrorMessages.lastNameOnlyLetters'
                            )
                          }
                        ]}
                        style={{ flex: 1 }}
                      >
                        <Input
                          placeholder={t('form.placeholder.lastName')}
                        />
                      </Form.Item>
                    </div>

                    <Form.Item
                      label={t('form.emailLabel')}
                      name='email'
                      rules={[
                        {
                          type: 'email',
                          message: t(
                            'messages.validationErrors.emailInvalid'
                          )
                        },
                        {
                          required: true,
                          message: t(
                            'messages.validationErrors.emailRequired'
                          )
                        }
                      ]}
                    >
                      <Input
                        placeholder={t('form.placeholder.email')}
                        disabled={true}
                      />
                    </Form.Item>

                    <Form.Item label={t('form.phoneLabel')}>
                      <Space.Compact block>
                        <Form.Item
                          name={['phone', 'prefix']}
                          noStyle
                          rules={[
                            {
                              required: true,
                              message: t(
                                'messages.validationErrors.countryCode'
                              )
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
                      label={t('form.birthDateLabel')}
                      name='birthDate'
                      // rules={[{ required: true }]}
                      getValueProps={(value) => ({
                        value: value && dayjs(Number(value))
                      })}
                      normalize={(value) =>
                        value && `${dayjs(value).valueOf()}`
                      }
                      style={{ width: '50%' }}
                    >
                      <DatePicker
                        placeholder={t('form.placeholder.birthDate')}
                        style={{ width: '100%', minWidth: '225px' }}
                      />
                    </Form.Item>

                    <Form.Item
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginBottom: 0
                      }}
                    >
                      <Button type='primary' htmlType='submit'>
                        {t('form.saveButton')}
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              </div>
            </div>
            <Divider />
            <div>
              <h2 className='text-xl font-semibold text-[#1e3a8a]'>
                {t('changePasswordSettings')}
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
                    label={t('form.oldPasswordLabel')}
                    name='oldPassword'
                    rules={[
                      {
                        required: true,
                        message: t(
                          'messages.validationErrors.oldPasswordRequired'
                        )
                      }
                    ]}
                    // hasFeedback
                  >
                    <Input.Password
                      placeholder={t('form.placeholder.oldPassword')}
                    />
                  </Form.Item>

                  <Form.Item
                    label={t('form.newPasswordLabel')}
                    name='newPassword'
                    rules={[{ validator: validatePassword }]}
                    hasFeedback
                  >
                    <Input.Password
                      placeholder={t('form.placeholder.newPassword')}
                    />
                  </Form.Item>

                  {/* Field */}
                  <Form.Item
                    label={t('form.confirmNewPasswordLabel')}
                    name='confirmNewPassword'
                    dependencies={['newPassword']}
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
                            getFieldValue('newPassword') === value
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
                    <Input.Password
                      placeholder={t(
                        'form.placeholder.confirmNewPassword'
                      )}
                    />
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
                        {t('form.forgotPasswordLabel')}
                      </Link>
                      <Button type='primary' htmlType='submit'>
                        {t('form.saveButton')}
                      </Button>
                    </div>
                  </Form.Item>
                </Form>
              </div>
              <Divider />
              <div>
                <h2 className='text-xl font-semibold text-blue-darker'>
                  {t('deleteAccount.title')}
                </h2>
                <p className='mt-4 text-sm font-normal leading-6'>
                  {t('deleteAccount.description')}
                </p>
                <div className='mt-4 flex justify-end'>
                  <Button
                    onClick={showConfirm}
                    // type='text'
                    color='danger'
                    variant='solid'
                  >
                    {t('deleteAccount.deleteButton')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ConfigProvider>;
}

export default SettingsPage;
