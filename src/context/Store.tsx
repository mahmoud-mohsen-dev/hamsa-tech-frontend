// app/MyContext.js
'use client'; // Make this a client component

// import { WishlistTableDataType } from '@/components/wishlist/WishlistTable';
import { fetchGraphqlClient } from '@/services/graphqlCrud';
import {
  CartDataType,
  updateCartResponseType
} from '@/types/cartResponseTypes';
import { FreeShippingAttributesType } from '@/types/freeShippingResponseType';
import { CouponDataType } from '@/types/getCouponResponseType';
import {
  ProductsResponseDataType,
  ProductType
} from '@/types/getProducts';
import { ShippingCostDataType } from '@/types/shippingCostResponseTypes';
import {
  WishlistDataType,
  WishlistsDataType
} from '@/types/wishlistReponseTypes';
import {
  aggregateCartItems,
  updateCartInTheBackend
} from '@/utils/cartContextUtils';
import { getCartId } from '@/utils/cookieUtils';
import { MultiSearchResponse } from 'meilisearch';
import { createContext, useContext, useState } from 'react';

const MyContext = createContext<{
  productsData: [] | ProductType[];
  setProductsData: React.Dispatch<
    React.SetStateAction<[] | ProductType[]>
  >;
  enProductId: string;
  setEnProductId: React.Dispatch<React.SetStateAction<string>>;
  arProductId: string;
  setArProductId: React.Dispatch<React.SetStateAction<string>>;
  openDrawer: boolean;
  setOpenDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  drawerIsLoading: boolean;
  setDrawerIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  cart: CartDataType[];
  findProductInCart: (productId: string) => CartDataType | undefined;
  setCart: React.Dispatch<React.SetStateAction<CartDataType[]>>;
  incrementCartItem: (
    productId: string,
    setComponentLoader?: React.Dispatch<React.SetStateAction<boolean>>
  ) => Promise<void>;
  decrementCartItem: (
    productId: string,
    setComponentLoader?: React.Dispatch<React.SetStateAction<boolean>>
  ) => Promise<void>;
  updateCartItemQuantity: (
    productId: string,
    quantity: number,
    setComponentLoader?: React.Dispatch<React.SetStateAction<boolean>>
  ) => Promise<void>;
  setTotalCartCost: React.Dispatch<React.SetStateAction<number>>;
  calculateSubTotalCartCost: () => number;
  calculateTotalCartItems: () => number;
  addToCartIsLoading: string;
  setAddToCartIsLoading: React.Dispatch<React.SetStateAction<string>>;
  governoratesData: ShippingCostDataType[];
  updateGovernoratesData: (
    newShippingCostData: ShippingCostDataType[]
  ) => void;
  selectedGovernorate: ShippingCostDataType | null;
  setSelectedGovernorate: React.Dispatch<
    React.SetStateAction<ShippingCostDataType | null>
  >;
  freeShippingAt: null | FreeShippingAttributesType;
  setFreeShippingAt: React.Dispatch<
    React.SetStateAction<null | FreeShippingAttributesType>
  >;
  couponData: CouponDataType | null;
  setCouponData: React.Dispatch<
    React.SetStateAction<CouponDataType | null>
  >;
  calculateDeliveryCost: () => number | null;
  isApplyFreeShippingEnabled: () => boolean;
  calculateNetDeliveryCost: () => number;
  calculateCouponDeductionValue: (
    deductionValue?: number | null,
    deductionValueByPercent?: number | null
  ) => number;
  calculateTotalOrderCost: () => number;
  wishlistsData: WishlistsDataType;
  setWishlistsData: React.Dispatch<
    React.SetStateAction<WishlistsDataType>
  >;
  findProductInWishlist: (
    productId: string
  ) => WishlistDataType | undefined;
  isWishlistLoading: boolean;
  setIsWishlistLoading: React.Dispatch<React.SetStateAction<boolean>>;
  completeProductsApiData: ProductsResponseDataType;
  setCompleteProductsApiData: React.Dispatch<
    React.SetStateAction<ProductsResponseDataType>
  >;
  globaLoading: boolean;
  setGlobalLoading: React.Dispatch<React.SetStateAction<boolean>>;
  toggleFilters: boolean;
  setToggleFilters: React.Dispatch<React.SetStateAction<boolean>>;
  loadingMessage: boolean;
  setLoadingMessage: React.Dispatch<React.SetStateAction<boolean>>;
  errorMessage: string | null;
  setErrorMessage: React.Dispatch<
    React.SetStateAction<string | null>
  >;
  successMessage: string | null;
  setSuccessMessage: React.Dispatch<
    React.SetStateAction<string | null>
  >;
  searchData: MultiSearchResponse<Record<string, any>> | null;
  setSearchData: React.Dispatch<
    React.SetStateAction<MultiSearchResponse<
      Record<string, any>
    > | null>
  >;
  searchTerm: string | null;
  setSearchTerm: React.Dispatch<React.SetStateAction<string | null>>;
  isSearchbarLoading: boolean;
  setIsSearchbarLoading: React.Dispatch<
    React.SetStateAction<boolean>
  >;
} | null>(null);

