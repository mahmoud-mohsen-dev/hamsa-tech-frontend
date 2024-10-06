import LinkLogin from '@/components/UI/signin/LinkSignin';
import { Divider } from 'antd';
import { getTranslations } from 'next-intl/server';
import { FaFacebook } from 'react-icons/fa6';
import { FcGoogle } from 'react-icons/fc';

async function SignWIthGoogleAndFacebook() {
  const t = await getTranslations('SigninPage.content');
  return (
    <>
      <div className='flex items-center gap-3 font-inter text-xs'>
        <LinkLogin
          href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/connect/google`}
        >
          <FcGoogle size={20} />
          <span>{t('googleButton')}</span>
        </LinkLogin>
        <LinkLogin
          href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/connect/facebook`}
        >
          <FaFacebook className='text-[#1877f2]' size={20} />
          <span>{t('facebookButton')}</span>
        </LinkLogin>
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
        <span>{t('orLabel')}</span>
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
    </>
  );
}

export default SignWIthGoogleAndFacebook;
