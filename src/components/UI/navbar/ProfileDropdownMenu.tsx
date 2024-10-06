import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown } from 'antd';
import { FiLogOut } from 'react-icons/fi';
import { FaSignInAlt } from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';
import { Link } from '@/navigation';

const items: MenuProps['items'] = [
  {
    key: '1',
    label: 'Account',
    disabled: true
  },
  {
    type: 'divider'
  },
  {
    key: '2',
    label: (
      <Link href='/profile' className='flex items-center gap-3'>
        <CgProfile size={14} />
        <span>Profile</span>
      </Link>
    )
  },
  {
    key: '3',
    label: (
      <Link href='/signin' className='flex items-center gap-3'>
        <FaSignInAlt size={14} />
        <span>Sign in</span>
      </Link>
    )
  },
  {
    key: '4',
    label: (
      <Link href='/login' className='flex items-center gap-3'>
        <FiLogOut size={14} />
        <span>Sign out</span>
      </Link>
    )
  }
];

const ProfileDropdownMenu: React.FC = () => (
  <Dropdown
    menu={{ items }}
    placement='bottomCenter'
    overlayClassName='profile-menu'
  >
    <UserOutlined className='h-[30px] text-[20px] text-inherit' />
  </Dropdown>
);

export default ProfileDropdownMenu;
