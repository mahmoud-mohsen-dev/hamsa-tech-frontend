import { fetchGraphql } from '@/services/graphqlCrud';
import { ArticlesResponseType } from '@/types/articlesResponseTypes';
import { unstable_setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

type Props = {
  params: { id: string; locale: string };
};

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

export const revalidate = 60; // Revalidate after 60 seconds

export default async function BlogPostPage({
  params: { id, locale }
}: Props) {
  unstable_setRequestLocale(locale);
  const { data, error } = await fetchGraphql(getBlogByIdQuery(id));
  console.log(JSON.stringify(data));

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
