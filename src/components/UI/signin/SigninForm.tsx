'use client';
import { Link } from '@/navigation';
import { Checkbox, ConfigProvider, Form, Input } from 'antd';
import { useTranslations } from 'next-intl';

function LoginForm() {
  const t = useTranslations('SigninPage.content');
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
      <Form colon={false}>
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
            }
          ]}
        >
          <Input.Password placeholder={t('passwordPlaceholder')} />
        </Form.Item>
        <div className='flex items-center justify-between'>
          <Form.Item
            name='remember-me'
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
