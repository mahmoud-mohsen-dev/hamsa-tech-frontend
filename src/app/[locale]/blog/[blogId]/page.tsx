import ArticleBlogContent from '@/components/blog/blog-page/ArticleBlogContent';
import PublisherSection from '@/components/blog/blog-page/PublisherSection';
import CommentSection from '@/components/blog/blog-page/comments-components/CommentSection';
import HeaderBlogPageSection from '@/components/blog/blog-page/HeaderBlogPageSection';
import RelatedArticleLarge from '@/components/blog/blog-page/RelatedArticleLarge';
import RelatedArticleSmall from '@/components/blog/blog-page/RelatedArticleSmall';
import SignupToNewsLetter from '@/components/blog/blog-page/SignupToNewsLetter';
import { fetchGraphql } from '@/services/graphqlCrud';
import { ArticlesIdsType } from '@/types/articlesResponseTypes';
import {
  getTranslations,
  unstable_setRequestLocale
} from 'next-intl/server';
import Image from 'next/image';
// import Image from 'next/image';
import { notFound } from 'next/navigation';
import { GetBlogResponseType } from '@/types/getBlogPageResponse';
import { fetchGraphqlServerWebAuthenticated } from '@/services/graphqlCrudServerOnly';
import { v4 } from 'uuid';
import MessageContextComponent from '@/components/UI/MessageContextComponent';

// prettier-ignore

type Props = {
  params: { blogId: string; locale: string };
};

// Helper function to recursively fetch all blogs
const fetchAllBlogsIds = async (locale: string) => {
  let allBlogIds: { id: string }[] = [];
  let page = 1;
  let hasMore = true;
  const maxRetries = 3; // Maximum number of retries
  const retryDelay = 1000; // Delay in milliseconds between retries

  while (hasMore) {
    const query = `
      query {
        blogs(locale: "${locale}", pagination: { page: ${page}, pageSize: 10 }) {
          data {
            id
          }
          meta {
            pagination {
              page
              pageSize
              pageCount
              total
            }
          }
        }
      }
    `;

    let retries = 0;
    let error;

    while (retries < maxRetries) {
      try {
        const { data, error: fetchError } = (await fetchGraphql(
          query
        )) as ArticlesIdsType;

        if (
          fetchError ||
          !data?.blogs?.data ||
          !data?.blogs?.meta?.pagination
        ) {
          error = fetchError; // Save the error for logging
          throw new Error('Fetch error'); // Force a retry on error
        }

        // Append the current page's blog IDs to the list
        allBlogIds = [...allBlogIds, ...data.blogs.data];

        // Check if there are more pages to fetch
        const pagination = data.blogs.meta.pagination;
        page += 1;
        hasMore = page <= pagination.pageCount;

        break; // Exit retry loop if successful
      } catch (err: any) {
        console.error(
          `Attempt ${retries + 1} failed for locale "${locale}":`,
          err.message
        );
        retries += 1;

        if (retries >= maxRetries) {
          console.error(
            'Max retries reached. Fetching blogs failed:',
            error
          );
          return []; // Return an empty array if max retries are reached
        }

        await new Promise((res) => setTimeout(res, retryDelay)); // Wait before retrying
      }
    }
  }

  // console.log('Fetched blog IDs:', allBlogIds);
  return allBlogIds;
};

// Updated generateStaticParams function
export async function generateStaticParams() {
  // Fetch all blog IDs for both locales
  const blogsEn = await fetchAllBlogsIds('en');
  const blogsAr = await fetchAllBlogsIds('ar');

  if (!blogsEn.length && !blogsAr.length) {
    console.error('Failed to fetch blogs');
    return [];
  }

  // Create the params for static generation
  const enParams = blogsEn.map((article) => ({
    id: article.id,
    locale: 'en'
  }));
  const arParams = blogsAr.map((article) => ({
    id: article.id,
    locale: 'ar'
  }));

  const params = [...enParams, ...arParams];

  // console.log('Generated static blog params:', params);

  return params;
}

