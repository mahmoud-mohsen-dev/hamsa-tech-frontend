import { ProductsResponseType } from '@/types/getProducts';
import { fetchGraphqlClient } from './graphqlCrud';

export const getProductsQuery = (queryArgs: string) => {
  return `{
        products(${queryArgs}) {
            data {
              id
              attributes {
                  updatedAt
                  name
                  price
                  sale_price
                  final_product_price
                  stock
                  sub_category {
                      data {
                          attributes {
                              name
                          }
                      }
                  }
                  image_thumbnail {
                      data {
                          attributes {
                              url
                              alternativeText
                          }
                      }
                  }
                  average_reviews
                  total_reviews
                  locale
                  localizations {
                      data {
                          id
                          attributes {
                              locale
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
    }`;
};

export async function fetchProducts(
  category: string | null = null,
  subcategory: string | null = null,
  locale: string,
  page: number | null = null,
  pageSize: number | null = null,
  sortBy: string | null = null
) {
  console.log('sortBy', sortBy);
  // Build the query based on the filters
  let queryArgs = `locale: "${locale ?? 'en'}", pagination: { page: ${page ?? 1}, pageSize: ${pageSize ?? 20} }, sort: ${sortBy && sortBy !== 'featured' ? `["${sortBy}"]` : `[]`}`;

  if (category && !subcategory) {
    queryArgs += `, filters: {sub_category : {category: {slug: {eq : "${category}"}}}}`;
  }
  if (category && subcategory) {
    queryArgs += `, filters: {sub_category : {slug: {eq : "${subcategory}"}}, and:[{sub_category : {category: {slug: {eq : "${category}"}}}}]}`;
  }
  // console.log(queryArgs);

  // Fetch products based on the filters
  const response = (await fetchGraphqlClient(
    getProductsQuery(queryArgs)
  )) as ProductsResponseType;
  // console.log(response);
  return response;
}
