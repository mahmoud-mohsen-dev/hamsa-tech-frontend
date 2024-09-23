import CustomBreadcrumb from '@/components/products/CustomBreadcrumb';
import FilterSidebar from '@/components/products/FilterSidebar';
import MenuSidebar from '@/components/products/MenuSidebar';
import ProductsWrapper from '@/components/products/ProductsWrapper';
import ConfigAntThemes from '@/components/Theme/ConfigAntThemes';
import ProductsContent from '@/components/UI/products/ProductsContent';
import BrandFilter from '@/components/UI/products/sidebar/BrandFilter';
import { fetchGraphql } from '@/services/graphqlCrud';
import { fetchProducts } from '@/services/products';
import { BrandsFilterResponseType } from '@/types/getBrandsFilter';
// import { serverfetchNavItems } from '@/services/navItemRequst';
// import { getProductsCategory } from '@/services/products';
import { HomeOutlined, ProductOutlined } from '@ant-design/icons';
import {
  getTranslations,
  unstable_setRequestLocale
} from 'next-intl/server';

interface PropsType {
  params: { locale: string };
}

const Products = async ({ params: { locale } }: PropsType) => {
  const t = await getTranslations({
    locale: locale,
    namespace: 'ProductsPage'
  });
  // Enable static rendering
  unstable_setRequestLocale(locale);
  const productsResponse = await fetchProducts(null, null, locale);
  const {
    data: {
      products: { data: productsData }
    },
    error: productsError
  } = productsResponse;

  // console.log(JSON.stringify(productsData));
  // console.log(JSON.stringify(productsError));

  return (
    // <ConfigAntThemes>
    <section className='content container'>
      <CustomBreadcrumb
        items={[
          {
            href: '/',
            title: <HomeOutlined />
          },
          {
            href: '/products',
            title: (
              <>
                <ProductOutlined />
                <span>{t('breadcrumb.all')}</span>
              </>
            )
          }
        ]}
      />
      <div className='mt-5 grid grid-cols-[270px_1fr] gap-10'>
        <FilterSidebar />
        {productsError === null && productsData !== null && (
          <ProductsWrapper data={productsData} />
        )}
      </div>
    </section>
    // </ConfigAntThemes>
  );
};

export default Products;
