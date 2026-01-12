'use client';

import { Pagination, PaginationProps } from 'antd';
import { ITEMS_PER_PAGE } from '../lib/constants';

interface MoviesPaginationProps {
  query: string;
  currentPage: number;
  totalResults: number;
  pageSize?: number;
}

export function MoviesPagination({
  query,
  currentPage,
  totalResults,
  pageSize = ITEMS_PER_PAGE,
}: MoviesPaginationProps) {
  const totalPages = Math.ceil(totalResults / pageSize);

  if (totalPages <= 1) {
    return null;
  }

  const handleChange: PaginationProps['onChange'] = (page) => {
    window.location.href = `/?q=${encodeURIComponent(query)}&page=${page}`;
  };

  return (
    <div className="flex justify-center pt-8">
      <Pagination
        current={currentPage}
        total={totalResults}
        pageSize={pageSize}
        onChange={handleChange}
        showSizeChanger={false}
        showQuickJumper
      />
    </div>
  );
}
