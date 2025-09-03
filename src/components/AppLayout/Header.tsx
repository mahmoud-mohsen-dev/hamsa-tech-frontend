'use client';
import useScrollHandler from '@/hooks/useScrollHander';
import Navbar from '../UI/navbar/Navbar';
import { useEffect, useState } from 'react';
import { TiShoppingCart } from 'react-icons/ti';
import { HiOutlineHeart } from 'react-icons/hi';
import ModalSearchInput from '../UI/navbar/ModalSearchInput';
import HamburgerMenuIcon from '../UI/navbar/HamburgerMenuIcon';
import { useLocale, useTranslations } from 'next-intl';
import SelectLanguage from '../UI/navbar/SelectLanguage';
import { Link, usePathname } from '@/navigation';
import { NavbarLink } from '@/types/getIndexLayout';
import { CategoryType } from '@/types/getNavbarProductsCategories';
import { getCartIdFromCookie, getCookie } from '@/utils/cookieUtils';
import { useMyContext } from '@/context/Store';
import ProfileDropdownMenu from '../UI/navbar/ProfileDropdownMenu';
import { useUser } from '@/context/UserContext';
import { handleShippingAddresses } from '@/services/shippingAddress';
import useSWR from 'swr';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import {
  countCartItems,
  createCart,
  fetchCartData
} from '@/services/cart';
import {
  createWishlistInTheBackend,
  fetchWishlistData
} from '@/services/wishlist';
import useWishlist from '@/hooks/useWishlist';

interface PropsType {
  navLinks: NavbarLink[];
  productsSubNav: CategoryType[];
}

function Header({ navLinks, productsSubNav }: PropsType) {
  const {
    cart,
    setCart,
    setIsCartCheckoutLoading,
    setOpenDrawer,
    setDrawerIsLoading,
    setTotalCartCost,
    setWishlistsData,
    wishlistsData,
    setIsWishlistLoading,
    setIsAddressIsLoading
  } = useMyContext();
  const [cartId, setCartId] = useState<string | null>(null);
  const [wishlistId, setWishlistId] = useState<string | null>(null);
  const [linkHovered, setLinkHovered] = useState('');
  const { userId, setAddressesData } = useUser();
  const locale = useLocale();
  const defaultValue = locale;
  const pathname = usePathname();
  const t = useTranslations('HomePage.Header');

  const {
    // data: cartData,
    mutate: mutateCart,
    isValidating: cartIsValidating
  } = useSWR(cartId ? ['cart', cartId] : null, () =>
    fetchCartData({
      cartId: !isNaN(Number(cartId)) ? Number(cartId) : null,
      locale,
      setCart,
      setTotalCartCost,
      setIsCartCheckoutLoading,
      setCartId
    })
  );

  const {
    mutate: mutateWishlist,
    isValidating: wishlistIsValidating
  } = useWishlist({
    locale,
    setIsWishlistLoading,
    wishlistId,
    setWishlistsData
  });

  // const { wishlistData, mutate, isValidating } = useWishlist(
  //   wishlistIds,
  //   locale
  // );

  useScrollHandler();

  useEffect(() => {
    try {
      setCartId(getCartIdFromCookie());
      const wishlistIdsStr = getCookie('wishlistIds');
      const wishlistIds = JSON.parse(wishlistIdsStr ?? '');
      setWishlistId(
        (
          (locale === 'ar' || locale === 'en') &&
            typeof wishlistIds[locale] === 'string'
        ) ?
          wishlistIds[locale]
        : null
      );
    } catch (e) {
      console.log(e);
    }
  }, []);

  // console.log('wishlistId @Header', wishlistId);

  useEffect(() => {
    const cartIdFromCookie = getCartIdFromCookie();
    const handleCart = async () => {
      if (!cartIdFromCookie) {
        createCart({ setCart, setCartId, setTotalCartCost }).then(
          () => mutateCart()
        ); // Creates a cart & refreshes data
      } else {
        mutateCart(); // Refresh cart data if it exists
      }
    };

    const wishlistIdsStr = getCookie('wishlistIds');
    const handleWishlist = async () => {
      if (!wishlistIdsStr) {
        createWishlistInTheBackend().then(() => mutateWishlist()); // Creates a wishlist & refreshes data
      } else {
        mutateWishlist(); // Refresh wishlist data if it exists
      }
    };

    const handleRequests = async () => {
      handleCart();

      handleWishlist();

      handleShippingAddresses({
        setIsAddressIsLoading,
        setAddressesData
      });
    };

    handleRequests();
  }, [cartId, userId, wishlistId]);

  return (
    <header
      className={`header fixed left-0 top-0 z-[100] flex h-[48px] w-full items-center bg-transparent md:h-[64px] 2xl:left-1/2 2xl:-translate-x-1/2 ${pathname === '/' ? 'bg-transparent' : 'colored-navbar'} ${linkHovered ? 'colored-navbar' : 'bg-transparent'}`}
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
            productsSubNav={productsSubNav}
          />
        </div>

        <div className='flex items-center'>
          {wishlistIsValidating ?
            <div
              className={`relative ${locale === 'ar' ? 'ml-5' : 'mr-5 2xl:ml-5 2xl:mr-0'}`}
            >
              <Spin
                indicator={<LoadingOutlined spin />}
                className='wishlist'
              />
            </div>
          : <Link
              href='/wishlist'
              className='wishlist relative ml-3 hidden text-white 2xl:ml-4 2xl:block'
            >
              {wishlistsData.length > 0 && (
                <div className='absolute right-0 top-0 z-[200] flex h-4 w-4 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-red-shade-350 bg-opacity-80'>
                  <p className='text-[.5rem] leading-[1rem] text-white'>
                    {wishlistsData.length}
                  </p>
                </div>
              )}
              <HiOutlineHeart size={22} className='text-inherit' />
            </Link>
          }

          <Link
            href={userId ? '/account/settings' : '/signin'}
            className='profile ml-3 hidden text-white 2xl:ml-5 2xl:block'
          >
            <ProfileDropdownMenu />
          </Link>

          {cartIsValidating ?
            <div
              className={`relative ${locale === 'ar' ? 'ml-5' : 'mr-5 2xl:ml-5 2xl:mr-0'}`}
            >
              <Spin
                indicator={<LoadingOutlined spin />}
                className='shopping-cart'
              />
            </div>
          : <button
              className={`shopping-cart relative ${locale === 'ar' ? 'ml-5' : 'mr-5 2xl:ml-5 2xl:mr-0'}`}
              onClick={() => {
                setOpenDrawer(true);
                setDrawerIsLoading(true);
                setTimeout(() => {
                  setDrawerIsLoading(false);
                }, 2000);
              }}
            >
              {countCartItems(cart) > 0 && (
                <div className='absolute right-0 top-0 z-[200] flex h-4 w-4 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-red-shade-350 bg-opacity-80'>
                  <p className='text-[.5rem] leading-[1rem] text-white'>
                    {countCartItems(cart)}
                  </p>
                </div>
              )}
              <TiShoppingCart size={24} className='text-inherit' />
            </button>
          }

          <div className='ml-5 hidden h-[22px] w-[1px] rounded-sm bg-[#eaeaea] 2xl:block'></div>
          <ModalSearchInput />
          <SelectLanguage
            defaultValue={defaultValue}
            styleWidth={85}
          />

          <HamburgerMenuIcon
            navLinks={navLinks}
            productsSubNav={productsSubNav}
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
