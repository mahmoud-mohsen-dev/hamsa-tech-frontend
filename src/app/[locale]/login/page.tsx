import LoginForm from '@/components/UI/login/LoginForm';
import { Link } from '@/navigation';
import { Form, Input } from 'antd';
import { unstable_setRequestLocale } from 'next-intl/server';

interface PropsType {
  params: { locale: string };
}

function LoginPage({ params: { locale } }: PropsType) {
  unstable_setRequestLocale(locale);
  return (
    <section className='mx-auto flex flex-col items-center justify-center px-6 py-8 font-inter md:h-screen lg:py-0'>
      <div className='w-full rounded-lg border border-solid border-gray-light border-opacity-60 bg-white shadow sm:max-w-md md:mt-0 xl:p-0'>
        <div className='space-y-4 p-6 sm:p-8 md:space-y-6'>
          <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl'>
            Sign in to your account
          </h1>
          <LoginForm />

        </div>
      </div>
    </section>
  );
}

export default LoginPage;
