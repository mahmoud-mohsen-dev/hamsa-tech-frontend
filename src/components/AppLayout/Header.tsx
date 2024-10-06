'use client';
import useScrollHandler from '@/hooks/useScrollHander';
import Navbar from '../UI/navbar/Navbar';
import { useEffect, useState } from 'react';
import { TiShoppingCart } from 'react-icons/ti';
import { UserOutlined } from '@ant-design/icons';
import { HiOutlineHeart } from 'react-icons/hi';
import ModalSearchInput from '../UI/navbar/ModalSearchInput';
import HamburgerMenuIcon from '../UI/navbar/HamburgerMenuIcon';
import { useLocale, useTranslations } from 'next-intl';
import SelectLanguage from '../UI/navbar/SelectLanguage';
import { Link, usePathname } from '@/navigation';
import { NavbarLink } from '@/types/getIndexLayout';
import { CategoryType } from '@/types/getNavbarProductsCategories';
import {
  doesCookieByNameExist,
  getCartId,
  removeCartId,
  setCartId,
  setCookie
} from '@/utils/cookieUtils';
import { fetchGraphqlClient } from '@/services/graphqlCrud';
import {
  CartDataType,
  CreateCartResponseType,
  GetCartResponseType
} from '@/types/cartResponseTypes';
import { useMyContext } from '@/context/Store';
import { aggregateCartItems } from '@/utils/cartContextUtils';
import { CreateGuestUserResponseType } from '@/types/guestUserReponses';
import { CreateAddressResponseType } from '@/types/addressResponseTypes';
import ProfileDropdownMenu from '../UI/navbar/ProfileDropdownMenu';

interface PropsType {
  navLinks: NavbarLink[];
  productsSubNav: CategoryType[];
}

const createCartQuery = () => {
  return `mutation {
    createCart(
        data: {
            publishedAt: "${new Date().toISOString()}"
        }
    ) {
        data {
            id
        }
    }
  }`;
};

const getCartQuery = (cartId: number) => {
  return `{
    cart(id: ${cartId}) {
        data {
            attributes {
                total_cart_cost
                product_details {
                    id
                    quantity
                    cost
                    total_cost
                    product {
                        data {
                            id
                            attributes {
                                name
                                price
                                sale_price
                                image_thumbnail {
                                    data {
                                        id
                                        attributes {
                                            alternativeText
                                            url
                                        }
                                    }
                                }
                                stock
                                localizations {
                                    data {
                                        id
                                    }
                                }
                                locale
                            }
                        }
                    }
                }
            }
        }
    }
  }`;
};

const getCreateGuestUserQuery = () => {
  return `mutation CreateGuestUser {
    createGuestUser(
        data: {
            subscribed_to_news_and_offers: ${false}
            publishedAt: "${new Date().toISOString()}"
        }
    ) {
        data {
            id
        }
    }
  }`;
};

const getCreateShippingAddressQuery = () => {
  return `mutation CreateAddress {
    createAddress(
        data: {
            publishedAt: "${new Date().toISOString()}"
        }
    ) {
        data {
            id
        }
    }
  }`;
};

const countCartItems = (cart: CartDataType[]) => {
  if (cart.length > 0) {
    return cart.reduce((acc, cur) => {
      return (acc += cur.quantity);
    }, 0);
  }
  return 0;
};

function Header({ navLinks, productsSubNav }: PropsType) {
  const {
    cart,
    setCart,
    setOpenDrawer,
    setDrawerIsLoading,
    setTotalCartCost
  } = useMyContext();
  const [linkHovered, setLinkHovered] = useState('');

  const locale = useLocale();
  const defaultValue = locale;

  const pathname = usePathname();
  const t = useTranslations('HomePage.Header');

  // const [linkHovered,] = useState('');
  useScrollHandler();

  useEffect(() => {
    const handleCart = async () => {
      const cartId = getCartId();

      if (!cartId) {
        try {
          const { data, error }: CreateCartResponseType =
            await fetchGraphqlClient(createCartQuery());

          if (error || !data || data.createCart.data === null) {
            console.error(error);
            removeCartId();
            setCart([]);
          } else if (data?.createCart?.data?.id) {
            setCartId(data.createCart.data.id);
          }
        } catch (error) {
          console.error('Failed to create or guest user cart', error);
        }
      } else {
        try {
          const { data, error }: GetCartResponseType =
            await fetchGraphqlClient(getCartQuery(Number(cartId)));

          if (error || !data) {
            console.error(error);
          } else {
            if (data?.cart?.data?.attributes?.product_details) {
              const updatedCartData = aggregateCartItems(
                data.cart.data.attributes.product_details
              );
              setCart(updatedCartData);
              setTotalCartCost(
                data.cart.data.attributes.total_cart_cost
              );
            }
          }
        } catch (error) {
          console.error('Failed to fetch cart', error);
        }
      }
    };

    const handleGuestUser = async () => {
      try {
        const { data: guestUserData, error: guestUserError } =
          (await fetchGraphqlClient(
            getCreateGuestUserQuery()
          )) as CreateGuestUserResponseType;

        if (
          guestUserError ||
          !guestUserData?.createGuestUser?.data?.id
        ) {
          console.error('Failed to create guest user');
        }

        if (guestUserData?.createGuestUser.data?.id) {
          setCookie(
            'guestUserId',
            guestUserData?.createGuestUser.data?.id
          );
        } else {
          console.error('Failed to get guest user ID from API');
        }
      } catch (e) {
        console.error('Failed to create guest user', e);
      }
    };

    const handleShippingAddress = async () => {
      try {
        const {
          data: shippingAddressData,
          error: shippingAddressError
        } = (await fetchGraphqlClient(
          getCreateShippingAddressQuery()
        )) as CreateAddressResponseType;

        if (
          shippingAddressError ||
          !shippingAddressData?.createAddress?.data?.id
        ) {
          console.error('Failed to create guest user');
        }

        if (shippingAddressData?.createAddress?.data?.id) {
          setCookie(
            'shippingAddressId',
            shippingAddressData?.createAddress?.data?.id
          );
        } else {
          console.error('Failed to get shipping address ID from API');
        }
      } catch (e) {
        console.error('Failed to create address', e);
      }
    };

    handleCart();

    const guestUserIdExists = doesCookieByNameExist('guestUserId');
    if (!guestUserIdExists) {
      handleGuestUser();
    }

    const shippingAddressIdExists = doesCookieByNameExist(
      'shippingAddressId'
    );
    if (!shippingAddressIdExists) {
      handleShippingAddress();
    }
  }, []);

  return (
    <header
      className={`header fixed left-1/2 top-0 z-[100] flex h-[48px] w-full max-w-[1900px] -translate-x-1/2 items-center bg-transparent md:h-[64px] ${pathname === '/' ? 'bg-transparent' : 'colored-navbar'} ${linkHovered ? 'colored-navbar' : 'bg-transparent'}`}
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

        <div className='hidden items-center 2xl:flex'>
          <Link
            href='/wishlist'
            className='wishlist relative ml-4 text-white'
          >
            <div className='absolute right-0 top-0 z-[200] flex h-4 w-4 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-red-shade-350 bg-opacity-80'>
              <p className='text-[.5rem] leading-[1rem] text-white'>
                1
              </p>
            </div>
            <HiOutlineHeart size={22} className='text-inherit' />
          </Link>

          <Link href='/signin' className='profile ml-5 text-white'>
            <ProfileDropdownMenu />
          </Link>

          <button
            className='shopping-cart relative ml-5'
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
