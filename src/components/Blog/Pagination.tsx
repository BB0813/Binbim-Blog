import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Button } from '@/components/UI';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  showFirstLast?: boolean;
  maxVisiblePages?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
  showFirstLast: _showFirstLast = true,
  maxVisiblePages = 5,
}) => {
  if (totalPages <= 1) {
    return null;
  }

  // 计算显示的页码范围
  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);

    // 调整范围以确保显示足够的页码
    if (endPage - startPage + 1 < maxVisiblePages) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      } else {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
    }

    // 添加第一页和省略号
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('...');
      }
    }

    // 添加中间页码
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // 添加最后一页和省略号
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  const handlePageClick = (page: number | string) => {
    if (typeof page === 'number' && page !== currentPage) {
      onPageChange(page);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <nav
      className={`flex items-center justify-center space-x-2 ${className}`}
      aria-label='分页导航'
    >
      {/* 上一页按钮 */}
      <Button
        variant='outline'
        size='sm'
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className='flex items-center gap-1'
        aria-label='上一页'
      >
        <ChevronLeftIcon className='w-4 h-4' />
        <span className='hidden sm:inline'>上一页</span>
      </Button>

      {/* 页码按钮 */}
      <div className='flex items-center space-x-1'>
        {visiblePages.map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className='px-3 py-2 text-gray-500 dark:text-gray-400'
              >
                ...
              </span>
            );
          }

          const pageNumber = page as number;
          const isCurrentPage = pageNumber === currentPage;

          return (
            <Button
              key={pageNumber}
              variant={isCurrentPage ? 'primary' : 'outline'}
              size='sm'
              onClick={() => handlePageClick(pageNumber)}
              className={`min-w-[40px] ${
                isCurrentPage
                  ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              aria-label={`第 ${pageNumber} 页`}
              aria-current={isCurrentPage ? 'page' : undefined}
            >
              {pageNumber}
            </Button>
          );
        })}
      </div>

      {/* 下一页按钮 */}
      <Button
        variant='outline'
        size='sm'
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className='flex items-center gap-1'
        aria-label='下一页'
      >
        <span className='hidden sm:inline'>下一页</span>
        <ChevronRightIcon className='w-4 h-4' />
      </Button>

      {/* 页码信息 */}
      <div className='hidden md:flex items-center ml-4 text-sm text-gray-500 dark:text-gray-400'>
        第 {currentPage} 页，共 {totalPages} 页
      </div>
    </nav>
  );
};

export default Pagination;
