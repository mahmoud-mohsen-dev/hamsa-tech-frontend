'use client';
import { useState } from 'react';
import { IoIosMenu } from 'react-icons/io';
import NavDrawerScreenSmall from './NavDrawerScreenSmall';
import { NavbarLink } from '@/types/getIndexLayout';
import { CategoryType } from '@/types/getNavbarProductsCategories';

interface PropsType {
  navLinks: NavbarLink[];
  productsSubNav: CategoryType[];
}

function HamburgerMenuIcon({ navLinks, productsSubNav }: PropsType) {
  const [isOpen, setIsOpen] = useState(false);
  const showDrawer = () => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        className='h-[1.75rem] w-[1.75rem]'
        onClick={() => {
          showDrawer();
        }}
      >
        {/* <div className='grid justify-items-center gap-1.5'>
        <span
          className={`h-[.2rem] w-[1.8rem] rounded-full bg-black-light transition ${isOpen ? 'translate-y-[.59375rem] rotate-45' : ''}`}
        ></span>
        <span
          className={`h-[.2rem] w-[1.8rem] rounded-full bg-black-light ${isOpen ? 'scale-x-0' : ''}`}
        ></span>
        <span
          className={`h-[.2rem] w-[1.8rem] rounded-full bg-black-light transition ${isOpen ? '-translate-y-[.59375rem] -rotate-45' : ''}`}
        ></span>
      </div> */}
        <IoIosMenu
          size={28}
          className='hamburger-menu text-inherit 2xl:hidden'
        />
      </button>
      <NavDrawerScreenSmall
        isOpen={isOpen}
        onClose={onClose}
        navLinks={navLinks}
        productsSubNav={productsSubNav}
      />
    </>
  );
}

export default HamburgerMenuIcon;
