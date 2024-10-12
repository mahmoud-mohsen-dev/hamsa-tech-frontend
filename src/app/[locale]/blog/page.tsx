import BlogPagination from '@/components/blog/BlogPagination';
import ArticleCard from '@/components/UI/articles/ArticleCard';
import { fetchGraphql } from '@/services/graphqlCrud';
import { ArticlesResponseType } from '@/types/articlesResponseTypes';
import { truncateSentence } from '@/utils/helpers';
import { Pagination } from 'antd';
import { unstable_setRequestLocale } from 'next-intl/server';

type PropsType = {
  params: { locale: string };
};

const getBlogsQuery = (page: number, locale: string) => {
  return `{
        blogs(locale: "${locale ?? 'en'}", pagination: { page: ${page ?? 1}, pageSize: 10 }) {
            data {
                id
                attributes {
                    title
                    card_description
                    image_card {
                        data {
                            attributes {
                                alternativeText
                                url
                            }
                        }
                    }
                    tags {
                        data {
                            id
                            attributes {
                                name
                                slug
                            }
                        }
                    }
                    author {
                        data {
                            attributes {
                                name
                            }
                        }
                    }
                    publishedAt
                }
            }
            meta {
                pagination {
                    total
                    page
                    pageSize
                    pageCount
                }
            }
        }
    }`;
};

async function BlogPage({ params: { locale } }: PropsType) {
  unstable_setRequestLocale(locale);

  const { data, error } = (await fetchGraphql(
    getBlogsQuery(1, locale)
  )) as ArticlesResponseType;
  if (error || !data?.blogs.data) {
    console.error(error);
    throw new Error('Could not fetch articles');
  }

  const temMultipleData = [
    ...data?.blogs?.data,
    ...data?.blogs?.data,
    ...data?.blogs?.data
  ];

  return (
    <div className='font-inter'>
      <div className='text-center'>
        <h1 className='text-4xl font-bold text-black-light'>
          Our Blog
        </h1>
        <h4 className='mt-2 text-lg'>
          Discover the latest news and articles from Hamsa Tech.
        </h4>
      </div>
      <div className='mt-10 grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] grid-rows-1 gap-8'>
        {/* {data?.blogs?.data.map((article) => { */}
        {temMultipleData.map((article) => {
          return (
            <ArticleCard
              key={article.id}
              imgSrc={
                article.attributes.image_card.data.attributes.url ??
                ''
              }
              alt={
                article.attributes.image_card.data.attributes
                  .alternativeText ?? ''
              }
              articleUrl={`/blog/${article.id}`}
              content={{
                // tags
                tags: article?.attributes?.tags?.data.map((tag) => ({
                  linkUrl: tag?.attributes?.slug ?? '/',
                  linkText: tag?.attributes?.name
                })),
                title: article?.attributes?.title ?? '',
                description: truncateSentence(
                  data?.blogs?.data[0]?.attributes
                    ?.card_description ?? '',
                  150
                ),
                publishDate: article?.attributes?.publishedAt ?? null,
                publisher:
                  article?.attributes?.author?.data?.attributes
                    ?.name ?? ''
              }}
            />
          );
        })}
      </div>
      <BlogPagination />
    </div>
  );
}

export default BlogPage;
