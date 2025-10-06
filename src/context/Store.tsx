// app/MyContext.js
'use client'; // Make this a client component

// import { WishlistTableDataType } from '@/components/wishlist/WishlistTable';
import { fetchGraphqlClient } from '@/services/graphqlCrud';
import {
  CartDataType,
  updateCartResponseType
} from '@/types/cartResponseTypes';
import { FreeShippingAttributesType } from '@/types/freeShippingResponseType';
import { CouponByCodeNameDataType } from '@/types/getCouponResponseType';
import {
  ProductsResponseDataType,
  ProductType
} from '@/types/getProducts';
import { ShippingCostsDataType } from '@/types/shippingCostResponseTypes';
import {
  WishlistDataType,
  WishlistsDataType
} from '@/types/wishlistReponseTypes';
import {
  aggregateCartItems,
  ProductInfoType,
  updateCartByClientAndSendItToTheBackend
} from '@/utils/cartContextUtils';
import { getCartIdFromCookie } from '@/utils/cookieUtils';
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
  cartId: string | null;
  setCartId: React.Dispatch<React.SetStateAction<string | null>>;
  cart: CartDataType[];
  findProductInCart: (
    productId: string | null
  ) => CartDataType | null | undefined;
  setCart: React.Dispatch<React.SetStateAction<CartDataType[]>>;
  incrementCartItem: ({
    productInfo,
    setComponentLoader
  }: {
    productInfo: ProductInfoType;
    setComponentLoader?: React.Dispatch<
      React.SetStateAction<boolean>
    > | null;
  }) => Promise<void>;
  decrementCartItem: ({
    productInfo,
    setComponentLoader
  }: {
    productInfo: ProductInfoType;
    setComponentLoader?: React.Dispatch<
      React.SetStateAction<boolean>
    > | null;
  }) => Promise<void>;
  updateCartItemQuantity: ({
    productInfo,
    quantity,
    setComponentLoader
  }: {
    productInfo: ProductInfoType;
    quantity: number;
    setComponentLoader?: React.Dispatch<
      React.SetStateAction<boolean>
    > | null;
  }) => Promise<void>;
  setTotalCartCost: React.Dispatch<React.SetStateAction<number>>;
  calculateSubTotalCartCost: () => number;
  calculateTotalCartItems: () => number;
  addToCartIsLoading: string;
  setAddToCartIsLoading: React.Dispatch<React.SetStateAction<string>>;
  governoratesData: ShippingCostsDataType[];
  updateGovernoratesData: (
    newShippingCostData: ShippingCostsDataType[]
  ) => void;
  selectedGovernorate: ShippingCostsDataType | null;
  setSelectedGovernorate: React.Dispatch<
    React.SetStateAction<ShippingCostsDataType | null>
  >;
  freeShippingAt: null | FreeShippingAttributesType;
  setFreeShippingAt: React.Dispatch<
    React.SetStateAction<null | FreeShippingAttributesType>
  >;
  couponData: CouponByCodeNameDataType | null;
  setCouponData: React.Dispatch<
    React.SetStateAction<CouponByCodeNameDataType | null>
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
    productId: string | null
  ) => WishlistDataType | undefined | null;
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
  isCartCheckoutLoading: boolean;
  setIsCartCheckoutLoading: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  isAddressIsLoading: boolean;
  setIsAddressIsLoading: React.Dispatch<
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
  const [cartId, setCartId] = useState<string | null>(null);
  const [cart, setCart] = useState<CartDataType[]>([]);
  const [totalCartCost, setTotalCartCost] = useState(0);
  const [addToCartIsLoading, setAddToCartIsLoading] =
    useState<string>('');
  const [governoratesData, setGovernoratesData] = useState<
    ShippingCostsDataType[]
  >([]);
  const [selectedGovernorate, setSelectedGovernorate] =
    useState<ShippingCostsDataType | null>(null);
  const [freeShippingAt, setFreeShippingAt] =
    useState<null | FreeShippingAttributesType>(null);
  const [couponData, setCouponData] =
    useState<CouponByCodeNameDataType | null>(null);
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
  const [isCartCheckoutLoading, setIsCartCheckoutLoading] =
    useState(true);
  const [isAddressIsLoading, setIsAddressIsLoading] = useState(true);

  // Utility to find product in the cart
  const findProductInCart = (productId: string | null) => {
    if (productId === null) return null;
    return cart.find((item) =>
      item?.product?.data?.id ?
        item.product.data.id === productId
      : null
    );
  };

  // Function to update the cart in the client and send it's data to the backend
  const updateCartContextByClientAndSendItToTheBackend = async ({
    quantity,
    productInfo,
    setComponentLoader = null
  }: {
    quantity: number;
    productInfo: ProductInfoType;
    setComponentLoader?: React.Dispatch<
      React.SetStateAction<boolean>
    > | null;
  }) => {
    const cartId = getCartIdFromCookie() || ''; // Assuming you have a function to get the cartId
    try {
      if (!!setComponentLoader) {
        setComponentLoader(true);
      }
      setAddToCartIsLoading(productInfo?.id ?? '');
      setDrawerIsLoading(true);
      const { data, error } = (await fetchGraphqlClient(
        updateCartByClientAndSendItToTheBackend({
          cartId,
          cart,
          quantity,
          productInfo
        })
      )) as updateCartResponseType;

      // console.log('dataResponseOfCartFromTheBackend', data);

      if (data && !error) {
        const updatedCartItems = data?.updateCart?.data?.attributes;
        if (updatedCartItems) {
          const updatedCartData = aggregateCartItems(
            updatedCartItems.product_details
          );
          // console.log(updatedCartData);
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
      // When cart changes in *any* tab (e.g., after add/remove):
      localStorage.setItem('cart-updated', Date.now().toString());
    }
  };

  // Increment the quantity of a product in the cart
  const incrementCartItem = async ({
    productInfo,
    setComponentLoader = null
  }: {
    productInfo: ProductInfoType;
    setComponentLoader?: React.Dispatch<
      React.SetStateAction<boolean>
    > | null;
  }) => {
    // console.log('productInfo @incrementCartItem', productInfo);
    const product = findProductInCart(productInfo?.id ?? null);
    // console.log(!!setComponentLoader);
    if (product && product?.quantity) {
      await updateCartContextByClientAndSendItToTheBackend({
        productInfo,
        quantity: product.quantity + 1,
        setComponentLoader
      });
    } else {
      await updateCartContextByClientAndSendItToTheBackend({
        productInfo,
        quantity: 1,
        setComponentLoader
      });
    }
  };

  // Decrement the quantity of a product in the cart
  const decrementCartItem = async ({
    productInfo,
    setComponentLoader = null
  }: {
    productInfo: ProductInfoType;
    setComponentLoader?: React.Dispatch<
      React.SetStateAction<boolean>
    > | null;
  }) => {
    const product = findProductInCart(productInfo?.id ?? null);
    if (product && product.quantity > 1) {
      await updateCartContextByClientAndSendItToTheBackend({
        productInfo,
        quantity: product.quantity - 1,
        setComponentLoader
      });
    } else {
      await updateCartContextByClientAndSendItToTheBackend({
        productInfo,
        quantity: 0,
        setComponentLoader
      }); // Remove item if quantity is zero
    }
  };

  // Update the quantity of a product directly via input
  const updateCartItemQuantity = async ({
    productInfo,
    quantity,
    setComponentLoader = null
  }: {
    productInfo: ProductInfoType;
    quantity: number;
    setComponentLoader?: React.Dispatch<
      React.SetStateAction<boolean>
    > | null;
  }) => {
    if (quantity < 0) return; // Prevent negative values
    await updateCartContextByClientAndSendItToTheBackend({
      productInfo,
      quantity,
      setComponentLoader
    });
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
    newShippingCost: ShippingCostsDataType[]
  ) => {
    if (newShippingCost && newShippingCost.length > 0) {
      setGovernoratesData(newShippingCost);
    }
  };

  const calculateDeliveryCost = () => {
    return (
        typeof selectedGovernorate?.final_calculated_delivery_cost ===
          'number' &&
          selectedGovernorate?.final_calculated_delivery_cost > 0
      ) ?
        selectedGovernorate.final_calculated_delivery_cost
      : null;
  };

  const isApplyFreeShippingEnabled = () => {
    let applyFreeShipping = false;
    if (
      typeof freeShippingAt?.apply_free_shipping_if_total_cart_cost_equals ===
        'number' &&
      freeShippingAt?.apply_free_shipping_if_total_cart_cost_equals >=
        0 &&
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
      } else if (deductionValueByPercent) {
        couponDeductionValue = subTotalCost / deductionValueByPercent;
      }
    } else {
      if (couponData?.attributes?.deduction_value) {
        couponDeductionValue =
          couponData?.attributes?.deduction_value;
      } else if (couponData?.attributes?.deduction_value_by_percent) {
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
      (calculateNetDeliveryCost() ?? 0)
    );
  };

  // Utility to find product in the wishlist
  const findProductInWishlist = (productId: string | null) => {
    if (!productId) return null;
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
        cartId,
        setCartId,
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
        setIsSearchbarLoading,
        isCartCheckoutLoading,
        setIsCartCheckoutLoading,
        isAddressIsLoading,
        setIsAddressIsLoading
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
