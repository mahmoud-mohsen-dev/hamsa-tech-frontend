import { ContentType } from './richTextBlock';

export type AvatarType = {
  url: string | null;
  alternativeText: string | null;
};

export type AuthorType = {
  name: string | null;
  avatar: {
    data: {
      attributes: AvatarType | null;
    } | null;
  } | null;
};

export type TagType = {
  name: string | null;
  slug: string | null;
};

export type ImageHeaderType = {
  url: string | null;
  alternativeText: string | null;
};

export type ImageRelatedSidebarType = {
  url: string | null;
  alternativeText: string | null;
  formats: {
    thumbnail: {
      ext: string | null;
      url: string | null;
      hash: string | null;
      mime: string | null;
      name: string | null;
      path: null;
      size: number | null;
      width: number | null;
      height: number | null;
      sizeInBytes: number | null;
      provider_metadata: {
        public_id: string | null;
        resource_type: string | null;
      } | null;
    };
  };
};

export type UserBasicDataType = {
  id: string | null;
  attributes: {
    first_name: string | null;
    last_name: string | null;
    avatar_photo: {
      data: {
        attributes: AvatarType | null;
      } | null;
    } | null;
  };
};

export type BasicCommentType = {
  id: string | null;
  attributes: {
    comment: string | null;
    user: {
      data: UserBasicDataType | null;
    } | null;
    hidden: false;
    likes: {
      data:
        | {
            id: string;
          }[]
        | null;
    };
    createdAt?: string | null;
    updatedAt?: string | null;
    publishedAt?: string | null;
  };
};

export type BlogCommentType = {
  id: string | null;
  attributes: {
    comment: string | null;
    user: {
      data: UserBasicDataType | null;
    } | null;
    hidden: boolean;
    likes: {
      data:
        | {
            id: string;
          }[]
        | null;
    };
    replies?: {
      data: BasicCommentType[] | null;
    };
    createdAt?: string | null;
    updatedAt?: string | null;
    publishedAt?: string | null;
  } | null;
};

export type LocalizationType = {
  id: string | null;
  attributes: {
    locale: string | null;
  } | null;
};

export type RelatedSidebarBlogType = {
  id: string | null;
  attributes: {
    title: string | null;
    card_description: string | null;
    short_title: string | null;
    short_description: string | null;
    image_card: {
      data: {
        attributes: ImageRelatedSidebarType | null;
      } | null;
    } | null;
    read_time: string | null;
  } | null;
};

export type RelatedFooterBlogType = {
  id: string | null;
  attributes: {
    title: string | null;
    card_description: string | null;
    short_title: string | null;
    short_description: string | null;
    image_card: {
      data: {
        attributes: ImageHeaderType | null;
      } | null;
    } | null;
    read_time: string | null;
  } | null;
};

export type BlogAttributesType = {
  title: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  publishedAt: string | null;
  content: ContentType[] | null;
  author: {
    data: {
      attributes: AuthorType | null;
    } | null;
  } | null;
  tags: {
    data:
      | {
          attributes: TagType | null;
        }[]
      | null;
  } | null;
  image_header: {
    data: {
      attributes: ImageHeaderType | null;
    } | null;
  } | null;
  read_time: string | null;
  sidebar_related_blogs: {
    data: RelatedSidebarBlogType[] | null;
  } | null;
  blog_comments: {
    data: BlogCommentType[] | null;
  } | null;
  localizations: {
    data: LocalizationType[] | null;
  } | null;
  locale: string | null;
  footer_related_blogs: {
    data: RelatedFooterBlogType[] | null;
  } | null;
};

export type BlogDataType = {
  id: string | null;
  attributes: BlogAttributesType | null;
};

export type BlogType = {
  data: BlogDataType | null;
};

export type GetBlogResponseType = {
  data: {
    blog: BlogType | null;
  } | null;
  error: string | null;
};

export interface BlogMetatagResponseType {
  data: {
    blog: {
      data: {
        id: string;
        attributes: {
          title: string | null;
          createdAt: string;
          publishedAt: string;
          short_title: string | null;
          short_description: string | null;
          card_description: string | null;
          author: {
            data: {
              attributes: {
                name: string | null;
                avatar: {
                  data: {
                    attributes: {
                      url: string | null;
                      alternativeText?: string | null;
                    };
                  };
                };
              };
            };
          };
          tags: {
            data: {
              attributes: {
                name: string;
                slug: string;
              };
            }[];
          };
          image_card: {
            data: {
              attributes: {
                url: string | null;
                alternativeText?: string | null;
              };
            };
          };
          read_time: string;
          localizations: {
            data:
              | [
                  {
                    id: string | null;
                  }
                ]
              | null;
          };
          seo: {
            metaTitle: string;
            metaDescription: string;
            keywords: string;
          };
        };
      };
    };
  };
  error?: string | null;
}
