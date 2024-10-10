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
                  brand {
                    data {
                        attributes {
                            slug
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
  sortBy: string | null = null,
  brandCheckedList: string[] | null = null,
  sliderValues: number[] | null = null,
  rateCheckedList: number[] | null = null
) {
  // console.log('brandCheckedList', brandCheckedList);
  // console.log('sliderValues', sliderValues);
  // console.log('rateCheckedList', rateCheckedList);
  // Build the query based on the filters
  let queryArgs = `locale: "${locale ?? 'en'}", pagination: { page: ${page ?? 1}, pageSize: ${pageSize ?? 20} }, sort: ${sortBy && sortBy !== 'featured' ? `["${sortBy}"]` : `[]`} `;

  let filtersValues = '';
  if (category && !subcategory) {
    // category filter
    filtersValues += `{ sub_category : {category: {slug: {eq : "${category}"}}} } `;
  }
  if (category && subcategory) {
    // Sub-category with category filter
    filtersValues += `{ sub_category : {slug: {eq : "${subcategory}"}} } { sub_category : {category: {slug: {eq : "${category}"}}} } `;
  }
  if (brandCheckedList && brandCheckedList?.length >= 0) {
    // Brand filter
    filtersValues += `{ brand: {slug: {in: ${JSON.stringify(brandCheckedList)}}} } `;
  }
  if (sliderValues && sliderValues?.length === 2) {
    // Price filter
    filtersValues += `{ final_product_price: { between: [${sliderValues[0]}, ${sliderValues[1]}]} } `;
  }
  if (rateCheckedList && rateCheckedList?.length >= 0) {
    if (rateCheckedList.length === 0) {
      filtersValues += `{
          or: [
            { and: [{ average_reviews: { eq: 0 } }] }
          ]
        }`;
    } else {
      const orFilters = rateCheckedList.map((rate) =>
        rate === 0 ?
          `{ and: [{ average_reviews: { eq: 0 } }] }`
        : `{ and: [{ average_reviews: { gt: ${Number(rate) - 1} } }, { average_reviews: { lte: ${Number(rate)} } }] }`
      );
      filtersValues += `{ or: [${orFilters.join(', ')}] } `;
    }
  }
  if (filtersValues) {
    queryArgs += `, filters: { and: [${filtersValues} ]}`;
  }
  // console.log(queryArgs);

  // Fetch products based on the filters
  const response = (await fetchGraphqlClient(
    getProductsQuery(queryArgs)
  )) as ProductsResponseType;
  // console.log(response);
  return response;
}
