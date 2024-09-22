type SubCategory = {
  id: string;
  attributes: {
    name: string;
    slug: string;
  };
};

export type CategorySidebarType = {
  id: string;
  attributes: {
    name: string;
    slug: string;
    sub_categories: {
      data: SubCategory[];
    };
  };
};

export type CategoriesData = {
  error: string | null;
  data: {
    categories: {
      data: CategorySidebarType[];
    };
  };
};
