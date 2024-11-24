import { useMyContext } from '@/context/Store';
import { useState } from 'react';
import InputChangeQuantity from '../UI/cart/InputChangeQuantity';

function AddToCartQuantityChanger({
  //   productId,
  isLoading = false,
  //   setIsLoading,
  maxValue,
  minValue,
  inputQuantity,
  setInputQuantity
}: {
  //   productId: string;
  inputQuantity: number;
  setInputQuantity: React.Dispatch<React.SetStateAction<number>>;
  isLoading: boolean;
  //   setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  minValue: number;
  maxValue: number;
}) {
  //   const {
  //     // incrementCartItem,
  //     // decrementCartItem,
  //     // updateCartItemQuantity,
  //     // cart,
  //     // drawerIsLoading
  //   } = useMyContext();

  const handleIncrement = () => {
    // incrementCartItem(productId, setIsDataLoading);
    setInputQuantity((prevState) => {
      const newState = prevState + 1;
      if (newState > maxValue) {
        return prevState;
      }
      return newState;
    });
  };

  const handleDecrement = () => {
    // decrementCartItem(productId, setIsDataLoading);
    setInputQuantity((prevState) => {
      const newState = prevState - 1;
      if (newState < minValue) {
        return prevState;
      }
      return newState;
    });
  };

  //   const product = cart.find(
  //     (item) => item.product.data.id === productId
  //   );
  //   const quantity = product?.quantity || minValue || 0;
  //   console.log('quantity', quantity);
  //   const [inputQuantity, setInputQuantity] = useState(quantity);
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
    console.log(newQuantity);
    // updateCartItemQuantity(productId, newQuantity, setIsDataLoading);
  };

  return (
    <InputChangeQuantity
      handleDecrement={handleDecrement}
      isLoading={isLoading}
      inputQuantity={inputQuantity}
      minValue={minValue}
      maxValue={maxValue}
      handleChange={handleChange}
      handleIncrement={handleIncrement}
      handleBlur={handleBlur}
    />
  );
}

export default AddToCartQuantityChanger;
