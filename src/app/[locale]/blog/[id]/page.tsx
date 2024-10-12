import { fetchGraphql } from '@/services/graphqlCrud';
import { ArticlesResponseType } from '@/types/articlesResponseTypes';
// import ArticleDetail from '@/components/blog/ArticleDetail';
import { unstable_setRequestLocale } from 'next-intl/server';

export const revalidate = 60; // Revalidate every 60 seconds

type Props = {
  params: { id: string; locale: string };
};

const getBlogQuery = (id: string) => `
  query {
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

export async function generateStaticParams() {
  const { data } = await fetchGraphql(`{ blogs { data { id } } }`);
  return data.blogs.data.map((blog: any) => ({ id: blog.id }));
}

export async function BlogPage({ params: { locale, id } }: Props) {
  unstable_setRequestLocale(locale);
  const { data, error } = await fetchGraphql(getBlogQuery(id));
  if (error || !data?.blog?.data) {
    throw new Error('Blog not found');
  }

  return (
    <div>
      <h1>{data.blog.data.attributes.title}</h1>
      <p>
        By {data.blog.data.attributes.author.data.attributes.name}
      </p>
      <div>{data.blog.data.attributes.content}</div>
    </div>
  );
}

export default BlogPage;