export const StoreContextProvider = ({
  children,
  initialProductsData
}: {
  children: React.ReactNode;
  initialProductsData: ProductType[];
}) => {
  const [productsData, setProductsData] = useState<
    [] | ProductType[]
  >(initialProductsData);
  const [completeProductsApiData, setCompleteProductsApiData] =
    useState<ProductsResponseDataType | null>(null);
  const [enProductId, setEnProductId] = useState('not-found');
  const [arProductId, setArProductId] = useState('not-found');
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [drawerIsLoading, setDrawerIsLoading] =
    useState<boolean>(false);
  const [cart, setCart] = useState<CartDataType[]>([]);
  const [totalCartCost, setTotalCartCost] = useState(0);
  const [addToCartIsLoading, setAddToCartIsLoading] =
    useState<string>('');
  const [governoratesData, setGovernoratesData] = useState<
    ShippingCostDataType[]
  >([]);
  const [selectedGovernorate, setSelectedGovernorate] =
    useState<ShippingCostDataType | null>(null);
  const [freeShippingAt, setFreeShippingAt] =
    useState<null | FreeShippingAttributesType>(null);
  const [couponData, setCouponData] = useState<CouponDataType | null>(
    null
  );
  const [wishlistsData, setWishlistsData] =
    useState<WishlistsDataType>([]);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [globaLoading, setGlobalLoading] = useState(false);
  const [toggleFilters, setToggleFilters] = useState(false);

  const [loadingMessage, setLoadingMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    null
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(
    null
  );
  const [searchData, setSearchData] = useState<MultiSearchResponse<
    Record<string, any>
  > | null>(null);
  const [searchTerm, setSearchTerm] = useState<null | string>(null);
  const [isSearchbarLoading, setIsSearchbarLoading] = useState(false);

  // Utility to find product in the cart
  const findProductInCart = (productId: string) =>
    cart.find((item) =>
      item?.product?.data?.id ?
        item.product.data.id === productId
      : null
    );

  // Function to update the cart in the backend and set the new cart data
  const updateCartContextFromBackend = async (
    productId: string,
    quantity: number,
    setComponentLoader: React.Dispatch<
      React.SetStateAction<boolean>
    > | null = null
  ) => {
    const cartId = getCartId() || ''; // Assuming you have a function to get the cartId

    try {
      if (!!setComponentLoader) {
        console.log('setComponentLoader');
        console.log(!!setComponentLoader);
        setComponentLoader(true);
      }
      setAddToCartIsLoading(productId);
      setDrawerIsLoading(true);
      const { data, error } = (await fetchGraphqlClient(
        updateCartInTheBackend(
          cartId,
          cart,
          productId,
          quantity,
          productsData
        )
      )) as updateCartResponseType;

      if (data && !error) {
        const updatedCartItems = data?.updateCart?.data?.attributes;
        if (updatedCartItems) {
          const updatedCartData = aggregateCartItems(
            updatedCartItems.product_details
          );
          console.log(updatedCartData);
          setCart(updatedCartData); // Update cart context with the response data
          setTotalCartCost(updatedCartItems?.total_cart_cost ?? 0);
          setOpenDrawer(true);
        }
      } else {
        console.error('Failed to update cart in the backend:', error);
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    } finally {
      setDrawerIsLoading(false);
      if (!!setComponentLoader) {
        setComponentLoader(false);
      }
      setAddToCartIsLoading('');
    }
  };

  // Increment the quantity of a product in the cart
  const incrementCartItem = async (
    productId: string,
    setComponentLoader: React.Dispatch<
      React.SetStateAction<boolean>
    > | null = null
  ) => {
    const product = findProductInCart(productId);
    console.log(!!setComponentLoader);
    if (product) {
      await updateCartContextFromBackend(
        productId,
        product.quantity + 1,
        setComponentLoader
      );
    } else {
      await updateCartContextFromBackend(
        productId,
        1,
        setComponentLoader
      );
    }
  };

  // Decrement the quantity of a product in the cart
  const decrementCartItem = async (
    productId: string,
    setComponentLoader: React.Dispatch<
      React.SetStateAction<boolean>
    > | null = null
  ) => {
    const product = findProductInCart(productId);
    if (product && product.quantity > 1) {
      await updateCartContextFromBackend(
        productId,
        product.quantity - 1,

        setComponentLoader
      );
    } else {
      await updateCartContextFromBackend(
        productId,
        0,
        setComponentLoader
      ); // Remove item if quantity is zero
    }
  };

  // Update the quantity of a product directly via input
  const updateCartItemQuantity = async (
    productId: string,
    quantity: number,
    setComponentLoader: React.Dispatch<
      React.SetStateAction<boolean>
    > | null = null
  ) => {
    if (quantity < 0) return; // Prevent negative values
    await updateCartContextFromBackend(
      productId,
      quantity,
      setComponentLoader
    );
  };

  // Calaulate total product qunatites in cart
  const calculateTotalCartItems = () => {
    return cart.reduce((acc, cur) => {
      return (acc += cur?.quantity);
    }, 0);
  };
  // Calaulate the total product costs in cart
  const calculateSubTotalCartCost = () => {
    return totalCartCost;
  };

  // update shipping cost
  const updateGovernoratesData = (
    newShippingCost: ShippingCostDataType[]
  ) => {
    if (newShippingCost.length > 0) {
      setGovernoratesData(newShippingCost);
    }
  };

  const calculateDeliveryCost = () => {
    return selectedGovernorate?.attributes?.delivery_cost ?
        selectedGovernorate?.attributes?.delivery_cost
      : null;
  };

  const isApplyFreeShippingEnabled = () => {
    let applyFreeShipping = false;
    if (
      freeShippingAt?.apply_free_shipping_if_total_cart_cost_equals &&
      freeShippingAt.enable
    ) {
      const subTotalCost = calculateSubTotalCartCost();
      applyFreeShipping =
        subTotalCost > 0 &&
        subTotalCost >
          freeShippingAt?.apply_free_shipping_if_total_cart_cost_equals;
    }
    return applyFreeShipping;
  };

  const calculateNetDeliveryCost = () => {
    return isApplyFreeShippingEnabled() ? 0 : (
        (calculateDeliveryCost() ?? 0)
      );
  };

  const calculateCouponDeductionValue = (
    deductionValue: number | null = null,
    deductionValueByPercent: number | null = null
  ) => {
    const subTotalCost = calculateSubTotalCartCost();
    let couponDeductionValue = 0;

    if (deductionValue || deductionValueByPercent) {
      if (deductionValue) {
        couponDeductionValue = deductionValue;
      }
      if (deductionValueByPercent) {
        couponDeductionValue = subTotalCost / deductionValueByPercent;
      }
    } else {
      if (couponData?.attributes?.deduction_value) {
        couponDeductionValue =
          couponData?.attributes?.deduction_value;
      }
      if (couponData?.attributes?.deduction_value_by_percent) {
        couponDeductionValue =
          subTotalCost /
          couponData?.attributes?.deduction_value_by_percent;
      }
    }

    return couponDeductionValue;
  };

  const calculateTotalOrderCost = () => {
    return (
      calculateSubTotalCartCost() -
      calculateCouponDeductionValue() +
      calculateNetDeliveryCost()
    );
  };

  // Utility to find product in the wishlist
  const findProductInWishlist = (productId: string) => {
    return wishlistsData.find((item) =>
      item?.id ? item.id === productId : null
    );
  };

  return (
    <MyContext.Provider
      value={{
        productsData,
        setProductsData,
        enProductId,
        setEnProductId,
        arProductId,
        setArProductId,
        openDrawer,
        setOpenDrawer,
        drawerIsLoading,
        setDrawerIsLoading,
        cart,
        setCart,
        findProductInCart,
        incrementCartItem,
        decrementCartItem,
        updateCartItemQuantity,
        setTotalCartCost,
        calculateSubTotalCartCost,
        calculateTotalCartItems,
        addToCartIsLoading,
        setAddToCartIsLoading,
        governoratesData,
        updateGovernoratesData,
        selectedGovernorate,
        setSelectedGovernorate,
        freeShippingAt,
        setFreeShippingAt,
        couponData,
        setCouponData,
        calculateDeliveryCost,
        isApplyFreeShippingEnabled,
        calculateNetDeliveryCost,
        calculateCouponDeductionValue,
        calculateTotalOrderCost,
        wishlistsData,
        setWishlistsData,
        findProductInWishlist,
        isWishlistLoading,
        setIsWishlistLoading,
        completeProductsApiData,
        setCompleteProductsApiData,
        globaLoading,
        setGlobalLoading,
        toggleFilters,
        setToggleFilters,
        loadingMessage,
        setLoadingMessage,
        errorMessage,
        setErrorMessage,
        successMessage,
        setSuccessMessage,
        searchData,
        setSearchData,
        searchTerm,
        setSearchTerm,
        isSearchbarLoading,
        setIsSearchbarLoading
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => {
  const context = useContext(MyContext);

  if (!context) {
    throw new Error('useMyContext must be used within a MyProvider');
  }

  return context;
};
