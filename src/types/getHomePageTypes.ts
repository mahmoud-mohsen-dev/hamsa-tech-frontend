// Hero section type
export type HeroSectionType = {
  id: string;
  headingTop: string;
  headingBottom: string;
  direction: 'left' | 'right';
  image: {
    data: {
      attributes: {
        url: string;
        alternativeText: string | null;
      };
    };
  };
  buttonLink: {
    id: string;
    buttonText: string;
    button_slug: string;
  };
};

// Products spotlight section type
export type ProductsSpotlightSectionType = {
  section_name: string;
  heading_in_black: string;
  heading_in_red: string;
  products: {
    data: {
      id: string;
      attributes: {
        name: string;
        updatedAt: string;
        image_thumbnail: {
          data: {
            attributes: {
              url: string;
              alternativeText: string | null;
            };
          };
        };
        spotlight_description: string;
      };
    }[];
  };
};

// Categories section type
export type CategoriesSectionType = {
  section_name: string;
  heading_in_black: string;
  heading_in_red: string;
  description: string;
  category: {
    id: string;
    title: string;
    description: string;
    slug: string;
    image: {
      data: {
        attributes: {
          url: string;
          alternativeText: string | null;
        };
      };
    };
  }[];
};

// Brands section type
export type BrandsSectionType = {
  brands: {
    data: {
      id: string;
      attributes: {
        logo: {
          data: {
            attributes: {
              url: string;
              alternativeText: string | null;
            };
          };
        };
      };
    }[];
  };
};

// About us section type
export type AboutUsSectionType = {
  title: string;
  description: string;
  button_text: string;
  section_name: string;
  image: {
    data: {
      attributes: {
        url: string;
        alternativeText: string | null;
      };
    };
  };
};

// Featured blogs section type
export type FeaturedBlogsSectionType = {
  section_name: string;
  heading_in_black: string;
  heading_in_red: string;
  blogs: {
    data: {
      id: string;
      attributes: {
        createdAt: string;
        title: string;
        image_card: {
          data: {
            attributes: {
              url: string;
              alternativeText: string | null;
            };
          };
        };
        card_description: string;
        tags: {
          data: {
            id: string;
            attributes: {
              name: string;
              slug: string;
            };
          }[];
        };
        author: {
          data: {
            attributes: {
              name: string;
            };
          };
        };
      };
    }[];
  };
};

// Contact us section type
export type ContactUsSectionType = {
  section_name: string;
  heading: string;
  button_text: string;
  button_url: string;
};

// Homepage response type
export type HomepageResponseType = {
  data: {
    pages: {
      data: {
        attributes: {
          heroSection: HeroSectionType[] | null;
          products_spotlight: ProductsSpotlightSectionType | null;
          categories: CategoriesSectionType | null;
          brands: BrandsSectionType | null;
          about_us: AboutUsSectionType | null;
          featured_blogs: FeaturedBlogsSectionType | null;
          contact_us: ContactUsSectionType | null;
        };
      }[];
    };
  };
  error: string | null;
};
