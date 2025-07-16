import { ContentType } from './richTextBlock';

export interface specificationType {
  id: string;
  name: string;
  value: string;
}
export interface reviewType {
  id: string;
  attributes: {
    createdAt: string;
    publishedAt: string;
    rating: number;
    headline: string;
    comment: string;
    users_permissions_user: {
      data: {
        id: string;
        attributes: {
          first_name: string | null;
          last_name: string | null;
          avatar_photo: {
            data: {
              id: string;
              attributes: {
                url: string | null;
                alternativeText: string | null;
              };
            } | null;
          };
        };
      };
    };
    likes: {
      data:
        | {
            id: string;
          }[]
        | null;
    };
    report_abuse:
      | {
          user: {
            data: {
              id: string;
            };
          };
          issue_type:
            | 'off-topic'
            | 'inappropriate'
            | 'fake'
            | 'other';
        }[]
      | null;
    hidden: boolean;
  };
}
export interface ProductDataType {
  name: string;
  price: number;
  sale_price: number;
  final_product_price: number;
  stock: number;
  updatedAt: string;
  sub_category: {
    data: {
      attributes: {
        name: string;
        slug: string;
        category: {
          data: {
            attributes: { name: string; slug: string };
          };
        };
      };
    };
  };
  image_thumbnail: {
    data: {
      attributes: {
        url: string;
        alternativeText: string | null;
      };
    };
  };
  average_reviews: number;
  total_reviews: number;
  brand: { data: { attributes: { name: string; slug: string } } };
  images: {
    data: {
      id: string;
      attributes: {
        url: string;
        alternativeText: string | null;
      };
    }[];
  };
  description: string;
  connectivity: string;
  modal_name: string;
  edara_item_code: string | number | null;
  waranty: {
    data: {
      attributes: {
        title: string;
      };
    };
  };
  tags: {
    data: {
      id: string;
      attributes: {
        name: string;
        slug: string;
      };
    }[];
  };
  datasheet: {
    data: {
      attributes: {
        url: string;
        name?: string | null;
        alternativeText: string | null;
      };
    };
  };
  user_manual: {
    data: {
      attributes: {
        url: string;
        name?: string | null;
        alternativeText: string | null;
      };
    };
  };
  new_datasheet: {
    id: string | null;
    title: string | null;
    applicable_model: string | null;
    datasheet: {
      data: {
        attributes: {
          name: string | null;
          alternativeText: string | null;
          url: string | null;
        };
      };
    };
  };
  package_dimensions: {
    length_in_cm: number | null;
    width_in_cm: number | null;
    height_in_cm: number | null;
  } | null;
  final_package_weight_in_grams: number | null;
  driver: {
    id: string | null;
    title: string | null;
    system: string | null;
    applicable_model: string | null;
    file_link: string | null;
  }[];
  youtube_video: { link_source: string; title: string };
  features: { id: string; feature: string }[];
  long_description: ContentType[];
  sepcification: specificationType[];
  reviews: { data: reviewType[] };
  related_product_1: { data: RelatedProduct };
  related_product_2: { data: RelatedProduct };
  related_product_3: { data: RelatedProduct };
  related_product_4: { data: RelatedProduct };
  localizations: {
    data: { id: string; attributes: { locale: string } }[];
  };
  locale: string;
  seo?: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
  };
}

// Define the product response type
export interface ProductResponseType {
  data: {
    product: {
      data: {
        id: string;
        attributes: ProductDataType;
      };
    };
  };
  error: string | null;
}

export interface ProductPricesResponseType {
  data: {
    product: {
      data: {
        attributes: {
          final_product_price: number;
          price: number;
          sale_price: number;
          stock: number;
          package_dimensions: {
            length_in_cm: number | null;
            width_in_cm: number | null;
            height_in_cm: number | null;
          } | null;
          final_package_weight_in_grams: number | null;
          localizations: {
            data:
              | {
                  id: string;
                  attributes: {
                    locale: string;
                  };
                }[]
              | null;
          };
          locale: string;
        };
        id: string;
      } | null;
    } | null;
  } | null;
  error?: null | string;
}

export interface RelatedProduct {
  id: string;
  attributes: {
    updatedAt: string;
    name: string;
    price: number;
    sale_price: number;
    final_product_price: number;
    stock: number;
    modal_name: string;
    brand: {
      data: {
        attributes: {
          slug: string;
          name: string;
        };
      };
    };
    sub_category: {
      data: { attributes: { name: string } };
    };
    image_thumbnail: {
      data: {
        attributes: { url: string; alternativeText: string | null };
      };
    };
    average_reviews: number;
    total_reviews: number;
    final_package_weight_in_grams: number | null;
    localizations: {
      data: { id: string; attributes: { locale: string } }[];
    };
    locale: string;
  };
}

export type NextProductResponseType = {
  data: {
    product: {
      data: {
        id: string;
        attributes: {
          localizations: {
            data: {
              id: string;
            }[];
          };
        };
      };
    };
  };
  error: string | null;
};
