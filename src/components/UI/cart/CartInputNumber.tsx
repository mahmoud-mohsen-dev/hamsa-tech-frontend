import { useMyContext } from '@/context/Store';
import { useState } from 'react';
import InputChangeQuantity from './InputChangeQuantity';

function CartInputNumber({
  productId,
  setIsDataLoading,
  maxValue,
  minValue
}: {
  productId: string;
  setIsDataLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  minValue: number;
  maxValue: number;
}) {
  const {
    incrementCartItem,
    decrementCartItem,
    updateCartItemQuantity,
    cart,
    drawerIsLoading
  } = useMyContext();

  const handleIncrement = () => {
    incrementCartItem(productId, setIsDataLoading);
  };

  const handleDecrement = () => {
    decrementCartItem(productId, setIsDataLoading);
  };

  const product = cart.find(
    (item) => item.product.data.id === productId
  );
  const quantity = product?.quantity || minValue || 0;
  // console.log('quantity', quantity);
  const [inputQuantity, setInputQuantity] = useState(quantity);
  // console.log(inputQuantity);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputQuantity((prevState) => {
      if (Number(e.target.value) > maxValue) {
        return prevState;
      }
      return Number(e.target.value);
    });
  };
  const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = Number(e.target.value);
    updateCartItemQuantity(productId, newQuantity, setIsDataLoading);
  };

  return (
    <InputChangeQuantity
      handleDecrement={handleDecrement}
      isLoading={drawerIsLoading}
      inputQuantity={inputQuantity}
      minValue={minValue}
      maxValue={maxValue}
      handleChange={handleChange}
      handleIncrement={handleIncrement}
      handleBlur={handleBlur}
    />
  );
}

export default CartInputNumber;
