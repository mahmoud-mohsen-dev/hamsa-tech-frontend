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

export type ProductType = {
  id: string;
  attributes: {
    updatedAt: string;
    name: string;
    price: number;
    sale_price: number;
    stock: number;
    sub_category: SubCategory;
    image_thumbnail: ImageThumbnail;
    average_reviews: number;
    total_reviews: number;
  };
};

export type ProductsResponseType = {
  error: string | null;
  data: {
    products: {
      data: ProductType[];
    } | null;
  };
};
