'use client';
import { useUser } from '@/context/UserContext';
import { Link, useRouter } from '@/navigation';
import { fetchGraphqlClient } from '@/services/graphqlCrud';
import { SigninResponseType } from '@/types/authincationResponseTypes';
import { getIdFromToken, setCookie } from '@/utils/cookieUtils';
import { Checkbox, ConfigProvider, Form, Input, message } from 'antd';
import { useTranslations } from 'next-intl';
import { ValidateErrorEntity } from 'rc-field-form/lib/interface';

const signinQUery = ({
  email,
  password
}: {
  email: string;
  password: string;
}) => {
  return `mutation {
  login(input: { identifier: "${email}", password: "${password}" }) {
    jwt
  }
}`;
};

function LoginForm() {
  const router = useRouter();
  const { setUserId } = useUser();
  const [messageApi, contextHolder] = message.useMessage();
  const t = useTranslations('SigninPage.content');
  const e = useTranslations('CheckoutPage.content');
  const x = useTranslations('SignupPage.content');

  const onFinish = (values: {
    email: string;
    password: string;
    rememberMe: boolean;
  }) => {
    // TODO: Implement login logic here
    const logIn = async () => {
      try {
        console.log('Received values of form:', values);
        messageApi.open({
          type: 'loading',
          content: e('form.loading'),
          duration: 0
        });

        const { data: loginData, error: loginError } =
          (await fetchGraphqlClient(
            signinQUery({
              email: values.email,
              password: values.password
            })
          )) as SigninResponseType;

        if (loginError || !loginData?.login?.jwt) {
          console.error('Login error', loginError);
          messageApi.error(
            t('formValidationErrorMessages.invalidCredentials')
          );
          return;
        }
        // Store JWT in cookie
        if (values.rememberMe) {
          setCookie('token', loginData.login.jwt, 30);
        } else {
          setCookie('token', loginData.login.jwt, 1);
        }

        const userId = getIdFromToken();
        if (!userId) {
          messageApi.error(
            t('formValidationErrorMessages.invalidCredentials')
          );
          return;
        }
        setUserId(userId);
        messageApi.success(
          t('formValidationErrorMessages.signinSuccessMessage')
        );
        setTimeout(() => {
          router.push('/products');
        }, 1000); // Delay by 1 second
      } catch (err) {
        console.error('Error during form submission:', err);
        messageApi.error(
          t('formValidationErrorMessages.errorDuringFormSubmission')
        );
      } finally {
        setTimeout(messageApi.destroy, 900);
      }
    };

    logIn();
  };

  const onFinishFailed = (errorInfo: ValidateErrorEntity<any>) => {
    messageApi.error(
      errorInfo?.errorFields[0]?.errors[0] ??
        e('form.formSubmissionFailed')
    );
    console.log('Form submission failed:', errorInfo);
  };

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
          Checkbox: {
            borderRadiusSM: 5
          }
        }
      }}
    >
      <Form
        colon={false}
        initialValues={{ rememberMe: false }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        {contextHolder}
        <Form.Item
          name='email'
          rules={[
            { type: 'email' },
            {
              required: true,
              message: t('formValidationErrorMessages.emailRequired')
            }
          ]}
        >
          <Input placeholder={t('emailPlaceholder')} />
        </Form.Item>
        <Form.Item
          name='password'
          rules={[
            {
              required: true,
              message: t(
                'formValidationErrorMessages.passwordRequired'
              )
            },
            {
              min: 8,
              message: x(
                'formValidationErrorMessages.minValidationPasswordError'
              )
            },
            {
              max: 20,
              message: x(
                'formValidationErrorMessages.maxValidationPasswordError'
              )
            }
          ]}
        >
          <Input.Password placeholder={t('passwordPlaceholder')} />
        </Form.Item>
        <div className='flex flex-wrap items-center justify-between gap-2'>
          <Form.Item
            name='rememberMe'
            aria-describedby='remember'
            valuePropName='checked'
            style={{ marginBottom: 0 }}
          >
            <Checkbox>{t('rememberMeLabel')}</Checkbox>
          </Form.Item>
          <Link
            href='/forget-password'
            className='text-sm font-medium text-blue-sky-accent hover:underline'
          >
            {t('forgotPasswordLink')}
          </Link>
        </div>
        <button
          type='submit'
          className='my-4 w-full rounded-lg bg-blue-sky-accent px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-sky-medium focus:outline-none focus:ring-4 focus:ring-blue-sky-medium'
        >
          {t('loginButton')}
        </button>
        <p className='text-sm font-light text-gray-500'>
          {t('signupLabel')}{' '}
          <Link
            href='/signup'
            className='font-medium text-blue-sky-accent hover:underline'
          >
            {t('registerButton')}
          </Link>
        </p>
      </Form>
    </ConfigProvider>
  );
}

export default LoginForm;
