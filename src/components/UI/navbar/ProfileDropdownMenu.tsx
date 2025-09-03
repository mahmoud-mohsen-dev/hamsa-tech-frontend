'use client';
import React, { useEffect } from 'react';
import { UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown } from 'antd';
// import { FiLogOut } from 'react-icons/fi';
import { FaSignInAlt } from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';
import { Link, useRouter } from '@/navigation';
import { removeCookie } from '@/utils/cookieUtils';
import { useTranslations } from 'next-intl';
import { useUser } from '@/context/UserContext';

interface LoggedInProps {
  account: string;
  profile: string;
  signOut: string;
  onClick: React.MouseEventHandler<HTMLAnchorElement>;
}
interface LoggedOutProps {
  account: string;
  // profile: string;
  signIn: string;
}

const itemsWhenLoggedIn: ({
  account,
  profile,
  signOut,
  onClick
}: LoggedInProps) => MenuProps['items'] = ({
  account,
  profile,
  signOut,
  onClick
}) => {
  return [
    {
      key: '1',
      label: account,
      disabled: true,
      style: { textAlign: 'center' }
    },
    {
      type: 'divider'
    },
    {
      key: '2',
      label: (
        <Link
          href='/account/settings'
          className='flex items-center gap-3'
        >
          <CgProfile size={14} />
          <span>{profile}</span>
        </Link>
      )
    },
    {
      key: '3',
      label: (
        <a
          onClick={onClick}
          className='when-logged-in-list-item flex items-center gap-3'
        >
          <FaSignInAlt size={14} />
          <span>{signOut}</span>
        </a>
      )
    }
  ];
};

const itemsWhenLoggedOut: ({
  account,
  // profile,
  signIn
}: LoggedOutProps) => MenuProps['items'] = ({
  account,
  // profile,
  signIn
}) => {
  return [
    {
      key: '1',
      label: account,
      disabled: true,
      style: { textAlign: 'center' }
    },
    {
      type: 'divider'
    },
    {
      key: '2',
      label: (
        <Link
          href='/signin'
          className='when-logged-out-list-item flex items-center gap-3'
        >
          <FaSignInAlt size={14} />
          <span>{signIn}</span>
        </Link>
      )
    }
  ];
};

const ProfileDropdownMenu: React.FC = () => {
  const t = useTranslations('HomePage.Header');
  const { userId, setUserId, setAddressesData } = useUser();
  const router = useRouter(); // Initialize useRouter
  const [items, setItems] = React.useState<MenuProps['items']>(
    itemsWhenLoggedOut({
      account: t('accountLabel'),
      // profile: t('profileLabel'),
      signIn: t('signinLabel')
    })
  );

  const logout: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault();
    removeCookie('token');
    setUserId(null);
    setAddressesData(null);
    router.push('/signin'); // Use router to redirect to the login page
  };

  useEffect(() => {
    if (userId) {
      setItems(
        itemsWhenLoggedIn({
          account: t('accountLabel'),
          profile: t('profileLabel'),
          signOut: t('signoutLabel'),
          onClick: logout
        })
      );
    } else {
      setItems(
        itemsWhenLoggedOut({
          account: t('accountLabel'),
          // profile: t('profileLabel'),
          signIn: t('signinLabel')
        })
      );
    }
  }, [userId]);

  return (
    <Dropdown
      menu={{ items }}
      placement='bottom'
      overlayClassName='profile-menu'
    >
      <UserOutlined className='h-[30px] text-[20px] text-inherit' />
    </Dropdown>
  );
};

export default ProfileDropdownMenu;
