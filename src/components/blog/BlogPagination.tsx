'use client';

import { useRouter } from '@/navigation';
import { Pagination } from 'antd';

type BlogPaginationProps = {
  total: number;
  currentPage: number;
  pageSize: number;
};

const BlogPagination = ({
  total,
  currentPage,
  pageSize
}: BlogPaginationProps) => {
  const router = useRouter();

  const handlePageChange = (page: number) => {
    router.push(`/blog/page/${page}`);
  };

  return (
    <Pagination
      current={currentPage}
      total={total}
      pageSize={pageSize}
      onChange={handlePageChange}
      align='center'
      style={{ marginTop: 40 }}
    />
  );
};

export default BlogPagination;
