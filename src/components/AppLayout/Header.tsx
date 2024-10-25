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
import {
  doesCookieByNameExist,
  getCartId,
  getCookie,
  getIdFromToken,
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
import { useUser } from '@/context/UserContext';
import {
  createWishlistLocalizationResponseType,
  GetWishlistDataType,
  WishlistResponseType,
  WishlistsDataType
} from '@/types/wishlistReponseTypes';

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
                    total_cost
                    product {
                        data {
                            id
                            attributes {
                                name
                                price
                                sale_price
                                final_product_price
                                description
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

// const getCreateShippingAddressQuery = () => {
//   return `mutation CreateAddress {
//     createAddress(
//         data: {
//             publishedAt: "${new Date().toISOString()}"
//         }
//     ) {
//         data {
//             id
//         }
//     }
//   }`;
// };

const getCreateWishlistQuery = (
  guestUserId: string | null,
  userId: string | null
) => {
  return `mutation CreateWishlist {
    createWishlist(
        data: { 
          publishedAt: "${new Date().toISOString()}"
          guest_user: ${guestUserId ? `"${guestUserId}"` : null}
          users_permissions_user: ${userId ? `"${userId}"` : null}
        }
    ) {
        data {
            id
        }
    }
  }`;
};

const getCreateWishlistLocalizationQuery = (arId: string) => {
  return `mutation CreateWishlistLocalization {
    createWishlistLocalization(
        id: "${arId}"
        locale: "en"
        data: { 
          publishedAt: "${new Date().toISOString()}"
        }
    ) {
        data {
            id
            attributes {
                locale
                localizations {
                    data {
                        id
                        attributes {
                            locale
                        }
                    }
                }
            }
        }
    }
  }`;
};

const getWishlistDataQuery = (wishlistId: string) => {
  return `{
    wishlist(id: "${wishlistId}") {
        data {
            id
            attributes {
                products {
                    data {
                        id
                        attributes {
                            name
                            price
                            sale_price
                            final_product_price
                            image_thumbnail {
                                data {
                                    attributes {
                                        alternativeText
                                        url
                                    }
                                }
                            }
                            stock
                            locale
                            localizations {
                                data {
                                    id
                                    attributes {
                                        locale
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
  }`;
};

export const getWishlistsData = async (
  locale: string,
  setIsWishlistLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setWishlistsData: React.Dispatch<
    React.SetStateAction<WishlistsDataType>
  >
) => {
  try {
    setIsWishlistLoading(true);
    const wishlistIds = getCookie('wishlistIds');

    let wishlistIdsValue: { en: string; ar: string } | null = null;
    if (wishlistIds) {
      wishlistIdsValue = JSON.parse(wishlistIds);
    }

    let passedArgId: string = '';
    if (wishlistIdsValue) {
      passedArgId =
        locale === 'ar' ? wishlistIdsValue.ar : wishlistIdsValue.en;
    }
    // const wishlitsId = locale === 'ar' ? JSON.parse(wishlistIds)
    const { data: wishlistsData, error: wishlistsError } =
      (await fetchGraphqlClient(
        getWishlistDataQuery(passedArgId)
      )) as GetWishlistDataType;

    if (
      wishlistsError ||
      !wishlistsData?.wishlist?.data?.attributes?.products?.data
    ) {
      console.error(
        'Error fetching wishlists data: ',
        wishlistsError
      );
      return;
    }

    setWishlistsData(
      wishlistsData?.wishlist?.data?.attributes?.products?.data
    );
  } catch (err) {
    console.error('Error fetching wishlist data: ', err);
  } finally {
    setIsWishlistLoading(false);
  }
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
    setTotalCartCost,
    setWishlistsData,
    wishlistsData,
    setIsWishlistLoading
  } = useMyContext();
  const [linkHovered, setLinkHovered] = useState('');
  const { userId } = useUser();

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

    // const handleShippingAddress = async () => {
    //   try {
    //     const {
    //       data: shippingAddressData,
    //       error: shippingAddressError
    //     } = (await fetchGraphqlClient(
    //       getCreateShippingAddressQuery()
    //     )) as CreateAddressResponseType;

    //     if (
    //       shippingAddressError ||
    //       !shippingAddressData?.createAddress?.data?.id
    //     ) {
    //       console.error('Failed to create guest user');
    //     }

    //     if (shippingAddressData?.createAddress?.data?.id) {
    //       setCookie(
    //         'shippingAddressId',
    //         shippingAddressData?.createAddress?.data?.id
    //       );
    //     } else {
    //       console.error('Failed to get shipping address ID from API');
    //     }
    //   } catch (e) {
    //     console.error('Failed to create address', e);
    //   }
    // };

    const createWishlistTranslations = async (arId: string) => {
      try {
        const {
          data: wishlistLocalizationData,
          error: wishlistLocalizationError
        } = (await fetchGraphqlClient(
          getCreateWishlistLocalizationQuery(arId)
        )) as createWishlistLocalizationResponseType;

        const localeFirstId =
          wishlistLocalizationData?.createWishlistLocalization?.data
            ?.id ?? null;
        const localeNameFirst =
          wishlistLocalizationData?.createWishlistLocalization?.data
            ?.attributes?.locale ?? null;

        // Check if localizations data is not null
        const localizations =
          wishlistLocalizationData?.createWishlistLocalization?.data
            ?.attributes?.localizations?.data;

        let localeSecondId: string | null = null;
        let localeNameSecond: string | null = null;

        if (localizations && localizations.length > 0) {
          localeSecondId = localizations[0]?.id ?? null;
          localeNameSecond =
            localizations[0]?.attributes?.locale ?? null;
        }

        if (
          wishlistLocalizationError ||
          !localeFirstId ||
          !localeNameFirst ||
          !localeSecondId ||
          !localeNameSecond
        ) {
          console.error(
            'Failed to create wishlist translations',
            wishlistLocalizationError
          );
          return;
        }
        const wishlist = {
          [localeNameFirst]: localeFirstId,
          [localeNameSecond]: localeSecondId
        };
        setCookie('wishlistIds', JSON.stringify(wishlist));
      } catch (err) {
        console.error('Failed to create wishlist translations', err);
      }
    };

    const createWishlist = async (
      guestUserId: string | null,
      userId: string | null
    ) => {
      try {
        const { data: wishlistData, error: wishlistError } =
          (await fetchGraphqlClient(
            getCreateWishlistQuery(guestUserId, userId)
          )) as WishlistResponseType;

        if (
          wishlistError ||
          !wishlistData?.createWishlist?.data?.id
        ) {
          console.error('Failed to create wishlist');
          return;
        }

        // if (wishlistData?.createWishlist?.data?.id) {
        //   setCookie(
        //     'wishlistId',
        //     wishlistData?.createWishlist?.data?.id
        //   );
        // }
        createWishlistTranslations(
          wishlistData?.createWishlist?.data?.id
        );
      } catch (e) {
        console.error('Failed to create wishlist', e);
      }
    };

    const handleRequests = async () => {
      handleCart();

      const guestUserIdExists = doesCookieByNameExist('guestUserId');
      if (!guestUserIdExists) {
        await handleGuestUser();
      }

      // const shippingAddressIdExists = doesCookieByNameExist(
      //   'shippingAddressId'
      // );
      // if (!shippingAddressIdExists) {
      //   await handleShippingAddress();
      // }

      const wishlistIdExists = doesCookieByNameExist('wishlistIds');
      if (!wishlistIdExists) {
        const guestUserId = getCookie('guestUserId');
        const userId = getIdFromToken();
        await createWishlist(guestUserId, userId);
      } else {
        getWishlistsData(
          locale,
          setIsWishlistLoading,
          setWishlistsData
        );
      }
    };

    handleRequests();
  }, []);

  return (
    <header
      className={`header fixed left-0 top-0 z-[100] flex h-[48px] w-full max-w-[100vw] items-center bg-transparent md:h-[64px] 2xl:left-1/2 2xl:max-w-[1900px] 2xl:-translate-x-1/2 ${pathname === '/' ? 'bg-transparent' : 'colored-navbar'} ${linkHovered ? 'colored-navbar' : 'bg-transparent'}`}
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
          <Link
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

          <Link
            href={userId ? '/account/settings' : '/signin'}
            className='profile ml-3 hidden text-white 2xl:ml-5 2xl:block'
          >
            <ProfileDropdownMenu />
          </Link>

          <button
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

          <div className='ml-5 hidden h-[22px] w-[1px] rounded-sm bg-[#eaeaea] 2xl:block'></div>
          <ModalSearchInput />
          <SelectLanguage defaultValue={defaultValue} />

          {/* <div className='flex h-full items-center justify-center text-inherit 2xl:hidden'> */}
          <HamburgerMenuIcon
            navLinks={navLinks}
            productsSubNav={productsSubNav}
          />

          {/* </div> */}
        </div>
      </div>
    </header>
  );
}

export default Header;
