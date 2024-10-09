import { ContentType } from './richTextBlock';

export interface specificationType {
  id: string;
  name: string;
  value: string;
}
export interface reviewType {
  id: string;
  attributes: {
    updatedAt: string;
    rating: number;
    headline: string;
    comment: string;
    // user_detail: {
    //   data: {
    //     attributes: {
    //       first_name: string;
    //       last_name: string;
    //       avatar_photo: {
    //         data: {
    //           attributes: {
    //             url: string | null;
    //             alternativeText: string | null;
    //           };
    //         };
    //       };
    //     };
    //   };
    // };
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
        alternativeText: string | null;
      };
    };
  };
  user_manual: {
    data: {
      attributes: {
        url: string;
        alternativeText: string | null;
      };
    };
  };
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

export interface RelatedProduct {
  id: string;
  attributes: {
    updatedAt: string;
    name: string;
    price: number;
    sale_price: number;
    stock: number;
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
