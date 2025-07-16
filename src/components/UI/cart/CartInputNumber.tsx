import { useMyContext } from '@/context/Store';
import { useState } from 'react';
import InputChangeQuantity from './InputChangeQuantity';
import { ProductInfoType } from '@/utils/cartContextUtils';

function CartInputNumber({
  productInfo,
  setIsDataLoading,
  maxValue,
  minValue
}: {
  productInfo: ProductInfoType;
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
    incrementCartItem({
      productInfo,
      setComponentLoader: setIsDataLoading
    });
  };

  const handleDecrement = () => {
    decrementCartItem({
      productInfo,
      setComponentLoader: setIsDataLoading
    });
  };

  const product = cart.find(
    (item) =>
      typeof productInfo?.id === 'string' &&
      item.product.data.id === productInfo.id
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
    updateCartItemQuantity({
      productInfo,
      quantity: newQuantity,
      setComponentLoader: setIsDataLoading
    });
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
