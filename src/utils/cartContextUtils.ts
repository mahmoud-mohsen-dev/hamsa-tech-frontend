import { CartDataType } from '@/types/cartResponseTypes';
import { ProductType } from '@/types/getProducts';
// import { formatForGraphQL } from './helpers';

export type ProductInfoType =
  | {
      id: string | null;
      stock: number | null;
      final_product_price: number | null;
      // finalPackageWeight: number | null;
    }
  | null
  | undefined;

export type ProductInfoWithPackageWeightType =
  | {
      id: string | null;
      stock: number | null;
      final_product_price: number | null;
      finalPackageWeight: number | null;
    }
  | null
  | undefined;

export const updateCartByClientAndSendItToTheBackend = ({
  cartId,
  cart,
  quantity,
  productInfo
}: {
  cartId: string;
  cart: CartDataType[];
  quantity: number;
  productInfo: ProductInfoType;
}) => {
  'use client';

  console.log({
    cartId,
    cart,
    quantity,
    productInfo
  });

  let productFound = false;

  // Step 1: Update product quantity or add new product if not found
  const updatedCartSummary = cart
    .map((cartItem) => {
      if (
        cartItem?.product?.data?.id &&
        productInfo?.id &&
        cartItem.product.data.id === productInfo?.id
      ) {
        productFound = true; // Mark the product as found
        if (quantity <= 0) {
          return null; // If quantity is 0 or less, remove the product
        }
        const updatedQuantity =
          quantity <= cartItem?.product?.data?.attributes?.stock ?
            quantity
          : cartItem.quantity; // Use the provided quantity

        return {
          quantity: updatedQuantity,
          product: cartItem.product.data.id,
          total_cost:
            cartItem.product.data.attributes.final_product_price *
            updatedQuantity,
          description: cartItem?.product?.data?.id ?? ''
        };
      }
      // the rest of the all product that didn't change
      return {
        quantity: cartItem.quantity,
        product: cartItem.product.data.id,
        total_cost: cartItem.total_cost,
        description: cartItem?.product?.data?.id ?? ''
      };
    })
    .filter((cartItem) => cartItem !== null); // Remove nulls (deleted products)

  console.log('cart', cart);
  console.log('productInfo', productInfo);
  console.log('updatedCartSummary', updatedCartSummary);

  // Step 2: If productId is not found, add it with the given quantity
  if (
    !productFound &&
    quantity > 0 &&
    typeof productInfo?.stock === 'number' &&
    productInfo?.stock > 0 &&
    productInfo?.id &&
    typeof productInfo?.final_product_price === 'number' &&
    productInfo.final_product_price > 0
  ) {
    const updatedQuantity =
      quantity <= productInfo.stock ? quantity : productInfo.stock;
    updatedCartSummary.push({
      quantity: updatedQuantity,
      product: productInfo.id,
      total_cost: productInfo.final_product_price * updatedQuantity,
      description: productInfo.id
    });
  }

  console.log('cart', cart);
  console.log('productInfo', productInfo);
  console.log('updatedCartSummary', updatedCartSummary);

  const total_cart_cost = updatedCartSummary.reduce(
    (acc, cur) => (acc += cur.total_cost),
    0
  );

  // Step 3: aggregate products details data
  const aggregatedProductsDetails = aggregateProductsDetails(
    updatedCartSummary
  );
  console.log('aggregatedProductsDetails', aggregatedProductsDetails);

  // Step 4: Convert updated product details to GraphQL-friendly string
  const cartStr = `[${aggregatedProductsDetails
    .map((cartItem) => {
      if (
        cartItem &&
        cartItem?.quantity &&
        cartItem?.product &&
        cartItem?.total_cost
      ) {
        return `{
          quantity: ${cartItem.quantity},
          total_cost: ${cartItem.total_cost},
          product: ${cartItem.product},
          description: "(Product ID: ${cartItem?.description ?? ''})"
        }`;
      }
      return false;
    })
    .join(', ')}]`;

  console.log('cartStr', cartStr);

  // Step 4: Return the complete mutation query
  return `mutation {
    updateCart(id: ${cartId}, data: { product_details: ${cartStr}, total_cart_cost: ${total_cart_cost}}) {
      data {
        id
        attributes {
          total_cart_cost
          product_details {
            id
            quantity
            total_cost
            product {
              data {
                id
                attributes {
                  name
                  price
                  sale_price
                  final_product_price
                  description
                  image_thumbnail {
                    data {
                      attributes {
                        url
                        alternativeText
                      }
                    }
                  }
                  stock
                  final_package_weight_in_grams
                  localizations {
                      data {
                          id
                          attributes {
                            name
                            price
                            sale_price
                            final_product_price
                            description
                            image_thumbnail {
                                data {
                                    id
                                    attributes {
                                        alternativeText
                                        url
                                    }
                                }
                            }
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
    }
  }`;
};

