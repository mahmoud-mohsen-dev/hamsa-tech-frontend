export type NavItemKeyType = {
  id: string;
  categoryName: string;
  page: string;
  children: {
    subCategoryName: string;
    id: string;
    imgSrc: string;
    page: string;
  }[];
};

export interface NavItemType {
  products: NavItemKeyType[];
  offers: NavItemKeyType[];
  blog: NavItemKeyType[];
  aboutUs: NavItemKeyType[];
  support: NavItemKeyType[];
}

export interface productType {
  id: string;
  brand: string;
  productName: string;
  totalNumberOfRates: number;
  averageRate: number;
  imgSrc: string;
  alt: string;
  priceBeforeDeduction: number;
  currentPrice: number;
  badge: '' | 'Hot' | 'Out Of Stock' | 'Limited' | 'Sale' | 'New';
}

export type productsType = {
  subCategoryName: string;
  imgSrc: string;
  id: string;
  children: productType[];
}[];

export type productsObjectType = {
  subCategoryName: string;
  imgSrc: string;
  children: productType[];
};

export interface ProductBasicInfoType {
  subCategoryName: string;
  id: string;
  brand: string;
  productName: string;
  imgSrc: string;
  totalNumberOfRates: number;
  alt: string;
  averageRate: number;
  priceBeforeDeduction: number;
  currentPrice: number;
  badge: '' | 'Hot' | 'Out Of Stock' | 'Limited' | 'Sale' | 'New';
  quantity: number;
}
export interface productDetailsType {
  product: {
    basic: ProductBasicInfoType;
    sliderImgs: {
      imgSrc: string;
      alt: string;
    }[];
    info: {
      description: string;
      sku: string;
      connectivity: string;
      modalName: string;
      waranty: {
        value: number;
        duration: 'month' | 'year' | 'months' | 'years';
      };
      tags: { label: string; href: string }[];
    };
    details: { aboutProduct: string[] };
    moreDetails: {
      description: {
        heading?: string;
        p?: string;
        img?: {
          src: string;
          alt?: string;
        };
        alt?: string;
        ul?: string[];
      }[];
      specification: {
        key: string;
        value: string;
      }[];
      reviews: {
        customerReviews: {
          rating: number;
          title: string;
          content: string;
          user: {
            name: string;
            avatarURL: string;
            avrtarAlt: string;
          };
          createdAt: string;
        }[];
      };
    };
  };
  relatedProducts: ProductBasicInfoType[];
}
