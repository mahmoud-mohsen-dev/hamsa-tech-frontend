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
  fetchCartData,
  fetchUserCartData
} from '@/services/cart';
import { createWishlistInTheBackend } from '@/services/wishlist';
import useWishlist from '@/hooks/useWishlist';
import { useSyncAuth } from '@/hooks/useSyncAuth';
import { useSyncAcrossTabs } from '@/hooks/useSyncAcrossTabs';

interface PropsType {
  navLinks: NavbarLink[];
  productsSubNav: CategoryType[];
}

function Header({ navLinks, productsSubNav }: PropsType) {
  const {
    cartId,
    setCartId,
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
  const [wishlistId, setWishlistId] = useState<string | null>(null);
  const [linkHovered, setLinkHovered] = useState('');
  const { userId, setAddressesData } = useUser();
  const locale = useLocale();
  const defaultValue = locale;
  const pathname = usePathname();
  const t = useTranslations('HomePage.Header');

  const fetchCart = async () => {
    if (userId) {
      // console.log('userId in fetchCart', userId);
      console.log('fetchUserCartData was called, userId:', userId);
      // Logged in → fetch server cart
      return await fetchUserCartData({
        locale,
        setCart,
        setTotalCartCost,
        setIsCartCheckoutLoading,
        setCartId
      });
    }

    if (cartId) {
      // console.log('cartId in fetchCart', cartId);

      console.log('fetchCartData was called, cartId:', cartId);
      // Guest with cartId → fetch guest cart
      return await fetchCartData({
        cartId,
        locale,
        setCart,
        setTotalCartCost,
        setIsCartCheckoutLoading,
        setCartId
      });
    }

    // console.log('Guest without cart in fetchCart');
    console.log('createCart was called');

    // Guest without cart → create new cart
    return await createCart({ setCart, setCartId, setTotalCartCost });
  };

  console.log('USERID', userId);
  const cartKey =
    userId ? `/cart/user/${userId}?locale=${locale}`
    : cartId ? `/cart/guest/${cartId}?locale=${locale}`
    : `/cart/guest/new?locale=${locale}`;

  // console.log(`cartKey`, cartKey);
  const { mutate: mutateCart, isValidating: cartIsValidating } =
    useSWR(cartKey, fetchCart);

  // console.log(`tempData`, tempData);

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
  // useSyncLogout({ setCartId });
  useSyncAuth({ setCartId });

  useEffect(() => {
    try {
      const cartIdFromCookie = getCartIdFromCookie();
      setCartId(cartIdFromCookie ?? null);

      let wishlistIds: Record<string, string> = {};

      const wishlistIdsStr = getCookie('wishlistIds');
      if (wishlistIdsStr) {
        try {
          wishlistIds = JSON.parse(wishlistIdsStr);
        } catch (e) {
          console.error('Invalid wishlistIds cookie JSON', e);
        }
      }
      // const wishlistIds = JSON.parse(wishlistIdsStr ?? '');

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

  // ⚡ Revalidate cart in all tabs
  useSyncAcrossTabs('cart-updated', () => {
    mutateCart(); // refresh cart data in this tab
  });

  // console.log('wishlistId @Header', wishlistId);

  useEffect(() => {
    const wishlistIdsStr = getCookie('wishlistIds');
    const handleWishlist = async () => {
      if (!wishlistIdsStr) {
        createWishlistInTheBackend().then(() => mutateWishlist()); // Creates a wishlist & refreshes data
      } else {
        mutateWishlist(); // Refresh wishlist data if it exists
      }
    };

    const handleRequests = async () => {
      // handleCart();
      // handleCartOnAuthChange();
      mutateCart();

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
