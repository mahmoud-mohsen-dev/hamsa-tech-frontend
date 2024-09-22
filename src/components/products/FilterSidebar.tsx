import { fetchGraphql } from '@/services/graphqlCrud';
import { BrandsFilterResponseType } from '@/types/getBrandsFilter';
import { getLocale, getTranslations } from 'next-intl/server';
import BrandFilter from '../UI/products/sidebar/BrandFilter';
import MenuSidebar from './MenuSidebar';
import { CategoriesData } from '@/types/getCategoriesFilter';

//  brands(locale: "${locale ?? 'en'}", filters: { products: { id: { not: null }}}) {

async function FilterSidebar() {
  const locale = await getLocale();
  const t = await getTranslations({
    locale: locale,
    namespace: 'ProductsPage'
  });
  const { data: brandsData, error: brandsError } =
    (await fetchGraphql(`{
        brands(locale: "${locale ?? 'en'}") {
            data {
                attributes {
                    name
                    slug
                }
            }
        }
    }`)) as BrandsFilterResponseType;
  console.log('--------------------------');
  console.log(JSON.stringify(brandsData.brands));
  console.log('--------------------------');

  if (brandsError) {
    console.error('Error fetching brands data');
    console.log(brandsError);
  }

  const { data: categoriesData, error: categoriesError } =
    (await fetchGraphql(`{
        categories(locale: "en") {
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
  console.log('++++++++++++++++++++');
  console.log(JSON.stringify(categoriesSidebarData));
  console.log(categoriesError);
  console.log('++++++++++++++++++++');

  if (categoriesSidebarData === null || categoriesError) {
    console.error('Error fetching categories data');
    console.log(categoriesError);
  }

  return (
    <aside
      style={
        locale === 'ar' ?
          {
            borderLeft: '1px solid rgba(5, 5, 5, 0.06)'
          }
        : {
            borderRight: '1px solid rgba(5, 5, 5, 0.06)'
          }
      }
    >
      <h3 className='ml-[24px] w-fit text-lg text-black-medium'>
        {t('filtersSidebar.categoriesTitle')}
      </h3>
      {categoriesSidebarData && (
        <MenuSidebar data={categoriesSidebarData} />
      )}

      {brandsData.brands.data && (
        <BrandFilter data={brandsData.brands.data} />
      )}
    </aside>
  );
}

export default FilterSidebar;
