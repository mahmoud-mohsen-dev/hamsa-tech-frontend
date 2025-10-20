'use client';
import { useRouter } from '@/navigation';
import { ConfigProvider, Pagination } from 'antd';
import { useLocale } from 'next-intl';

function ControlPagination({
  page,
  pageSize,
  total,
  pageName,
  setPageSize
}: {
  page: number;
  pageSize: number;
  total: number;
  pageName: string;
  setPageSize?: (size: number) => void;
}) {
  // console.log('total', total);
  const locale = useLocale();
  const router = useRouter();

  const onPaginationChange = (value: number) => {
    if (value) {
      router.push(`/downloads/${pageName}/page_${value}`);
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: 'var(--font-inter)',
          colorPrimary: '#17457c',
          borderRadius: 8,
          lineWidth: 1
        }
      }}
    >
      <Pagination
        align='center'
        className={locale === 'ar' ? 'pagination-in-arabic' : ''}
        defaultCurrent={1}
        current={page ?? 1}
        total={total ?? 0}
        pageSize={pageSize}
        onChange={onPaginationChange}
        pageSizeOptions={[10, 20, 50, 100]}
        showSizeChanger={false}
        onShowSizeChange={(current, size) => {
          console.log('current', current);
          console.log('size', size);
          if (setPageSize) {
            setPageSize(size);
          }
        }}
        style={{ marginTop: 40 }}
      />
    </ConfigProvider>
  );
}

export default ControlPagination;
