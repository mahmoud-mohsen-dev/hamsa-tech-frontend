import { fetchGraphql } from '@/services/graphqlCrud';
import { BrandsFilterResponseType } from '@/types/getBrandsFilter';
import { getLocale } from 'next-intl/server';
import BrandFilter from '../UI/products/sidebar/BrandFilter';
import MenuSidebar from './MenuSidebar';
import { CategoriesData } from '@/types/getCategoriesFilter';
// import { useMyContext } from '@/context/Store';
import AsideClient from './AsideClient';

//  brands(locale: "${locale ?? 'en'}", filters: { products: { id: { not: null }}}) {

async function FilterSidebar() {
  const locale = await getLocale();

  const { data: brandsData, error: brandsError } =
    (await fetchGraphql(`{
        brands(locale: "${locale ?? 'en'}", pagination: { pageSize: 100 }) {
            data {
                attributes {
                    name
                    slug
                }
            }
        }
    }`)) as BrandsFilterResponseType;
  // console.log('--------------------------');
  // console.log(JSON.stringify(brandsData.brands));
  // console.log('--------------------------');

  if (brandsError) {
    console.error('Error fetching brands data');
    console.log(brandsError);
  }

  const { data: categoriesData, error: categoriesError } =
    (await fetchGraphql(`{
        categories(locale: "${locale ?? 'en'}") {
            data {
                id
                attributes {
                    name
                    slug
                    sub_categories {
                        data {
                            id
                            attributes {
                                name
                                slug
                            }
                        }
                    }
                }
            }
        }
    }`)) as CategoriesData;
  const categoriesSidebarData =
    categoriesData?.categories?.data || null;
  // console.log('++++++++++++++++++++');
  // console.log(JSON.stringify(categoriesSidebarData));
  // console.log(categoriesError);
  // console.log('++++++++++++++++++++');

  if (categoriesSidebarData === null || categoriesError) {
    console.error('Error fetching categories data');
    console.log(categoriesError);
  }

  return (
    <AsideClient>
      {categoriesSidebarData && (
        <MenuSidebar data={categoriesSidebarData} />
      )}

      {brandsData && brandsData.brands.data && (
        <BrandFilter data={brandsData.brands.data} />
      )}
    </AsideClient>
  );
}

export default FilterSidebar;
