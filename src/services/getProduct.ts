export const getQueryProductPage = (id: string) => `{
  product(id: "${id}") {
    data {
      id
      attributes {
        updatedAt
        name
        price
        sale_price
        final_product_price
        stock
        sub_category {
            data {
                attributes {
                    name
                    slug
                    category {
                        data {
                            attributes {
                                name
                                slug
                            }
                        }
                    }
                }
            }
        }
        image_thumbnail {
            data {
                attributes {
                    url
                    alternativeText
                }
            }
        }
        average_reviews
        total_reviews
        brand {
            data {
                attributes {
                    name
                    slug
                }
            }
        }
        images {
            data {
                id
                attributes {
                    url
                    alternativeText
                }
            }
        }
        description
        connectivity
        modal_name
        waranty {
            data {
                attributes {
                    title
                }
            }
        }
        tags {
            data {
                id
                attributes {
                    name
                    slug
                }
            }
        }
        datasheet {
            data {
                attributes {
                    url
                    name
                    alternativeText
                }
            }
        }
        user_manual {
            data {
                attributes {
                    url
                    name
                    alternativeText
                }
            }
        }
        youtube_video {
            link_source
            title
        }
        features {
            ... on ComponentFeatureFeatures {
                id
                feature
            }
        }
        long_description
        sepcification {
            ... on ComponentDetailsSpecification {
                id
                name
                value
            }
        }
        reviews {
            data {
                id 
                attributes {
                    updatedAt
                    rating
                    headline
                    comment
                    
                }
            }
        }
        related_product_1 {
            data {
                id 
                attributes {
                    updatedAt
                    name
                    price
                    sale_price
                    stock
                    modal_name
                    brand {
                        data {
                            attributes {
                                name
                                slug
                            }
                        }
                    }
                    sub_category {
                        data {
                            attributes {
                                name
                            }
                        }
                    }
                    image_thumbnail {
                        data {
                            attributes {
                                url
                                alternativeText
                            }
                        }
                    }
                    average_reviews
                    total_reviews
                }
            }
        }
        related_product_2 {
            data {
                id 
                attributes {
                    updatedAt
                    name
                    price
                    sale_price
                    stock
                    modal_name
                    brand {
                        data {
                            attributes {
                                name
                                slug
                            }
                        }
                    }
                    sub_category {
                        data {
                            attributes {
                                name
                            }
                        }
                    }
                    image_thumbnail {
                        data {
                            attributes {
                                url
                                alternativeText
                            }
                        }
                    }
                    average_reviews
                    total_reviews
                }
            }
        }
        related_product_3 {
            data {
                id 
                attributes {
                    updatedAt
                    name
                    price
                    sale_price
                    stock
                    modal_name
                    brand {
                        data {
                            attributes {
                                name
                                slug
                            }
                        }
                    }
                    sub_category {
                        data {
                            attributes {
                                name
                            }
                        }
                    }
                    image_thumbnail {
                        data {
                            attributes {
                                url
                                alternativeText
                            }
                        }
                    }
                    average_reviews
                    total_reviews
                }
            }
        }
        related_product_4 {
            data {
                id 
                attributes {
                    updatedAt
                    name
                    price
                    sale_price
                    stock
                    modal_name
                    brand {
                        data {
                            attributes {
                                name
                                slug
                            }
                        }
                    }
                    sub_category {
                        data {
                            attributes {
                                name
                            }
                        }
                    }
                    image_thumbnail {
                        data {
                            attributes {
                                url
                                alternativeText
                            }
                        }
                    }
                    average_reviews
                    total_reviews
                }
            }
        }
        localizations {
            data {
                id
                attributes {
                    locale
                }
            }
        }
        locale
        seo {
            metaTitle
            metaDescription
            keywords
        }
      }
    }
  }
}`;
