'use client';
import { useRouter } from '@/navigation';
import { Pagination } from 'antd';
import type { PaginationProps } from 'antd';
import { useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';

function BlogPagination() {
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const onPaginationChange: PaginationProps['onChange'] = (
    pageNumber: number
  ) => {
    // Update the URL to reflect the page number
    const url = new URL(window.location.href);
    url.searchParams.set('page', pageNumber.toString());
    router.push(url.toString());
  };

  return (
    <Pagination
      align='center'
      className={locale === 'ar' ? 'pagination-in-arabic' : ''}
      defaultCurrent={1}
      current={
        //   (
        //     Number(paramsPage) > 0 &&
        //     completeProductsApiData?.meta?.pagination?.pageCount &&
        //     Number(paramsPage) <=
        //       completeProductsApiData.meta.pagination.pageCount
        //   ) ?
        //     Number(paramsPage)
        //   : (function () {
        //       setTimeout(() => {
        //         handleParamsPage(1);
        //       }, 2500);
        //       return 1;
        //     })()
        1
      }
      total={
        // data?.blogs.meta?.pagination?.pageCount ?
        //   data.blogs.meta.pagination.pageCount
        // : 1
        50
      }
      pageSize={10}
      onChange={onPaginationChange}
      style={{ marginTop: 40 }}
    />
  );
}

export default BlogPagination;
