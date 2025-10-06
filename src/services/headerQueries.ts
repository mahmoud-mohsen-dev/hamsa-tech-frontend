export const createCartQuery = () => {
  return `mutation {
    createCart(
        data: {
            publishedAt: "${new Date().toISOString()}"
        }
    ) {
        data {
            id
        }
    }
  }`;
};

export const updateCartWithUserIdQuery = (
  cartId: string,
  userId: string
) => {
  return `mutation {
        updateCart(id: ${cartId}, data: { userId: ${userId ? `"${userId}"` : null} }) {
            data {
                id
            }
        }
    }`;
};

export const getUserCartIdQuery = (userId: string) => {
  return `query UsersPermissionsUsers {
        usersPermissionsUsers(filters: { id: { eq: "${userId}" } }) {
            data {
                id
                attributes {
                    cart {
                        data {
                            id
                        }
                    }
                }
            }
        }
    }`;
};

export const getGuestUserCartIdQuery = (userId: string) => {
  return `query GuestUser {
        guestUser(id: "${userId}") {
            data {
                attributes {
                    cart {
                        data {
                            id
                        }
                    }
                }
            }
        }
    }`;
};

export const getCartQuery = (cartId: string) => {
  return `{
    cart(id: ${cartId}) {
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
                                final_package_weight_in_grams
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
                                stock
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

export const emptyCartQuery = (cartId: string | null) => {
  return `mutation {
    updateCart(id: ${cartId ? `"${cartId}"` : null}, data: { product_details: [], total_cart_cost: 0 }) {
      data {
        id
      }
    }
  }`;
};

export const deleteCartQuery = (cartId: string | null) => {
  return `mutation DeleteCart {
    deleteCart(id: ${cartId ? `"${cartId}"` : null}) {
        data {
            id
        }
    }
  }`;
};

export const checkGuestUserIdExistQuery = (userId: string) => {
  return `{
      guestUser(
          id: "${userId}"
      ) {
          data {
              id
          }
      }
    }`;
};

export const createGuestUserQuery = (
  agreedToSignUpForNewsletter: boolean = false
) => {
  return `mutation CreateGuestUser {
    createGuestUser(
        data: {
            subscribed_to_news_and_offers: ${agreedToSignUpForNewsletter}
            publishedAt: "${new Date().toISOString()}"
        }
    ) {
        data {
            id
        }
    }
  }`;
};

export const getCreateWishlistQuery = (
  guestUserId: string | null,
  userId: string | null
) => {
  return `mutation CreateWishlist {
    createWishlist(
        data: { 
          publishedAt: "${new Date().toISOString()}"
          guest_user: ${guestUserId ? `"${guestUserId}"` : null}
          users_permissions_user: ${userId ? `"${userId}"` : null}
        }
    ) {
        data {
            id
        }
    }
  }`;
};

export const getCreateWishlistLocalizationQuery = (arId: string) => {
  return `mutation CreateWishlistLocalization {
    createWishlistLocalization(
        id: "${arId}"
        locale: "en"
        data: { 
          publishedAt: "${new Date().toISOString()}"
        }
    ) {
        data {
            id
            attributes {
                locale
                localizations {
                    data {
                        id
                        attributes {
                            locale
                        }
                    }
                }
            }
        }
    }
  }`;
};

export const getWishlistDataQuery = (wishlistId: string) => {
  return `{
    wishlist(id: "${wishlistId}") {
        data {
            id
            attributes {
                products {
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
                                        alternativeText
                                        url
                                    }
                                }
                            }
                            stock
                            locale
                            localizations {
                                data {
                                    id
                                    attributes {
                                        locale
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
  }`;
};
