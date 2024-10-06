import LoginForm from '@/components/UI/signin/SigninForm';
import {
  getTranslations,
  unstable_setRequestLocale
} from 'next-intl/server';
import SignWIthGoogleAndFacebook from '../../../components/UI/signin/SignWIthGoogleAndFacebook';

interface PropsType {
  params: { locale: string };
}

async function LoginPage({ params: { locale } }: PropsType) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('SigninPage.content');
  return (
    <section className='mx-auto flex flex-col items-center justify-center px-6 py-8 font-inter md:h-screen lg:py-0'>
      <div className='w-full rounded-lg border border-solid border-gray-light border-opacity-60 bg-white shadow sm:max-w-md md:mt-0 xl:p-0'>
        <div className='space-y-4 p-6 sm:p-8 md:space-y-5'>
          <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl'>
            {t('title')}
          </h1>

          <SignWIthGoogleAndFacebook />
          <LoginForm />
        </div>
      </div>
    </section>
  );
}

export default LoginPage;
