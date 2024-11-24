import { fetchGraphql } from '@/services/graphqlCrud';
import { BrandsFilterResponseType } from '@/types/getBrandsFilter';
import { getLocale } from 'next-intl/server';
import BrandFilter from '../UI/products/sidebar/BrandFilter';
import MenuSidebar from './MenuSidebar';
import {
  // CategoriesData,
  CategorySidebarType
} from '@/types/getCategoriesFilter';
// import { useMyContext } from '@/context/Store';
import AsideClient from './AsideClient';

//  brands(locale: "${locale ?? 'en'}", filters: { products: { id: { not: null }}}) {

async function FilterSidebar({
  categoriesData
}: {
  categoriesData: {
    categories: {
      data: CategorySidebarType[];
    };
  };
}) {
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

  return (
    <AsideClient>
      {categoriesData?.categories?.data && (
        <MenuSidebar data={categoriesData.categories.data} />
      )}

      {brandsData && brandsData.brands.data && (
        <BrandFilter data={brandsData.brands.data} />
      )}
    </AsideClient>
  );
}

export default FilterSidebar;
