import { useMyContext } from '@/context/Store';
import { useState } from 'react';

function CartInputNumber({ productId }: { productId: string }) {
  const { incrementCartItem, decrementCartItem, cart } =
    useMyContext();
  const handleIncrement = () => {
    incrementCartItem(productId);
  };

  const handleDecrement = () => {
    decrementCartItem(productId);
  };

  const product = cart.find(
    (item) => item.product.data.id === productId
  );
  const quantity = product ? product.quantity : 0;

  //   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const newQuantity = Number(e.target.value);
  //     if (newQuantity >= 0) {
  //       setQuantity(newQuantity);
  //       onQuantityChange(newQuantity);
  //     }
  //   };

  return (
    <div className='inline-block rounded-lg border border-gray-200 bg-white px-3 py-2 text-black-medium'>
      <div className='flex items-center gap-x-1.5'>
        <button
          type='button'
          onClick={handleDecrement}
          className='inline-flex size-6 items-center justify-center gap-x-2 rounded-md border border-gray-200 bg-white text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 focus:bg-gray-50 focus:outline-none disabled:pointer-events-none disabled:opacity-50'
          aria-label='Decrease'
        >
          <svg
            className='size-3.5 shrink-0'
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M5 12h14'></path>
          </svg>
        </button>
        <input
          className='no-arrows w-8 border-0 bg-transparent p-0 text-center text-gray-800 focus:ring-0'
          style={{ MozAppearance: 'textfield' }}
          type='number'
          value={quantity}
          readOnly
          //   onChange={handleChange}
        />
        <button
          type='button'
          onClick={handleIncrement}
          className='iinline-flex size-6 items-center justify-center gap-x-2 rounded-md border border-gray-200 bg-white text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 focus:bg-gray-50 focus:outline-none disabled:pointer-events-none disabled:opacity-50'
          aria-label='Increase'
        >
          <svg
            className='size-3.5 shrink-0'
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M5 12h14'></path>
            <path d='M12 5v14'></path>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default CartInputNumber;
