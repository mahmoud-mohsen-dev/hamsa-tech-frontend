import { fetchGraphql } from '@/services/graphqlCrud';
import { BlogMetatagResponseType } from '@/types/getBlogPageResponse';
import { convertToMinutes } from '@/utils/dateHelpers';
import { capitalize } from '@/utils/helpers';
import {
  getTranslations,
  unstable_setRequestLocale
} from 'next-intl/server';

export const revalidate = 120; // invalidate every 60 seconds

type PropsType = {
  children: React.ReactNode;
  params: { locale: string; blogId: string };
};

export const getQueryBlogPage = (blogId: string): string => `
    {blog(id: ${blogId ? `"${blogId}"` : null}) {
        data {
            id
            attributes {
                title
                createdAt
                publishedAt
                short_title
                short_description
                card_description
                author {
                    data {
                        attributes {
                            name
                            avatar {
                                data {
                                    attributes {
                                        url
                                        alternativeText
                                    }
                                }
                            }
                        }
                    }
                }
                tags {
                    data {
                        attributes {
                            name
                            slug
                        }
                    }
                }
                image_card {
                    data {
                        attributes {
                            alternativeText
                            url
                        }
                    }
                }
                localizations {
                    data {
                        id
                    }
                }
                read_time
                seo {
                    metaTitle
                    metaDescription
                    keywords
                }
            }
        }
    }
}`;

export async function generateMetadata({
  params: { locale, blogId }
}: Omit<PropsType, 'children'>) {
  const t = await getTranslations({
    locale,
    namespace: 'BlogPage.metaData'
  });

  const { data: blogResData, error: blogError } = (await fetchGraphql(
    getQueryBlogPage(blogId)
  )) as BlogMetatagResponseType;

  const blogData = blogResData?.blog?.data?.attributes || null;
  console.log(blogData);
  if (!blogData || blogError) {
    console.log(blogError);
    return {
      title: t('title'),
      description: t('description')
    };
  }

  const siteUrl = process.env.BASE_URL || 'https://hamsatech-eg.com'; // Base URL of your site
  const blogUrl = `${siteUrl}/${locale}/blog/${blogId}`;
  const isArabic = locale === 'ar';
  const nextBlogId =
    blogData?.localizations?.data?.at(0)?.id ?? blogId;

  const title =
    blogData?.seo?.metaTitle ||
    blogData?.short_title ||
    blogData?.title ||
    '';
  const description =
    blogData?.seo?.metaDescription ||
    blogData?.short_description ||
    blogData?.card_description ||
    '';
  const authorName =
    blogData?.author?.data?.attributes?.name ?
      blogData?.author?.data?.attributes?.name
    : isArabic ? 'غير معرف'
    : 'Unknown';
  // console.log(authorName);
  // console.log(blogData?.author?.data?.attributes?.name);
  const readingTime =
    blogData?.read_time ?
      isArabic ?
        `إقرأ في ${convertToMinutes(blogData?.read_time)} دقائق`
      : `Read in ${convertToMinutes(blogData?.read_time)} minutes`
    : '';
  const tags = blogData?.tags?.data
    .map((tag) => tag?.attributes?.name)
    .filter((name) => name)
    .join(', ');

  function cleanString(input: string) {
    if (typeof input !== 'string') return '';
    return input
      .replace(/,|\n|\u202B/g, '')
      .trim()
      .split(' ')
      .join(', ');
  }

  const getKeywords = () => {
    if (!blogData?.seo?.keywords) {
      return [title ?? null, description ?? null, tags]
        .filter((keyword) => keyword)
        .map((keyword) => keyword.toLocaleLowerCase())
        .join(', ');
    }

    return cleanString(blogData?.seo?.keywords ?? null);
  };

  return {
    title,
    description: `${description} ${readingTime}`.trim(),
    keywords: getKeywords(),
    openGraph: {
      title,
      description,
      url: blogUrl,
      images: [
        {
          url:
            blogData?.image_card?.data?.attributes?.url ||
            `${siteUrl}/image-not-found.png`,
          alt:
            blogData?.image_card?.data?.attributes?.alternativeText ||
            title ||
            ''
        }
      ],
      locale: isArabic ? 'ar_EG' : 'en_US',
      siteName: isArabic ? 'همسة تك' : 'Hamsa Tech',
      type: 'article',
      article: {
        published_time: blogData?.publishedAt || '',
        author: authorName
      }
    },
    twitter: {
      card: 'summary_large_image',
      site: '@hamsa_tech', // Twitter handle
      title,
      description,
      image:
        blogData?.image_card?.data?.attributes?.url ||
        `${siteUrl}/image-not-found.png`,
      imageAlt: title
    },
    alternates: {
      canonical: blogUrl,
      languages:
        isArabic ?
          {
            'en-US': `${siteUrl}/en/blog/${nextBlogId}`,
            'ar-EG': `${siteUrl}/ar/blog/${blogId}`
          }
        : {
            'en-US': `${siteUrl}/en/blog/${blogId}`,
            'ar-EG': `${siteUrl}/ar/blog/${nextBlogId}`
          }
    },
    other: {
      ['og:type']: 'article',
      ['article:author']: capitalize(authorName),
      ['article:tag']: tags
    }
  };
}

function BlogLayout({ children, params: { locale } }: PropsType) {
  unstable_setRequestLocale(locale);
  return <div className='blog-page'>{children}</div>;
}

export default BlogLayout;
