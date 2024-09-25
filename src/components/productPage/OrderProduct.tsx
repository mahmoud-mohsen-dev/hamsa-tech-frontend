'use client';
import { InputNumber, InputNumberProps } from 'antd';
import Btn from '../UI/Btn';
import { useState } from 'react';
import {
  HiHeart,
  HiOutlineHeart,
  HiOutlineShoppingCart,
  HiShoppingCart
} from 'react-icons/hi';
import { useTranslations } from 'use-intl';

function OrderProduct({ maxQuantity = 100000, minQuantity = 1 }) {
  const [quantity, setQuantity] = useState(minQuantity);
  const [isAddToCartActive, setIsAddToCartActive] = useState(false);
  const [isWishlistActive, setIsWishlistActive] = useState(false);
  const t = useTranslations('ProductPage');
  const onChange: InputNumberProps['onChange'] = (value) => {
    console.log('changed', value);
    if (typeof value === 'number') {
      setQuantity(value);
    }
  };
  const handleAddToCart = () => {
    console.log('Add to cart clicked');
    setIsAddToCartActive(!isAddToCartActive);
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
        className={`rounded-md px-[16px] text-base text-white ${isAddToCartActive ? 'bg-green-700' : 'bg-green-600'}`}
        onClick={handleAddToCart}
        disabled={quantity === 0}
      >
        {isAddToCartActive ?
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
        className={`rounded-md px-[16px] text-base text-white ${isWishlistActive ? 'bg-red-shade-400' : 'bg-red-shade-350'}`}
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
