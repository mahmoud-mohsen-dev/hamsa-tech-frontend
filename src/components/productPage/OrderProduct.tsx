'use client';
import { InputNumber, InputNumberProps } from 'antd';
import Btn from '../UI/Btn';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { HiHeart, HiOutlineHeart } from 'react-icons/hi';

function OrderProduct({ maxQuantity = 100000 }) {
  const [quantity, setQuantity] = useState(1);
  const [isWishlistActive, setIsWishlistActive] = useState(false);
  const onChange: InputNumberProps['onChange'] = (value) => {
    console.log('changed', value);
    if (typeof value === 'number') {
      setQuantity(value);
    }
  };
  const handleAddToCart = () => {
    console.log('Add to cart clicked');
  };
  const handleAddToWishList = () => {
    console.log('Add to Wish Lists clicked');
    setIsWishlistActive(!isWishlistActive);
  };

  return (
    <div className='mt-4 flex flex-wrap items-center gap-3'>
      <InputNumber
        size='large'
        min={1}
        max={maxQuantity}
        defaultValue={quantity}
        value={quantity}
        onChange={onChange}
        style={{ borderRadius: '6px' }}
      />
      <Btn
        className='rounded-md bg-green-600 px-[30px] text-base text-white'
        onClick={handleAddToCart}
      >
        <ShoppingCartOutlined className='text-xl' />
        <span>Add to cart</span>
      </Btn>
      <Btn
        className={`rounded-md px-[30px] text-base text-white ${isWishlistActive ? 'bg-blue-accent' : 'bg-red-shade-350'}`}
        onClick={handleAddToWishList}
      >
        {isWishlistActive ?
          <>
            <HiHeart size={20} />
            <span>Added to wishlist</span>
          </>
        : <>
            <HiOutlineHeart size={20} />
            <span>Add to wishlist</span>
          </>
        }
      </Btn>
    </div>
  );
}

export default OrderProduct;
