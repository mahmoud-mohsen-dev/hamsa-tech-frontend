import CustomBreadcrumb from '@/components/products/CustomBreadcrumb';
import FilterSidebar from '@/components/products/FilterSidebar';
import ProductsWrapper from '@/components/products/ProductsWrapper';
import { fetchGraphql } from '@/services/graphqlCrud';
import {
  CategoriesData,
  CategorySidebarType
} from '@/types/getCategoriesFilter';
import { HomeOutlined, ProductOutlined } from '@ant-design/icons';
import {
  getTranslations,
  unstable_setRequestLocale
} from 'next-intl/server';
import { FaSitemap } from 'react-icons/fa6';
import { PiSecurityCameraDuotone } from 'react-icons/pi';

interface PropsType {
  params: { locale: string };
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const getItems = (
  allProductsText: string,
  category: string | undefined,
  subCategory: string | undefined = undefined,
  categoriesData: CategorySidebarType[]
) => {
  const items = [
    {
      href: '/',
      title: <HomeOutlined />
    },
    {
      href: '/products',
      title: (
        <>
          <ProductOutlined />
          <span>{allProductsText}</span>
        </>
      )
    }
  ];
  // console.log('categoriesData');
  // console.log(categoriesData);
  // console.log(category);
  // console.log(
  //   categoriesData.find(
  //     (categoryItem) =>
  //       categoryItem?.attributes?.slug &&
  //       categoryItem.attributes.slug === category
  //   )?.attributes.name ?? ''
  // );
  const categoryFoundName = categoriesData.find(
    (categoryItem) =>
      categoryItem?.attributes?.slug &&
      categoryItem.attributes.slug === category
  );

  if (category && !subCategory) {
    items.push({
      href: `/products?${new URLSearchParams({ category })}`,
      title: (
        <div className='flex items-center gap-2'>
          <FaSitemap />
          <span>{categoryFoundName?.attributes?.name ?? ''}</span>
        </div>
      )
    });

    return items;
  }

  if (category && subCategory) {
    items.push({
      href: `/products?${new URLSearchParams({ category })}`,
      title: (
        <div className='flex items-center gap-2'>
          <FaSitemap />
          <span>{categoryFoundName?.attributes?.name ?? ''}</span>
        </div>
      )
    });
    items.push({
      href: `/products?${new URLSearchParams({ category, 'sub-category': subCategory })}`,
      title: (
        <div className='flex items-center gap-2'>
          <PiSecurityCameraDuotone />
          <span>
            {categoryFoundName?.attributes?.sub_categories?.data.find(
              (subCategoryItem) =>
                subCategoryItem.attributes.slug === subCategory
            )?.attributes.name ?? ''}
          </span>
        </div>
      )
    });
    return items;
  }

  return items;
};

const Products = async ({
  params: { locale },
  searchParams
}: PropsType) => {
  const t = await getTranslations({
    locale: locale,
    namespace: 'ProductsPage'
  });
  const allProductsText = t('breadcrumb.all');
  // Enable static rendering
  unstable_setRequestLocale(locale);

  const { data: categoriesData, error: categoriesError } =
    (await fetchGraphql(`{
        categories(locale: "${locale ?? 'en'}", sort: "order:asc") {
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
  // // console.log(JSON.stringify(categoriesSidebarData));
  // console.log(categoriesSidebarData);
  // console.log('++++++++++++++++++++');

  if (categoriesSidebarData === null || categoriesError) {
    console.error('Error fetching categories data');
    console.log(categoriesError);
  }

  const category =
    Array.isArray(searchParams?.category) ?
      searchParams?.category[0]
    : searchParams?.category || undefined;
  const subCategory =
    Array.isArray(searchParams['sub-category']) ?
      searchParams['sub-category'][0]
    : searchParams['sub-category'] || undefined;

  return (
    // <ConfigAntThemes>
    <section className='content container'>
      <CustomBreadcrumb
        items={getItems(
          allProductsText,
          category,
          subCategory,
          categoriesSidebarData
        )}
        locale={locale}
      />
      <div
        className={`mt-3 grid ${locale === 'ar' ? 'lg:grid-cols-[250px_1fr] 2xl:ml-8' : 'lg:grid-cols-[240px_1fr] 2xl:mr-8'} gap-5`}
      >
        <FilterSidebar categoriesData={categoriesData} />
        <ProductsWrapper
        // productsData={productsData?.products?.data ?? null}
        />
        {/* )} */}
      </div>
    </section>
    // </ConfigAntThemes>
  );
};

export default Products;
