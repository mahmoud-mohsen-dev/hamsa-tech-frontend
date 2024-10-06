'use client';
import { Link } from '@/navigation';
import { Checkbox, ConfigProvider, Form, Input } from 'antd';

function LoginForm() {
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
            { required: true, message: 'Email is required' }
          ]}
        >
          <Input placeholder='Email' />
        </Form.Item>

        <Form.Item
          name='password'
          rules={[
            { required: true, message: 'Password is required' }
          ]}
        >
          <Input.Password placeholder='Password' />
        </Form.Item>
        <div className='flex items-center justify-between'>
          <Form.Item
            name='remember-me'
            aria-describedby='remember'
            valuePropName='checked'
            style={{ marginBottom: 0 }}
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <Link
            href='/forget-password'
            className='text-blue-sky-accent text-sm font-medium hover:underline'
          >
            Forgot password?
          </Link>
        </div>
        <button
          type='submit'
          className='bg-blue-sky-accent my-4 w-full rounded-lg px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-sky-medium focus:outline-none focus:ring-4 focus:ring-blue-sky-medium'
        >
          Sign in
        </button>
        <p className='text-sm font-light text-gray-500'>
          Don’t have an account yet?{' '}
          <Link
            href='/signup'
            className='text-blue-sky-accent font-medium hover:underline'
          >
            Sign up
          </Link>
        </p>
      </Form>
    </ConfigProvider>
  );
}

export default LoginForm;
