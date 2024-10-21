import { fetchGraphql } from '@/services/graphqlCrud';
import ArticleCard from '@/components/UI/articles/ArticleCard';
import BlogPagination from '@/components/blog/BlogPagination';
import {
  ArticlesResponseType,
  TotalArticlesInALocaleType
} from '@/types/articlesResponseTypes';
import { notFound } from 'next/navigation';
import { truncateSentence } from '@/utils/helpers';
import {
  getTranslations,
  unstable_setRequestLocale
} from 'next-intl/server';

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

// Helper function to recursively fetch all pages for blogs
const fetchAllBlogPages = async (locale: string) => {
  const allPages: { page: string; locale: string }[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const query = `
      query {
        blogs(locale: "${locale}", pagination: { page: ${page}, pageSize: 10 }) {
          meta {
            pagination {
              total
              pageCount
              page
              pageSize
            }
          }
        }
      }
    `;

    const { data, error } = (await fetchGraphql(
      query
    )) as TotalArticlesInALocaleType;

    if (error || !data?.blogs?.meta) {
      console.error('Error fetching blogs:', error);
      return [];
    }

    const pagination = data.blogs.meta.pagination;
    const totalPages = pagination.pageCount;

    // Add the current page to the list
    allPages.push({ page: page.toString(), locale });

    // Move to the next page
    page += 1;
    hasMore = page <= totalPages;
  }

  return allPages;
};

export async function generateStaticParams() {
  // Fetch all blog pages for both locales
  const pagesEn = await fetchAllBlogPages('en');
  const pagesAr = await fetchAllBlogPages('ar');

  if (!pagesEn.length && !pagesAr.length) {
    console.error('Failed to fetch blog pages');
    return [];
  }

  // Combine both locales' pages
  const totalPages = [...pagesEn, ...pagesAr];

  console.log('Generated static params for blog pages:', totalPages);

  return totalPages;
}
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

  if (error || !data?.blogs?.data || data?.blogs?.data.length === 0) {
    console.error('Error fetching blogs:', error);
    console.error('Error fetching blogs data:', data);
    return notFound(); // 404 if no data
  }

  const blogs = data.blogs.data;
  const pagination = data.blogs.meta.pagination;
  const t = await getTranslations('BlogPage.content');

  return (
    <div className='font-inter'>
      <div className='text-center'>
        <h1 className='text-4xl font-bold'>{t('title')}</h1>
        <p className='mt-2'>{t('subtitle')}</p>
      </div>
      <div className='mt-10 grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-8'>
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
