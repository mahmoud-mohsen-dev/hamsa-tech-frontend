type ImageThumbnail = {
  data: {
    attributes: {
      url: string;
      alternativeText: string | null;
    };
  };
};

type SubCategory = {
  data: {
    attributes: {
      name: string;
    };
  };
};
type BrandType = {
  data: {
    attributes: {
      slug: string;
      name: string;
    };
  };
};

export type ProductType = {
  id: string;
  attributes: {
    updatedAt: string;
    name: string;
    price: number;
    sale_price: number;
    final_product_price: number;
    description: string;
    stock: number;
    modal_name: string;
    sub_category: SubCategory;
    brand: BrandType;
    image_thumbnail: ImageThumbnail;
    average_reviews: number;
    total_reviews: number;
    packageDimensions: {
      length_in_cm: number | null;
      width_in_cm: number | null;
      height_in_cm: number | null;
    } | null;
    finalPackageWeight: number | null;
    locale: string;
    localizations: {
      data: {
        id: string;
        attributes: {
          locale: string;
        };
      }[];
    };
  };
};

export type ProductsResponseDataType = {
  data: ProductType[];
  meta: {
    pagination: {
      total: number;
      page: number;
      pageSize: number;
      pageCount: number;
    };
  };
} | null;

export type ProductsResponseType = {
  error: string | null;
  data: {
    products: ProductsResponseDataType;
  };
};
