import { CartDataType } from '@/types/cartResponseTypes';
import { ProductType } from '@/types/getProducts';

// export const updateCartInTheBackend = (
//   cartId: string,
//   productDetails: CartDataType[],
//   productId: string,
//   operation: 'increment' | 'decrement' = 'increment'
// ) => {
//   let cart = '[]';
//   let productFound = false;

//   // Step 1: Check if productId exists in productDetails and update quantity if found
//   const updatedProductDetails = productDetails
//     .map((cartItem) => {
//       if (cartItem.product.data.id === productId) {
//         productFound = true; // Mark as found
//         // Decrement operation
//         if (operation === 'decrement') {
//           if (cartItem.quantity <= 1) {
//             return null; // Remove item if quantity is 1 or less
//           }
//           return {
//             quantity: cartItem.quantity - 1,
//             product: cartItem.product.data.id
//           };
//         }
//         // Increment operation
//         return {
//           quantity: cartItem.quantity + 1,
//           product: cartItem.product.data.id
//         };
//       }
//       return {
//         quantity: cartItem.quantity,
//         product: cartItem.product.data.id
//       };
//     })
//     .filter((cartItem) => cartItem !== null);

//   // Step 2: If productId is not found, add it with quantity 1
//   if (!productFound) {
//     updatedProductDetails.push({
//       quantity: 1,
//       product: productId
//     });
//   }

//   // Step 3: Convert productDetails array to GraphQL-friendly string
//   cart = `[${updatedProductDetails
//     .map((cartItem) => {
//       if (cartItem && cartItem?.quantity && cartItem?.product) {
//         return `{
//         quantity: ${cartItem.quantity},
//         product: ${cartItem.product}
//       }`;
//       }
//       return false;
//     })
//     .join(', ')}]`;

//   // Step 4: Return the mutation query
//   return `mutation {
//     updateCart(id: ${cartId}, data: { product_details: ${cart} }) {
//       data {
//         id
//         attributes {
//           product_details {
//             id
//             quantity
//             product {
//               data {
//                 id
//                 attributes {
//                   name
//                   price
//                   sale_price
//                   image_thumbnail {
//                     data {
//                       attributes {
//                         url
//                         alternativeText
//                       }
//                     }
//                   }
//                   stock
//                   localizations {
//                     data {
//                       id
//                     }
//                   }
//                   locale
//                 }
//               }
//             }
//           }
//         }
//       }
//     }
//   }`;
// };

export const updateCartInTheBackend = (
  cartId: string,
  productDetails: CartDataType[],
  productId: string,
  quantity: number,
  productsData: ProductType[] | []
) => {
  let cart = '[]';
  let productFound = false;

  // Step 1: Update product quantity or add new product if not found
  const updatedProductDetails = productDetails
    .map((cartItem) => {
      const salePrice =
        cartItem?.product?.data?.attributes?.sale_price ?? 0;
      const price = cartItem?.product?.data?.attributes?.price ?? 0;
      if (
        cartItem?.product?.data?.id &&
        cartItem.product.data.id === productId
      ) {
        productFound = true; // Mark the product as found
        if (quantity <= 0) {
          return null; // If quantity is 0 or less, remove the product
        }
        return {
          quantity, // Use the provided quantity
          product: cartItem.product.data.id,
          cost: cartItem.cost,
          total_cost:
            salePrice > 0 ? salePrice * quantity : price * quantity
        };
      }
      return {
        quantity: cartItem.quantity,
        product: cartItem.product.data.id,
        cost: cartItem.cost,
        total_cost:
          salePrice > 0 ? salePrice * quantity : price * quantity
      };
    })
    .filter((cartItem) => cartItem !== null); // Remove nulls (deleted products)

  // Step 2: If productId is not found, add it with the given quantity
  if (productsData.length > 0 && !productFound && quantity > 0) {
    const product = productsData.find(
      (product) => product.id === productId
    );
    updatedProductDetails.push({
      quantity,
      product: productId,
      cost:
        (
          product?.attributes?.sale_price &&
          product?.attributes?.sale_price > 0
        ) ?
          product.attributes.sale_price
        : (product?.attributes?.price ?? 0),
      total_cost:
        (
          product?.attributes?.sale_price &&
          product?.attributes?.sale_price > 0
        ) ?
          product.attributes.sale_price * quantity
        : (product?.attributes?.price ?? 0) * quantity
    });
  }

  const total_cart_cost = updatedProductDetails.reduce(
    (acc, cur) => (acc += cur.total_cost),
    0
  );

  // Step 3: aggregate products details data
  const aggregatedProductsDetails = aggregateProductsDetails(
    updatedProductDetails
  );

  // Step 4: Convert updated product details to GraphQL-friendly string
  cart = `[${aggregatedProductsDetails
    .map((cartItem) => {
      if (
        cartItem &&
        cartItem?.quantity &&
        cartItem?.product &&
        cartItem?.cost &&
        cartItem?.total_cost
      ) {
        return `{
          quantity: ${cartItem.quantity},
          cost: ${cartItem.cost},
          total_cost: ${cartItem.total_cost},
          product: ${cartItem.product}
        }`;
      }
      return false;
    })
    .join(', ')}]`;

  // Step 4: Return the complete mutation query
  return `mutation {
    updateCart(id: ${cartId}, data: { product_details: ${cart}, total_cart_cost: ${total_cart_cost}}) {
      data {
        id
        attributes {
          total_cart_cost
          product_details {
            id
            quantity
            cost
            total_cost
            product {
              data {
                id
                attributes {
                  name
                  price
                  sale_price
                  image_thumbnail {
                    data {
                      attributes {
                        url
                        alternativeText
                      }
                    }
                  }
                  stock
                  localizations {
                    data {
                      id
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
    cost: number;
    total_cost: number;
  }[]
): {
  quantity: number;
  product: string;
  cost: number;
  total_cost: number;
}[] => {
  // Create a map to store unique products by their ID
  const productMap = new Map<
    string,
    {
      quantity: number;
      product: string;
      cost: number;
      total_cost: number;
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
