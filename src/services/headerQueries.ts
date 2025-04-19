
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

export const getCartQuery = (cartId: number) => {
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