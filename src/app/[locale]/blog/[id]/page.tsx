import { fetchGraphql } from '@/services/graphqlCrud';
import {
  ArticlesIdsType,
  ArticlesResponseType
} from '@/types/articlesResponseTypes';
import { unstable_setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

type Props = {
  params: { id: string; locale: string };
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

  console.log('Fetched blog IDs:', allBlogIds);
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

  console.log('Generated static blog params:', params);

  return params;
}

const getBlogByIdQuery = (id: string) => `
  {
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
              }
            }
          }
        }
      }
    }
  }
`;

// export const revalidate = 60; // Revalidate after 60 seconds

export default async function BlogPostPage({
  params: { id, locale }
}: Props) {
  unstable_setRequestLocale(locale);
  const { data, error } = await fetchGraphql(getBlogByIdQuery(id));
  // console.log(JSON.stringify(data));

  if (error || !data?.blog?.data) {
    return notFound(); // 404 if no data
  }

  const blog = data.blog.data;

  return (
    <div className='container mx-auto'>
      <h1 className='text-3xl font-bold'>{blog.attributes.title}</h1>
      <p className='mt-2'>
        By {blog.attributes.author.data.attributes.name}
      </p>
      {/* <div className='mt-5'>{blog.attributes.content}</div> */}
    </div>
  );
}
