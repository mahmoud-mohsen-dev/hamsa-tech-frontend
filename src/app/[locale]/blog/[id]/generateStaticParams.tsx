import { fetchGraphql } from '@/services/graphqlCrud';

const getBlogPageCountQuery = (locale: string) => `
  {
    blogs(locale: "${locale}", pagination: { page: 1, pageSize: 100 }) {
        data {
            id
        }
    }
}`;

export async function generateStaticParams() {
  const { data: dataEn } = await fetchGraphql(
    getBlogPageCountQuery('en')
  );
  const { data: dataAr } = await fetchGraphql(
    getBlogPageCountQuery('ar')
  );
  const idsInEn = dataEn.blogs.data;
  const idsInAr = dataAr.blogs.data;
  const allPages = [...idsInAr, ...idsInEn];
  console.log(allPages.map((article) => ({ page: article.id })));
  return allPages.map((article) => ({ page: article.id }));
}