const getBlogByIdQuery = (id: string) => `{
    blog(id: "${id}") {
        data {
            id
            attributes {
                title
                content
                publishedAt
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
                image_header {
                    data {
                        attributes {
                            url
                            alternativeText
                        }
                    }
                }
                read_time
                sidebar_related_blogs(pagination: { pageSize: 4 }) {
                    data {
                        id
                        attributes {
                            title
                            card_description
                            short_title
                            short_description
                            read_time
                            image_card {
                                data {
                                    attributes {
                                        url
                                        alternativeText
                                        formats
                                    }
                                }
                            }
                        }
                    }
                }
                blog_comments(pagination: { pageSize: 1000 }, sort: "createdAt:asc", filters: { hidden: { eq: false }, replied_to: { id: { null: true } } }) {
                    data {
                        id
                        attributes {
                            comment
                            user {
                                data {
                                    id
                                    attributes {
                                        first_name
                                        last_name
                                        avatar_photo {
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
                            hidden
                            likes(pagination: { pageSize: 10000 }) {
                                data {
                                    id
                                }
                            }
                            createdAt
                            publishedAt
                            updatedAt
                            replies(pagination: { pageSize: 10000 }, filters: { hidden: { eq: false } }) {
                                data {
                                    id
                                    attributes {
                                        comment
                                        user {
                                            data {
                                                id
                                                attributes {
                                                    avatar_photo {
                                                        data {
                                                            attributes {
                                                                alternativeText
                                                                url
                                                            }
                                                        }
                                                    }
                                                    first_name
                                                    last_name
                                                }
                                            }
                                        }
                                        hidden
                                        likes(pagination: { pageSize: 10000 }) {
                                            data {
                                                id
                                            }
                                        }
                                        createdAt
                                        publishedAt
                                        updatedAt
                                    }
                                }
                            }
                        }
                    }
                }
                createdAt
                updatedAt
                localizations {
                    data {
                        id
                        attributes {
                            locale
                        }
                    }
                }
                locale
                footer_related_blogs(pagination: { pageSize: 4 }, sort: "createdAt:asc") {
                    data {
                        id
                        attributes {
                            title
                            card_description
                            short_title
                            short_description
                            image_card {
                                data {
                                    attributes {
                                        url
                                        alternativeText
                                    }
                                }
                            }
                            read_time
                        }
                    }
                }
            }
        }
    }
}`;

export default async function BlogPostPage({
  params: { blogId, locale }
}: Props) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('BlogPage.child.content');
  const { data, error } = (await fetchGraphqlServerWebAuthenticated(
    getBlogByIdQuery(blogId)
  )) as GetBlogResponseType;
  // console.log(JSON.stringify(data));

  if (error || !data?.blog?.data?.id) {
    console.error(error);
    return notFound(); // 404 if no data
  }

  const blogData = data.blog.data ?? null;
  // console.log(JSON.stringify(blogData));

  let blogIds: { arId: string | null; enId: string | null } | null =
    null;

  if (blogData?.attributes?.locale === 'ar') {
    blogIds = {
      enId:
        blogData?.attributes?.localizations?.data?.at(0)?.id ?? null,
      arId: blogData?.id ?? null
    };
  } else {
    blogIds = {
      arId:
        blogData?.attributes?.localizations?.data?.at(0)?.id ?? null,
      enId: blogData?.id ?? null
    };
  }

  // console.log('blogIds', blogIds);

  return (
    <div className='mx-auto font-inter antialiased'>
      {/* Article Image and Article Title */}
      <HeaderBlogPageSection blogData={blogData} />

      <section className='container'>
        <div className='relative -top-24 z-[4] mx-auto grid max-w-screen-2xl gap-20 rounded-lg bg-white p-6 lg:p-10 xl:grid-cols-[1fr_350px]'>
          {/* Article */}
          <article className='w-full'>
            <PublisherSection blogData={blogData} />
            <ArticleBlogContent blogData={blogData} />
            <CommentSection blogData={blogData} blogIds={blogIds} />
          </article>

          {/* Related aside small card articles */}
          {blogData?.attributes?.sidebar_related_blogs?.data &&
            blogData?.attributes?.sidebar_related_blogs?.data
              ?.length > 0 && (
              <aside
                aria-label='Related articles'
                className='sticky top-[100px] hidden h-fit xl:block'
              >
                <div>
                  <h2 className='mb-8 text-2xl font-bold text-gray-900'>
                    {t('relatedArticles')}
                  </h2>
                  <div className='flex flex-col gap-8'>
                    {blogData?.attributes?.sidebar_related_blogs?.data.map(
                      (article) => (
                        <RelatedArticleSmall
                          relatedBlogData={article}
                          key={article?.id ?? '' + v4()}
                        />
                      )
                    )}
                  </div>
                </div>
              </aside>
            )}
        </div>
      </section>

      {/* Bottom Related articles */}
      <div className='relative -top-24 bg-gray-50 py-12'>
        <aside
          aria-label='Related articles'
          className='container max-w-screen-2xl'
        >
          <div>
            <h2 className='text-gray-90 mb-8 text-center text-2xl font-bold lg:text-start'>
              {t('relatedArticles')}
            </h2>

            <div className='grid justify-center gap-12 sm:grid-cols-2 lg:grid-cols-4'>
              {blogData?.attributes?.footer_related_blogs?.data &&
                blogData?.attributes?.footer_related_blogs?.data
                  ?.length > 0 &&
                blogData?.attributes?.footer_related_blogs?.data.map(
                  (article) => (
                    <RelatedArticleLarge
                      key={v4() + (article?.id || '')}
                      data={article}
                    />
                  )
                )}
            </div>
          </div>
        </aside>
      </div>
      <SignupToNewsLetter />
    </div>
  );
}
