import { fetchGraphql } from '@/services/graphqlCrud';
import ArticleCard from '@/components/UI/articles/ArticleCard';
import BlogPagination from '@/components/blog/BlogPagination';
import { ArticlesResponseType } from '@/types/articlesResponseTypes';
import { notFound } from 'next/navigation';
import { truncateSentence } from '@/utils/helpers';
import { unstable_setRequestLocale } from 'next-intl/server';

type Props = {
  params: { page: string; locale: string };
};

const getBlogsQuery = (
  page: number,
  pageSize: number,
  locale: string
) => `
  query {
    blogs(locale: "${locale}", pagination: { page: ${page}, pageSize: ${pageSize} }) {
      data {
        id
        attributes {
          title
          card_description
          publishedAt
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
  }
`;

// export const revalidate = 60; // Revalidate after 60 seconds

export default async function BlogPage({
  params: { page, locale }
}: Props) {
  unstable_setRequestLocale(locale);
  const currentPage = Number(page) || 1;
  const pageSize = 10;

  const { data, error } = (await fetchGraphql(
    getBlogsQuery(currentPage, pageSize, locale)
  )) as ArticlesResponseType;

  if (error || !data?.blogs?.data) {
    return notFound(); // 404 if no data
  }

  const blogs = data.blogs.data;
  const pagination = data.blogs.meta.pagination;

  return (
    <div className='font-inter'>
      <div className='text-center'>
        <h1 className='text-4xl font-bold'>Our Blog</h1>
        <p className='mt-2'>
          Discover the latest news from Hamsa Tech.
        </p>
      </div>
      <div className='mt-10 grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-8'>
        {blogs.map((blog) => (
          <ArticleCard
            key={blog.id}
            imgSrc={
              blog.attributes.image_card.data.attributes.url ?? ''
            }
            alt={
              blog.attributes.image_card.data.attributes
                .alternativeText ?? ''
            }
            articleUrl={`/blog/${blog.id}`}
            content={{
              // tags
              tags: blog?.attributes?.tags?.data.map((tag) => ({
                linkUrl: tag?.attributes?.slug ?? '/',
                linkText: tag?.attributes?.name
              })),
              title: blog?.attributes?.title ?? '',
              description: truncateSentence(
                data?.blogs?.data[0]?.attributes?.card_description ??
                  '',
                150
              ),
              publishDate: blog?.attributes?.publishedAt ?? null,
              publisher:
                blog?.attributes?.author?.data?.attributes?.name ?? ''
            }}
          />
        ))}
      </div>
      <BlogPagination
        total={pagination.total}
        currentPage={pagination.page}
        pageSize={pagination.pageSize}
      />
    </div>
  );
}
