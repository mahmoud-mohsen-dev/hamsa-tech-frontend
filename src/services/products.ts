import { ProductsResponseType } from '@/types/getProducts';
import { fetchGraphqlClient } from './graphqlCrud';

export async function fetchProducts(
  category: string | null = null,
  subcategory: string | null = null,
  locale: string
) {
  // Build the query based on the filters
  let queryArgs = `locale: "${locale ?? 'en'}"`;

  if (category && !subcategory) {
    queryArgs += `, filters: {sub_category : {category: {slug: {eq : "${category}"}}}}`;
  }
  if (category && subcategory) {
    queryArgs += `, filters: {sub_category : {slug: {eq : "${subcategory}"}}, and:[{sub_category : {category: {slug: {eq : "${category}"}}}}]}`;
  }
  console.log(queryArgs);

  // Fetch products based on the filters
  const response = (await fetchGraphqlClient(
    `{
        products(${queryArgs}) {
            data {
            id
            attributes {
                updatedAt
                name
                price
                sale_price
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
            }
            }
        }
    }`
  )) as ProductsResponseType;
  console.log(response);
  return response;
}
