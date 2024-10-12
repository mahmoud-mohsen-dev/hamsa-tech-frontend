import { fetchGraphql } from '@/services/graphqlCrud';

const getBlogPageCountQuery = `
  query {
    blogs(pageSize: 10) {
      meta {
        pagination {
          total
        }
      }
    }
  }
`;

export async function generateStaticParams() {
  const { data } = await fetchGraphql(getBlogPageCountQuery);
  const totalPages = data.blogs.meta.pagination.total;
  console.log(totalPages);

  return Array.from({ length: totalPages }, (_, i) => ({
    page: (i + 1).toString()
  }));
}
