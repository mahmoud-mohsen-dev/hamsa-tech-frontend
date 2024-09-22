'use client';
import useScrollHandler from '@/hooks/useScrollHander';
import Navbar from '../UI/navbar/Navbar';
import { useState } from 'react';
import { TiShoppingCart } from 'react-icons/ti';
import { UserOutlined } from '@ant-design/icons';
import { HiOutlineHeart } from 'react-icons/hi';
import ModalSearchInput from '../UI/navbar/ModalSearchInput';
import HamburgerMenuIcon from '../UI/navbar/HamburgerMenuIcon';
import { useLocale, useTranslations } from 'next-intl';
import SelectLanguage from '../UI/navbar/SelectLanguage';
import { Link, usePathname } from '@/navigation';
import { NavbarLink } from '@/types/getIndexLayout';

interface PropsType {
  navLinks: NavbarLink[];
}

function Header({ navLinks }: PropsType) {
  const locale = useLocale();
  const defaultValue = locale;

  const pathname = usePathname();
  const t = useTranslations('HomePage.Header');

  const [linkHovered, setLinkHovered] = useState('');
  // const [linkHovered,] = useState('');
  useScrollHandler();

  return (
    <header
      className={`header fixed left-0 top-0 z-[100] mx-auto flex h-[48px] w-full items-center bg-transparent md:h-[64px] ${pathname === '/' ? 'bg-transparent' : 'colored-navbar'} ${linkHovered ? 'colored-navbar' : 'bg-transparent'}`}
    >
      <div className='container flex h-full items-stretch justify-between'>
        <div className='flex h-full items-center 2xl:gap-5 3xl:gap-10'>
          <Link
            className='flex h-full items-center gap-3 md:gap-4'
            href='/'
          >
            <div className='logo_img h-6 w-6 md:h-7 md:w-7'></div>
            <h1 className='flex items-center gap-1'>
              <span className='logo_hamsa text-md font-semibold uppercase text-white'>
                {t('logoPart1')}
              </span>
              <span className='logo_tech text-md font-semibold uppercase text-white'>
                {t('logoPart2')}
              </span>
            </h1>
          </Link>
          {/* Navbar */}
          <Navbar
            linkHovered={linkHovered}
            setLinkHovered={setLinkHovered}
            navLinks={navLinks}
          />
        </div>

        <div className='hidden items-center 2xl:flex'>
          <Link
            href='/'
            className='wishlist relative ml-4 text-white'
          >
            <div className='absolute right-0 top-0 z-[200] flex h-4 w-4 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-red-shade-350 bg-opacity-80'>
              <p className='text-[.5rem] leading-[1rem] text-white'>
                1
              </p>
            </div>
            <HiOutlineHeart size={22} className='text-inherit' />
          </Link>
          <Link href='/' className='profile ml-5 text-white'>
            <UserOutlined className='text-[20px] text-inherit' />
          </Link>
          <Link href='/' className='shopping-cart relative ml-5'>
            <div className='absolute right-0 top-0 z-[200] flex h-4 w-4 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-red-shade-350 bg-opacity-80'>
              <p className='text-[.5rem] leading-[1rem] text-white'>
                3
              </p>
            </div>
            <TiShoppingCart size={24} className='text-inherit' />
          </Link>

          <div className='ml-5 h-[22px] w-[1px] rounded-sm bg-[#eaeaea]'></div>
          <ModalSearchInput />
          <SelectLanguage defaultValue={defaultValue} />
        </div>

        <div className='flex h-full items-center justify-center 2xl:hidden'>
          <HamburgerMenuIcon />
        </div>
      </div>
    </header>
  );
}

export default Header;
