import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon, FolderIcon } from '@heroicons/react/24/outline';
import { useCategories } from '@/hooks/useCategories';
import type { Category } from '@/types/content';

interface CategoryNavigationProps {
  currentCategory?: Category;
  className?: string;
}

const CategoryNavigation: React.FC<CategoryNavigationProps> = ({ 
  currentCategory, 
  className = '' 
}) => {
  const { categories, loading } = useCategories();
  // const { name: _name } = useParams<{ name: string }>();
  
  if (loading || categories.length === 0) {
    return null;
  }
  
  // 找到当前分类在列表中的位置
  const currentIndex = currentCategory 
    ? categories.findIndex(cat => cat.slug === currentCategory.slug)
    : -1;
  
  const prevCategory = currentIndex > 0 ? categories[currentIndex - 1] : null;
  const nextCategory = currentIndex < categories.length - 1 ? categories[currentIndex + 1] : null;
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <FolderIcon className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
        分类导航
      </h3>
      
      {/* 当前分类信息 */}
      {currentCategory && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
            当前分类
          </div>
          <div className="text-lg font-semibold text-blue-800 dark:text-blue-300">
            {currentCategory.name}
          </div>
          <div className="text-sm text-blue-600 dark:text-blue-400">
            {currentCategory.postCount} 篇文章
          </div>
        </div>
      )}
      
      {/* 上一个/下一个分类 */}
      {(prevCategory || nextCategory) && (
        <div className="space-y-3 mb-4">
          {prevCategory && (
            <Link
              to={`/category/${encodeURIComponent(prevCategory.name)}`}
              className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
            >
              <ChevronLeftIcon className="w-4 h-4 mr-2 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              <div className="flex-1">
                <div className="text-xs text-gray-500 dark:text-gray-400">上一个分类</div>
                <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {prevCategory.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {prevCategory.postCount} 篇文章
                </div>
              </div>
            </Link>
          )}
          
          {nextCategory && (
            <Link
              to={`/category/${encodeURIComponent(nextCategory.name)}`}
              className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
            >
              <div className="flex-1">
                <div className="text-xs text-gray-500 dark:text-gray-400">下一个分类</div>
                <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {nextCategory.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {nextCategory.postCount} 篇文章
                </div>
              </div>
              <ChevronRightIcon className="w-4 h-4 ml-2 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
            </Link>
          )}
        </div>
      )}
      
      {/* 所有分类快速导航 */}
      <div>
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          所有分类 ({categories.length})
        </div>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {categories.map(category => {
            const isActive = currentCategory?.slug === category.slug;
            return (
              <Link
                key={category.slug}
                to={`/category/${encodeURIComponent(category.name)}`}
                className={`block p-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-medium'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{category.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    isActive
                      ? 'bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                  }`}>
                    {category.postCount}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      
      {/* 返回分类列表 */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Link
          to="/category"
          className="flex items-center justify-center w-full p-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
        >
          <FolderIcon className="w-4 h-4 mr-2" />
          查看所有分类
        </Link>
      </div>
    </div>
  );
};

export default CategoryNavigation;