'use client';
import { useUser } from '@/context/UserContext';
import { useRouter } from '@/navigation';
import { removeCookie } from '@/utils/cookieUtils';
import { useTranslations } from 'next-intl';
import { LuLogOut } from 'react-icons/lu';

function SignOutButton() {
  // const router = useRouter();
  const { logout } = useUser();
  const t = useTranslations('AccountLayoutPage');
  return (
    <button
      onClick={() => {
        // router.push('/signin');
        logout();
        // removeCookie('token');
        // setUserId(null);
      }}
      className='flex w-full flex-wrap items-center gap-4 px-4 py-4 leading-[22px] text-black-light transition-colors duration-100 hover:bg-gray-ultralight'
    >
      <LuLogOut />
      <span className='capitalize'>{t('siderbarSignOutTitle')}</span>
    </button>
  );
}

export default SignOutButton;
