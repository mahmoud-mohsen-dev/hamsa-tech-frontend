'use client';
import React, { useEffect } from 'react';
import { UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown } from 'antd';
import { FaSignInAlt } from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';
import { Link, useRouter } from '@/navigation';
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
  onClick: React.MouseEventHandler<HTMLAnchorElement>;
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
  signIn,
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
        <a
          onClick={onClick}
          className='when-logged-out-list-item flex items-center gap-3'
        >
          <FaSignInAlt size={14} />
          <span>{signIn}</span>
        </a>
      )
    }
  ];
};

const ProfileDropdownMenu = () => {
  const { userId, logout } = useUser();
  const t = useTranslations('HomePage.Header');
  const router = useRouter(); // Initialize useRouter

  const handleLogin: React.MouseEventHandler<HTMLAnchorElement> = (
    e
  ) => {
    e.preventDefault();

    router.push('/signin');
  };

  const [items, setItems] = React.useState<MenuProps['items']>(
    itemsWhenLoggedOut({
      account: t('accountLabel'),
      // profile: t('profileLabel'),
      signIn: t('signinLabel'),
      onClick: handleLogin
    })
  );

  const handleLogout: React.MouseEventHandler<HTMLAnchorElement> = (
    e
  ) => {
    e.preventDefault();

    logout();
  };

  useEffect(() => {
    if (userId) {
      setItems(
        itemsWhenLoggedIn({
          account: t('accountLabel'),
          profile: t('profileLabel'),
          signOut: t('signoutLabel'),
          onClick: handleLogout
        })
      );
    } else {
      setItems(
        itemsWhenLoggedOut({
          account: t('accountLabel'),
          signIn: t('signinLabel'),
          onClick: handleLogin
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
