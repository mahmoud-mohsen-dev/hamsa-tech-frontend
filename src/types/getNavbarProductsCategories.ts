interface Image {
  data: {
    attributes: { url: string; alternativeText: string | null };
  };
}

export interface SubCategoryType {
  id: string;
  attributes: { name: string; slug: string; image: Image };
}

export interface CategoryType {
  id: string;
  attributes: {
    name: string;
    slug: string;
    sub_categories: { data: SubCategoryType[] };
  };
}

export interface NavbarProductsCategoriesResponseType {
  data: {
    categories: { data: CategoryType[] };
  };
  error: string | null;
}
