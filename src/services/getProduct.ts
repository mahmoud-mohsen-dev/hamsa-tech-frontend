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
        edara_item_code
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
        new_datasheet {
            id
            title
            applicable_model
            datasheet {
                data {
                    attributes {
                        name
                        alternativeText
                        url
                    }
                }
            }
        }
        driver(pagination: { pageSize: 100000 }) {
            id
            title
            system
            applicable_model
            file_link
        }
        youtube_video {
            link_source
            title
        }
        features (pagination: { pageSize: 1000 }) {
            ... on ComponentFeatureFeatures {
                id
                feature
            }
        }
        long_description
        sepcification (pagination: { pageSize: 1000 }) {
            ... on ComponentDetailsSpecification {
                id
                name
                value
            }
        }
        reviews(sort: "createdAt:asc", pagination: { pageSize: 1000 }) {
            data {
                id 
                attributes {
                    createdAt
                    publishedAt
                    rating
                    headline
                    comment
                    users_permissions_user {
                        data {
                            id
                            attributes {
                                first_name
                                last_name
                                avatar_photo {
                                    data {
                                        id
                                        attributes {
                                            url
                                            alternativeText
                                        }
                                    }
                                }
                            }
                        }
                    }
                    likes(pagination: { pageSize: 10000 }) {
                        data {
                            id
                        }
                    }
                    report_abuse(pagination: { pageSize: 100 }) {
                        user {
                            data {
                                id
                            }
                        }
                        issue_type
                    }
                    hidden
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
                    localizations {
                        data {
                            id
                            attributes {
                                locale
                            }
                        }
                    }
                    locale
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
                    localizations {
                        data {
                            id
                            attributes {
                                locale
                            }
                        }
                    }
                    locale
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
                    localizations {
                        data {
                            id
                            attributes {
                                locale
                            }
                        }
                    }
                    locale
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
                    localizations {
                        data {
                            id
                            attributes {
                                locale
                            }
                        }
                    }
                    locale
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
