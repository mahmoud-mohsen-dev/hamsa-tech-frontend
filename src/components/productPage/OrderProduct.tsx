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
import { useTranslations } from 'use-intl';
import { useMyContext } from '@/context/Store';

interface PropsType {
  productId: string;
  maxQuantity: number;
  minQuantity: number;
}

function OrderProduct({
  productId,
  maxQuantity = 100000,
  minQuantity = 1
}: PropsType) {
  const {
    updateCartItemQuantity,
    findProductInCart,
    addToCartIsLoading
  } = useMyContext();
  const [quantity, setQuantity] = useState(minQuantity);
  // const [isAddToCartActive, setIsAddToCartActive] = useState(false);
  const [isWishlistActive, setIsWishlistActive] = useState(false);
  const t = useTranslations('ProductPage');

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
    console.log('Add to Wish Lists clicked');
    setIsWishlistActive(!isWishlistActive);
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
        className={`rounded-md bg-green-dark px-[16px] text-base text-white`}
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
        className={`rounded-md bg-red-shade-350 px-[16px] text-base text-white`}
        onClick={handleAddToWishList}
      >
        {isWishlistActive ?
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
