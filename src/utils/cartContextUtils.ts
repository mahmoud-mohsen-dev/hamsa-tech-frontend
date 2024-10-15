import { CartDataType } from '@/types/cartResponseTypes';
import { ProductType } from '@/types/getProducts';

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
      if (
        cartItem?.product?.data?.id &&
        cartItem.product.data.id === productId
      ) {
        productFound = true; // Mark the product as found
        if (quantity <= 0) {
          return null; // If quantity is 0 or less, remove the product
        }
        return {
          quantity:
            quantity <= cartItem?.product?.data?.attributes?.stock ?
              quantity
            : cartItem.quantity, // Use the provided quantity
          product: cartItem.product.data.id,
          // cost: cartItem.product.data.attributes.final_product_price,
          total_cost:
            cartItem.product.data.attributes.final_product_price *
            quantity
        };
      }
      // the rest of the all product that didn't change
      return {
        quantity: cartItem.quantity,
        product: cartItem.product.data.id,
        // cost: cartItem.cost,
        total_cost: cartItem.total_cost
      };
    })
    .filter((cartItem) => cartItem !== null); // Remove nulls (deleted products)

  // Step 2: If productId is not found, add it with the given quantity
  if (productsData.length > 0 && !productFound && quantity > 0) {
    const product = productsData.find(
      (product) => product.id === productId
    );
    updatedProductDetails.push({
      quantity:
        (
          product?.attributes?.stock &&
          quantity <= product?.attributes?.stock
        ) ?
          quantity
        : 1,
      product: productId,
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
        cartItem?.total_cost
      ) {
        return `{
          quantity: ${cartItem.quantity},
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
            total_cost
            product {
              data {
                id
                attributes {
                  name
                  price
                  sale_price
                  final_product_price
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
    total_cost: number;
  }[]
): {
  quantity: number;
  product: string;
  total_cost: number;
}[] => {
  // Create a map to store unique products by their ID
  const productMap = new Map<
    string,
    {
      quantity: number;
      product: string;
      // cost: number;
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
