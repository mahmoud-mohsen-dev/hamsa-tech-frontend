import CustomBreadcrumb from '@/components/products/CustomBreadcrumb';
import FilterSidebar from '@/components/products/FilterSidebar';
import ProductsWrapper from '@/components/products/ProductsWrapper';
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
  subCategory?: string | undefined
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
  if (category && !subCategory) {
    items.push({
      href: `/products?${new URLSearchParams({ category })}`,
      title: (
        <div className='flex items-center gap-2'>
          <FaSitemap />
          <span>{category ?? ''}</span>
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
          <span>{category ?? ''}</span>
        </div>
      )
    });
    items.push({
      href: `/products?${new URLSearchParams({ category, 'sub-category': subCategory })}`,
      title: (
        <div className='flex items-center gap-2'>
          <PiSecurityCameraDuotone />
          <span>{subCategory ?? ''}</span>
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
    <section className='content mb-[100px]'>
      <CustomBreadcrumb
        items={getItems(allProductsText, category, subCategory)}
        locale={locale}
      />
      <div
        className={`mt-5 grid ${locale === 'ar' ? 'lg:grid-cols-[284px_1fr]' : 'lg:grid-cols-[260px_1fr]'} gap-8`}
      >
        <FilterSidebar />
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