export const aggregateProductsDetails = (
  productDetails: {
    quantity: number;
    product: string;
    total_cost: number;
    description: string;
  }[]
): {
  quantity: number;
  product: string;
  total_cost: number;
  description: string;
}[] => {
  'use client';
  // Create a map to store unique products by their ID
  const productMap = new Map<
    string,
    {
      quantity: number;
      product: string;
      // cost: number;
      total_cost: number;
      description: string;
    }
  >();

  // Loop through the cart items
  productDetails.forEach((item) => {
    const productId = item.product;

    // Check if the product already exists in the map
    if (productMap.has(productId)) {
      // If it exists, update the quantity
      const existingItem = productMap.get(productId);
      if (existingItem) {
        existingItem.quantity += item.quantity; // Aggregate the quantity
      }
    } else {
      // If it doesn't exist, add it to the map
      productMap.set(productId, { ...item }); // Spread to ensure immutability
    }
  });

  // Convert the map back to an array
  return Array.from(productMap.values());
};

export const aggregateCartItems = (
  cartItems: CartDataType[]
): CartDataType[] => {
  // Create a map to store unique products by their ID
  const productMap = new Map<string, CartDataType>();

  // Loop through the cart items
  cartItems.forEach((item) => {
    const productId = item.product.data.id;

    // Check if the product already exists in the map
    if (productMap.has(productId)) {
      // If it exists, update the quantity
      const existingItem = productMap.get(productId);
      if (existingItem) {
        existingItem.quantity += item.quantity; // Aggregate the quantity
      }
    } else {
      // If it doesn't exist, add it to the map
      productMap.set(productId, { ...item }); // Spread to ensure immutability
    }
  });

  // Convert the map back to an array
  return Array.from(productMap.values());
};

export const modifyCartDataByLocale = (
  locale: string,
  cartItems: CartDataType[]
): CartDataType[] => {
  'use client';
  const newCartItems: CartDataType[] = [];
  // Filter the cart items based on the given locale
  cartItems.forEach((item) => {
    if (item?.product?.data?.attributes?.locale === locale) {
      newCartItems.push(item);
    } else {
      // If the product doesn't match the given locale, check its localizations
      item?.product?.data?.attributes?.localizations?.data.forEach(
        (localization) => {
          if (localization.attributes.locale === locale) {
            // newCartItems.push();
            console.log(item);
            const newProductItem = {
              id: item.id,
              quantity: item.quantity,
              total_cost: item.total_cost,
              product: {
                data: {
                  id: localization.id,
                  attributes: {
                    ...localization.attributes,
                    final_package_weight_in_grams:
                      item?.product?.data?.attributes
                        ?.final_package_weight_in_grams ?? null,
                    locale,
                    localizations: {
                      data: [
                        {
                          id: item.product.data.id,
                          attributes: {
                            name: item?.product?.data?.attributes
                              .name,
                            description:
                              item?.product?.data?.attributes
                                ?.description,
                            final_product_price:
                              item?.product?.data?.attributes
                                .final_product_price,
                            price:
                              item?.product?.data?.attributes?.price,
                            sale_price:
                              item?.product?.data?.attributes
                                ?.sale_price,
                            image_thumbnail:
                              item?.product?.data?.attributes
                                ?.image_thumbnail ?? null,
                            locale
                          }
                        }
                      ]
                    },
                    stock: item?.product?.data?.attributes?.stock
                  }
                }
              }
            };
            newCartItems.push(newProductItem);
          }
        }
      );
    }
  });
  // console.log('cart items');
  // console.log(cartItems);
  // console.log('New cart items');
  // console.log(newCartItems);
  return newCartItems;
};
