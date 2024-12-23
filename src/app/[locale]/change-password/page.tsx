'use client';
import { useEffect } from 'react';
import { Form, Input, Button, ConfigProvider } from 'antd';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/navigation';
import { useSearchParams } from 'next/navigation';
import { useMyContext } from '@/context/Store';
// import useHandleMessagePopup from '@/hooks/useHandleMessagePopup';
import { fetchGraphqlClient } from '@/services/graphqlCrud';

interface PropsType {
  params: { locale: string };
}

const changePasswordQuery = ({
  password,
  passwordConfirmation,
  code
}: {
  password: string;
  passwordConfirmation: string;
  code: string;
}) => {
  return `mutation ResetPassword {
    resetPassword(
        password: "${password}"
        passwordConfirmation: "${passwordConfirmation}"
        code: "${code}"
    ) {
        jwt
    }
  }`;
};

const ChangePasswordPage = ({ params: { locale } }: PropsType) => {
  const [form] = Form.useForm();
  // const [messageApi, contextHolder] = message.useMessage();
  const { setErrorMessage, setSuccessMessage, setLoadingMessage } =
    useMyContext();
  // const { contextHolder } = useHandleMessagePopup();
  const t = useTranslations('ChangePasswordPage.content');
  const signupTranslation = useTranslations('SignupPage.content');
  const router = useRouter();
  const searchParams = useSearchParams();
  // console.log('searchParams', searchParams);
  const code = searchParams.get('code');
  // console.log('code', code);

  const onFinish = async (values: {
    password: string;
    confirmPassword: string;
  }) => {
    if (values.password !== values.confirmPassword) {
      console.error('Password Mismatch Error');
      setErrorMessage(t('passwordMismatchError'));
      return;
    }
    if (!code) {
      console.error('no code was found');
      setErrorMessage(t('passwordChangeError'));
      return;
    }

    // TODO: Implement password change logic here
    try {
      setLoadingMessage(true);
      const { data, error } = await fetchGraphqlClient(
        changePasswordQuery({
          password: values.password,
          passwordConfirmation: values.confirmPassword,
          code
        })
      );

      console.log(error);
      console.log(data);
      if (error || !data?.resetPassword?.jwt) {
        console.error('Change password error:', error);
        // throw new Error(`Change password error: ${error}`);
        return;
      }

      setSuccessMessage(t('passwordChangeSuccess'));
      // Redirect after successful password change
      setTimeout(() => {
        router.replace('/signin');
      }, 1500); // Delay by 1.5 second
    } catch (error) {
      console.error('Change password error', error);
      setErrorMessage(t('passwordChangeError'));
      router.replace('/forget-password');
    } finally {
      setLoadingMessage(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.error('Form failed:', errorInfo);
    setErrorMessage(t('formSubmissionFailed'));
  };

  const validatePassword = (_: any, value: string) => {
    const minLength = 8;
    const maxLength = 20;

    if (!value) {
      return Promise.reject(
        new Error(
          signupTranslation(
            'formValidationErrorMessages.passwordRequired'
          )
        )
      );
    }

    if (value.length < minLength) {
      return Promise.reject(
        new Error(
          signupTranslation(
            'formValidationErrorMessages.minValidationPasswordError'
          )
        )
      );
    }
    if (value.length > maxLength) {
      return Promise.reject(
        new Error(
          signupTranslation(
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
          signupTranslation(
            'formValidationErrorMessages.passwordInvalidCharacters'
          )
        )
      );
    }

    if (!hasLetter) {
      return Promise.reject(
        new Error(
          signupTranslation(
            'formValidationErrorMessages.passwordLetterError'
          )
        )
      );
    }

    if (!hasNumber) {
      return Promise.reject(
        new Error(
          signupTranslation(
            'formValidationErrorMessages.passwordNumberError'
          )
        )
      );
    }

    return Promise.resolve();
  };

  useEffect(() => {
    if (!code) {
      router.replace('/forget-password');
    }
  }, [searchParams, router, code]);

  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: 'var(--font-inter)',
          colorPrimary: '#1677ff',
          borderRadius: 8,
          lineWidth: 1
        },
        components: {
          Input: {
            activeShadow: '0 0 0 3px rgba(5, 145, 255, 0.1)',
            paddingBlock: 10,
            paddingInline: 15
          },
          Button: {
            controlHeight: 50,
            fontSize: 16
          }
        }
      }}
    >
      <section className='mx-auto flex flex-col items-center justify-center font-inter md:min-h-[calc(100vh-160px)]'>
        <div className='w-full rounded-lg border border-solid border-gray-light border-opacity-60 bg-white shadow sm:max-w-md md:mt-0 xl:p-0'>
          <div className='space-y-4 p-6 sm:p-8 md:space-y-5'>
            <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl'>
              {t('headerTitle')}
            </h1>

            {/* {contextHolder} */}
            <Form
              form={form}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              className='space-y-4'
            >
              <Form.Item
                name='password'
                rules={[{ validator: validatePassword }]}
                hasFeedback
              >
                <Input.Password
                  placeholder={t('passwordPlaceholder')}
                />
              </Form.Item>

              <Form.Item
                name='confirmPassword'
                dependencies={['password']}
                rules={[
                  {
                    required: true,
                    message: signupTranslation(
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
                          signupTranslation(
                            'formValidationErrorMessages.passwordMismatch'
                          )
                        )
                      );
                    }
                  })
                ]}
              >
                <Input.Password
                  placeholder={t('confirmPasswordPlaceholder')}
                />
              </Form.Item>

              <Button
                type='primary'
                htmlType='submit'
                block
                style={{ marginTop: '26px' }}
                // className='w-full bg-blue-600 text-white hover:bg-blue-700'
              >
                {t('submitButton')}
              </Button>
            </Form>
          </div>
        </div>
      </section>
    </ConfigProvider>
  );
};

export default ChangePasswordPage;
