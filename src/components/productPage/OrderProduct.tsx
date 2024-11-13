'use client';
import { InputNumber, InputNumberProps, Spin } from 'antd';
import Btn from '../UI/Btn';
import { useState } from 'react';
import {
  HiHeart,
  HiOutlineHeart,
  HiOutlineShoppingCart,
  HiShoppingCart
} from 'react-icons/hi';
import { useLocale, useTranslations } from 'use-intl';
import { useMyContext } from '@/context/Store';
import { getCookie } from '@/utils/cookieUtils';
import {
  UpdateWishlistDataType,
  WishlistsDataType
} from '@/types/wishlistReponseTypes';
import { fetchGraphqlClient } from '@/services/graphqlCrud';

interface PropsType {
  productId: string;
  maxQuantity: number;
  minQuantity: number;
  localeParentName: string;
  localeChildName: string;
  localeChildId: string;
}

interface UpdateWishlistProps {
  newAddedProductId: string;
  allWishlistData: WishlistsDataType;
  currentLocaleName?: 'en' | 'ar';
  nextLocaleName?: 'en' | 'ar';
  setWishlistsData?: React.Dispatch<
    React.SetStateAction<WishlistsDataType>
  >;
}

const getUpdateWishlistParentQuery = ({
  newAddedProductId,
  allWishlistData,
  currentLocaleName
}: UpdateWishlistProps) => {
  const getWishlistId = getCookie('wishlistIds');
  const wishlistId = getWishlistId ? JSON.parse(getWishlistId) : null;

  const newProducts = allWishlistData.map((product) => product.id);

  const foundIndex = newProducts.findIndex(
    (id) => id === newAddedProductId
  );

  if (foundIndex === -1) {
    newProducts.push(newAddedProductId);
  } else {
    newProducts.splice(foundIndex, 1);
  }
  console.log('new Products parent');
  console.log(newProducts);

  return `mutation UpdateWishlist {
    updateWishlist(id: ${wishlistId[currentLocaleName ?? ''] ? `"${wishlistId[currentLocaleName ?? '']}"` : null} , data: { products: ${newProducts.length > 0 ? `[${newProducts}]` : null}}) {
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
                            image_thumbnail {
                                data {
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
                                    attributes {
                                        locale
                                    }
                                }
                            }
                            locale
                        }
                    }
                }
            }
        }
    }
  }`;
};

const getUpdateWishlistChildQuery = ({
  newAddedProductId,
  allWishlistData,
  nextLocaleName
}: UpdateWishlistProps) => {
  const getWishlistId = getCookie('wishlistIds');
  const wishlistId = getWishlistId ? JSON.parse(getWishlistId) : null;

  const newProducts = allWishlistData.map(
    (product) => product?.attributes?.localizations?.data[0]?.id
  );

  const foundIndex = newProducts.findIndex(
    (id) => id === newAddedProductId
  );

  if (foundIndex === -1) {
    newProducts.push(newAddedProductId);
  } else {
    newProducts.splice(foundIndex, 1);
  }
  console.log('new Products child');
  console.log(newProducts);

  return `mutation UpdateWishlist {
    updateWishlist(id: ${wishlistId[nextLocaleName ?? ''] ? `"${wishlistId[nextLocaleName ?? '']}"` : null}, data: { products: ${newProducts.length > 0 ? `[${newProducts}]` : null}}) {
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
                            image_thumbnail {
                                data {
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
                                    attributes {
                                        locale
                                    }
                                }
                            }
                            locale
                        }
                    }
                }
            }
        }
    }
  }`;
};

const updateWishlistParentData = async ({
  setWishlistsData,
  newAddedProductId,
  allWishlistData,
  currentLocaleName
}: UpdateWishlistProps) => {
  try {
    const { data, error } = (await fetchGraphqlClient(
      getUpdateWishlistParentQuery({
        newAddedProductId,
        allWishlistData,
        currentLocaleName
      })
    )) as UpdateWishlistDataType;

    if (
      error ||
      !data?.updateWishlist?.data?.attributes?.products?.data
    ) {
      console.error('Error updating wishlist data:', error);
      return [];
    }

    if (setWishlistsData) {
      setWishlistsData(
        data?.updateWishlist?.data?.attributes?.products?.data
      );
    }
    return data?.updateWishlist?.data?.attributes?.products?.data;
  } catch (err) {
    console.error('Error updating wishlist data:', err);
    return [];
  }
};

const updateWishlistChildData = async ({
  newAddedProductId,
  allWishlistData,
  nextLocaleName
}: UpdateWishlistProps) => {
  try {
    const { data, error } = (await fetchGraphqlClient(
      getUpdateWishlistChildQuery({
        newAddedProductId,
        allWishlistData,
        nextLocaleName
      })
    )) as UpdateWishlistDataType;

    if (
      error ||
      !data?.updateWishlist?.data?.attributes?.products?.data
    ) {
      console.error('Error updating wishlist data:', error);
      return;
    }

    // if (setWishlistsData) {
    //   setWishlistsData(
    //     data?.updateWishlist?.data?.attributes?.products?.data
    //   );
    // }

    return data?.updateWishlist?.data?.attributes?.products?.data;
  } catch (err) {
    console.error('Error updating wishlist data:', err);
    return [];
  }
};

