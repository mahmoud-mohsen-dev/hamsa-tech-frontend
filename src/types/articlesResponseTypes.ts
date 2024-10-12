export type ArticleCardType = {
  id: string;
  attributes: {
    title: string;
    card_description: string;
    image_card: {
      data: {
        attributes: {
          alternativeText: string | null;
          url: string;
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
    author: {
      data: {
        attributes: {
          name: string;
        };
      };
    };
    publishedAt: string;
  };
};

export type ArticlesResponseType = {
  data: {
    blogs: {
      data: ArticleCardType[];
      meta: {
        pagination: {
          total: number;
          page: number;
          pageSize: number;
          pageCount: number;
        };
      };
    };
  } | null;
  error: string | null;
};
