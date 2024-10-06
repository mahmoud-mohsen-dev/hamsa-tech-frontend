import Btn from '@/components/UI/Btn';
import LoginForm from '@/components/UI/login/LoginForm';
import { Link } from '@/navigation';
import { Divider } from 'antd';
import { unstable_setRequestLocale } from 'next-intl/server';
import { FaFacebook } from 'react-icons/fa6';
import { FcGoogle } from 'react-icons/fc';

interface PropsType {
  params: { locale: string };
}

function LoginPage({ params: { locale } }: PropsType) {
  unstable_setRequestLocale(locale);
  return (
    <section className='mx-auto flex flex-col items-center justify-center px-6 py-8 font-inter md:h-screen lg:py-0'>
      <div className='w-full rounded-lg border border-solid border-gray-light border-opacity-60 bg-white shadow sm:max-w-md md:mt-0 xl:p-0'>
        <div className='space-y-4 p-6 sm:p-8 md:space-y-5'>
          <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl'>
            Sign in to your account
          </h1>

          <div className='flex items-center gap-3 font-inter text-xs'>
            <Link
              href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/connect/google`}
              className='flex basis-1/2 items-center justify-center gap-2 rounded-lg border border-solid border-gray-light py-2.5 transition-colors duration-200 hover:bg-[#f3f4f6b8]'
            >
              <FcGoogle size={20} />
              <span>Sign in with Google</span>
            </Link>
            <Link
              href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/connect/facebook`}
              className='flex basis-1/2 items-center justify-center gap-2 rounded-lg border border-solid border-gray-light py-2.5 transition-colors duration-200 hover:bg-[#f3f4f6b8]'
            >
              <FaFacebook className='text-[#1877f2]' size={20} />
              <span>Sign in with Facebook</span>
            </Link>
          </div>

          <div className='flex w-full items-center gap-5'>
            <Divider
              style={{
                flexBasis: '45%',
                minWidth: 0,
                borderColor: '#E9E9E9',
                marginTop: 0,
                marginBottom: 0
              }}
            />
            <span>or</span>
            <Divider
              style={{
                flexBasis: '45%',
                minWidth: 0,
                borderColor: '#E9E9E9',
                marginTop: 0,
                marginBottom: 0
              }}
            />
          </div>
          <LoginForm />
        </div>
      </div>
    </section>
  );
}

export default LoginPage;