export const updateWishtlistHandler = ({
  locale,
  setIsWishlistLoading,
  productIds,
  setWishlistsData,
  wishlistsData
}: {
  locale: string;
  setIsWishlistLoading: React.Dispatch<React.SetStateAction<boolean>>;
  productIds: {
    [x: string]: string;
  };
  wishlistsData: WishlistsDataType;
  setWishlistsData: React.Dispatch<
    React.SetStateAction<WishlistsDataType>
  >;
}) => {
  if (locale === 'ar') {
    setIsWishlistLoading(true);
    updateWishlistParentData({
      setWishlistsData,
      allWishlistData: wishlistsData,
      newAddedProductId: productIds['ar'],
      currentLocaleName: 'ar'
    })
      .then(() => {
        updateWishlistChildData({
          allWishlistData: wishlistsData,
          newAddedProductId: productIds['en'],
          nextLocaleName: 'en'
        });
      })
      .finally(() => {
        setIsWishlistLoading(false);
      });
  } else {
    setIsWishlistLoading(true);
    updateWishlistParentData({
      setWishlistsData,
      allWishlistData: wishlistsData,
      newAddedProductId: productIds['en'],
      currentLocaleName: 'en'
    })
      .then(() => {
        updateWishlistChildData({
          allWishlistData: wishlistsData,
          newAddedProductId: productIds['ar'],
          nextLocaleName: 'ar'
        });
      })
      .finally(() => {
        setIsWishlistLoading(false);
      });
  }
};

function OrderProduct({
  productId,
  localeParentName,
  localeChildName,
  localeChildId,
  maxQuantity = 100000,
  minQuantity = 1
}: PropsType) {
  const {
    updateCartItemQuantity,
    findProductInCart,
    addToCartIsLoading,
    wishlistsData,
    setWishlistsData,
    findProductInWishlist,
    isWishlistLoading,
    setIsWishlistLoading
  } = useMyContext();
  const [quantity, setQuantity] = useState(minQuantity);

  // const [isAddToCartActive, setIsAddToCartActive] = useState(false);
  // const [isWishlistActive, setIsWishlistActive] = useState(false);

  const t = useTranslations('ProductPage');
  const locale = useLocale();

  const isAddedToWishlistActive = findProductInWishlist(productId);
  const isAddedToCartActive = findProductInCart(productId);
  const isLoading = addToCartIsLoading === productId;

  const onChange: InputNumberProps['onChange'] = (value) => {
    console.log('changed', value);
    if (typeof value === 'number') {
      setQuantity(value);
    }
  };
  const handleAddToCart = () => {
    console.log('Add to cart clicked');
    // setIsAddToCartActive(!isAddToCartActive);
    updateCartItemQuantity(
      productId,
      isAddedToCartActive ? 0 : quantity
    );
  };

  const handleAddToWishList = () => {
    const productIds = {
      [localeParentName]: productId,
      [localeChildName]: localeChildId
    };
    console.log(productIds);
    updateWishtlistHandler({
      locale,
      productIds,
      setIsWishlistLoading,
      setWishlistsData,
      wishlistsData
    });

    console.log('Add to Wish Lists clicked');
    // setIsWishlistActive(!isWishlistActive);
  };

  return (
    <div className='mt-4 flex flex-wrap items-center gap-2.5'>
      <InputNumber
        size='large'
        min={0}
        max={maxQuantity}
        defaultValue={quantity}
        value={quantity}
        onChange={onChange}
        style={{ borderRadius: '6px' }}
      />
      <Btn
        className={`w-full rounded-md bg-green-dark px-[16px] text-base text-white md:w-fit`}
        onClick={handleAddToCart}
        disabled={quantity === 0}
      >
        {isLoading ?
          <Spin
            className='white'
            style={{ marginInline: '40px', marginBlock: '2px' }}
          />
        : isAddedToCartActive ?
          <>
            <HiShoppingCart className='text-xl' />
            <span>{t('addedToCartButtonText')}</span>
          </>
        : <>
            <HiOutlineShoppingCart className='text-xl' />
            <span>{t('addToCartButtonText')}</span>
          </>
        }
      </Btn>
      <Btn
        className={`w-full rounded-md bg-red-shade-350 px-[16px] text-base text-white md:w-fit`}
        onClick={handleAddToWishList}
      >
        {isWishlistLoading ?
          <Spin
            className='white'
            style={{ marginInline: '40px', marginBlock: '2px' }}
          />
        : isAddedToWishlistActive ?
          <>
            <HiHeart size={20} />
            <span>{t('AddedToWhishListText')}</span>
          </>
        : <>
            <HiOutlineHeart size={20} />
            <span>{t('AddToWhishListText')}</span>
          </>
        }
      </Btn>
    </div>
  );
}

export default OrderProduct;
