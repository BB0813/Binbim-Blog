import React, { useState } from 'react';
import { 
  AdjustmentsHorizontalIcon,
  FolderIcon,
  TagIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

/**
 * 筛选选项接口
 */
export interface FilterOption {
  name: string;
  count: number;
  selected?: boolean;
}

/**
 * 搜索筛选器属性接口
 */
export interface SearchFiltersProps {
  categories?: FilterOption[];
  tags?: FilterOption[];
  selectedCategories?: string[];
  selectedTags?: string[];
  onCategoryChange?: (categories: string[]) => void;
  onTagChange?: (tags: string[]) => void;
  onClear?: () => void;
  className?: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

/**
 * 搜索筛选器组件
 * 提供分类、标签等筛选功能
 */
const SearchFilters: React.FC<SearchFiltersProps> = ({
  categories = [],
  tags = [],
  selectedCategories = [],
  selectedTags = [],
  onCategoryChange,
  onTagChange,
  onClear,
  className = '',
  collapsible = true,
  defaultExpanded = false
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);
  
  const maxVisibleItems = 5;
  
  // 处理分类选择
  const handleCategoryToggle = (categoryName: string) => {
    const newSelected = selectedCategories.includes(categoryName)
      ? selectedCategories.filter(c => c !== categoryName)
      : [...selectedCategories, categoryName];
    
    onCategoryChange?.(newSelected);
  };
  
  // 处理标签选择
  const handleTagToggle = (tagName: string) => {
    const newSelected = selectedTags.includes(tagName)
      ? selectedTags.filter(t => t !== tagName)
      : [...selectedTags, tagName];
    
    onTagChange?.(newSelected);
  };
  
  // 清除所有筛选
  const handleClearAll = () => {
    onClear?.();
  };
  
  // 检查是否有活动筛选
  const hasActiveFilters = selectedCategories.length > 0 || selectedTags.length > 0;
  
  // 如果没有筛选选项，不显示组件
  if (categories.length === 0 && tags.length === 0) {
    return null;
  }
  
  const FilterContent = () => (
    <div className="space-y-6">
      {/* 分类筛选 */}
      {categories.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
            <FolderIcon className="w-4 h-4 mr-1" />
            分类
            {selectedCategories.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                {selectedCategories.length}
              </span>
            )}
          </h4>
          <div className="space-y-2">
            {categories
              .slice(0, showAllCategories ? undefined : maxVisibleItems)
              .map((category) => (
                <FilterCheckbox
                  key={category.name}
                  label={category.name}
                  count={category.count}
                  checked={selectedCategories.includes(category.name)}
                  onChange={() => handleCategoryToggle(category.name)}
                />
              ))}
            
            {categories.length > maxVisibleItems && (
              <button
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center"
              >
                {showAllCategories ? (
                  <>
                    <ChevronUpIcon className="w-4 h-4 mr-1" />
                    显示更少
                  </>
                ) : (
                  <>
                    <ChevronDownIcon className="w-4 h-4 mr-1" />
                    显示更多 ({categories.length - maxVisibleItems})
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* 标签筛选 */}
      {tags.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
            <TagIcon className="w-4 h-4 mr-1" />
            标签
            {selectedTags.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                {selectedTags.length}
              </span>
            )}
          </h4>
          <div className="space-y-2">
            {tags
              .slice(0, showAllTags ? undefined : maxVisibleItems)
              .map((tag) => (
                <FilterCheckbox
                  key={tag.name}
                  label={tag.name}
                  count={tag.count}
                  checked={selectedTags.includes(tag.name)}
                  onChange={() => handleTagToggle(tag.name)}
                />
              ))}
            
            {tags.length > maxVisibleItems && (
              <button
                onClick={() => setShowAllTags(!showAllTags)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center"
              >
                {showAllTags ? (
                  <>
                    <ChevronUpIcon className="w-4 h-4 mr-1" />
                    显示更少
                  </>
                ) : (
                  <>
                    <ChevronDownIcon className="w-4 h-4 mr-1" />
                    显示更多 ({tags.length - maxVisibleItems})
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* 清除筛选 */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleClearAll}
            className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <XMarkIcon className="w-4 h-4 mr-1" />
            清除所有筛选
          </button>
        </div>
      )}
    </div>
  );
  
  if (collapsible) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
        {/* 筛选器头部 */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-t-lg"
        >
          <div className="flex items-center">
            <AdjustmentsHorizontalIcon className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
            <span className="font-medium text-gray-900 dark:text-white">筛选器</span>
            {hasActiveFilters && (
              <span className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                {selectedCategories.length + selectedTags.length}
              </span>
            )}
          </div>
          {isExpanded ? (
            <ChevronUpIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          )}
        </button>
        
        {/* 筛选器内容 */}
        {isExpanded && (
          <div className="px-4 pb-4">
            <FilterContent />
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className={`p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="flex items-center mb-4">
        <AdjustmentsHorizontalIcon className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
        <span className="font-medium text-gray-900 dark:text-white">筛选器</span>
        {hasActiveFilters && (
          <span className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
            {selectedCategories.length + selectedTags.length}
          </span>
        )}
      </div>
      <FilterContent />
    </div>
  );
};

/**
 * 筛选复选框属性接口
 */
interface FilterCheckboxProps {
  label: string;
  count: number;
  checked: boolean;
  onChange: () => void;
}

/**
 * 筛选复选框组件
 */
const FilterCheckbox: React.FC<FilterCheckboxProps> = ({
  label,
  count,
  checked,
  onChange
}) => {
  return (
    <label className="flex items-center cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mr-3 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 focus:ring-2"
      />
      <div className="flex-1 flex items-center justify-between">
        <span className={`text-sm transition-colors ${
          checked 
            ? 'text-blue-700 dark:text-blue-300 font-medium' 
            : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white'
        }`}>
          {label}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
          ({count})
        </span>
      </div>
    </label>
  );
};

export default SearchFilters;