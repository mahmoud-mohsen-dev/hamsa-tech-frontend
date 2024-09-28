import { CartDataType } from '@/types/cartResponseTypes';

export const updateCartInTheBackend = (
  cartId: string,
  productDetails: CartDataType[],
  productId: string,
  operation: 'increment' | 'decrement' = 'increment'
) => {
  let cart = '[]';
  let productFound = false;

  // Step 1: Check if productId exists in productDetails and update quantity if found
  const updatedProductDetails = productDetails
    .map((cartItem) => {
      if (cartItem.product.data.id === productId) {
        productFound = true; // Mark as found
        // Decrement operation
        if (operation === 'decrement') {
          if (cartItem.quantity <= 1) {
            return null; // Remove item if quantity is 1 or less
          }
          return {
            quantity: cartItem.quantity - 1,
            product: cartItem.product.data.id
          };
        }
        // Increment operation
        return {
          quantity: cartItem.quantity + 1,
          product: cartItem.product.data.id
        };
      }
      return {
        quantity: cartItem.quantity,
        product: cartItem.product.data.id
      };
    })
    .filter((cartItem) => cartItem !== null);

  // Step 2: If productId is not found, add it with quantity 1
  if (!productFound) {
    updatedProductDetails.push({
      quantity: 1,
      product: productId
    });
  }

  // Step 3: Convert productDetails array to GraphQL-friendly string
  cart = `[${updatedProductDetails
    .map((cartItem) => {
      if (cartItem && cartItem?.quantity && cartItem?.product) {
        return `{
        quantity: ${cartItem.quantity},
        product: ${cartItem.product}
      }`;
      }
      return false;
    })
    .join(', ')}]`;

  // Step 4: Return the mutation query
  return `mutation {
    updateCart(id: ${cartId}, data: { product_details: ${cart} }) {
      data {
        id
        attributes {
          product_details {
            id
            quantity
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
