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
  getCartId,
  removeCartId,
  setCartId
} from '@/utils/cookieUtils';
import { fetchGraphqlClient } from '@/services/graphqlCrud';
import {
  CartDataType,
  CreateCartResponseType,
  GetCartResponseType
} from '@/types/cartResponseTypes';
import { useMyContext } from '@/context/Store';
import { aggregateCartItems } from '@/utils/cartContextUtils';

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
                product_details {
                    id
                    quantity
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

const countCartItems = (cart: CartDataType[]) => {
  if (cart.length > 0) {
    return cart.reduce((acc, cur) => {
      return (acc += cur.quantity);
    }, 0);
  }
  return 0;
};

function Header({ navLinks, productsSubNav }: PropsType) {
  const { cart, setCart, setOpenDrawer, setDrawerIsLoading } =
    useMyContext();
  const [linkHovered, setLinkHovered] = useState('');

  const locale = useLocale();
  const defaultValue = locale;

  const pathname = usePathname();
  const t = useTranslations('HomePage.Header');

  // const [linkHovered,] = useState('');
  useScrollHandler();

  useEffect(() => {
    // const isCartIdExist = doesCartIdExist();
    const cartId = getCartId();
    if (!cartId) {
      // const cartId = setCartId(v4());
      // createCart(cartId);
      fetchGraphqlClient(createCartQuery())
        .then(({ data, error }: CreateCartResponseType) => {
          console.log('Successfully created cart');
          console.log(data);
          if (error || data === null) {
            console.error(error);
            removeCartId();
            setCart([]);
            // removeLocalStorageCart();
          }
          if (data?.createCart?.data?.id) {
            setCartId(data.createCart.data.id);
            // setLocalStorageCart();
          }
        })
        .catch((error) => {
          console.error('Failed to create cart');
          console.error(error);
          // removeCartId();
          // removeLocalStorageCart();
        });
    } else {
      fetchGraphqlClient(getCartQuery(Number(cartId)))
        .then(({ data, error }: GetCartResponseType) => {
          if (error || data === null) {
            console.error(error);
          } else {
            console.log('Successfully fetched cart');
            console.log(data);
            if (data?.cart?.data?.attributes?.product_details) {
              const updatedCartData = aggregateCartItems(
                data.cart.data.attributes.product_details
              );
              setCart(updatedCartData);
            }
          }
        })
        .catch((error) => {
          console.error('Failed to fetch cart');
          console.error(error);
        });
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
          <Link href='/login' className='profile ml-5 text-white'>
            <UserOutlined className='text-[20px] text-inherit' />
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
