import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, XMarkIcon, FunnelIcon } from '@heroicons/react/24/outline';
import type { Tag } from '@/types/content';

interface TagFilterProps {
  tags: Tag[];
  selectedTags: string[];
  searchQuery: string;
  onTagsChange: (tags: string[]) => void;
  onSearchChange: (query: string) => void;
  onClear: () => void;
  className?: string;
}

const TagFilter: React.FC<TagFilterProps> = ({
  tags,
  selectedTags,
  searchQuery,
  onTagsChange,
  onSearchChange,
  onClear,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filteredTags, setFilteredTags] = useState<Tag[]>(tags);

  // 根据搜索查询过滤标签
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = tags.filter(tag =>
        tag.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTags(filtered);
    } else {
      setFilteredTags(tags);
    }
  }, [tags, searchQuery]);

  const handleTagToggle = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      onTagsChange(selectedTags.filter(t => t !== tagName));
    } else {
      onTagsChange([...selectedTags, tagName]);
    }
  };

  const hasActiveFilters = selectedTags.length > 0 || searchQuery.trim().length > 0;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${className}`}>
      {/* 标题和控制按钮 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <FunnelIcon className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2" />
          <h3 className="text-lg font-semibold">标签筛选</h3>
          {hasActiveFilters && (
            <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-xs">
              {selectedTags.length + (searchQuery.trim() ? 1 : 0)} 个筛选条件
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <button
              onClick={onClear}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 flex items-center"
            >
              <XMarkIcon className="w-4 h-4 mr-1" />
              清除
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            {isExpanded ? '收起' : '展开'}
          </button>
        </div>
      </div>

      {/* 搜索框 */}
      <div className="relative mb-4">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="搜索标签..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 已选择的标签 */}
      {selectedTags.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            已选择 ({selectedTags.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map(tagName => {
              const tag = tags.find(t => t.name === tagName);
              return (
                <button
                  key={tagName}
                  onClick={() => handleTagToggle(tagName)}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                >
                  {tagName}
                  {tag && (
                    <span className="ml-1 text-xs opacity-75">({tag.usageCount})</span>
                  )}
                  <XMarkIcon className="w-3 h-3 ml-1" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 标签列表 */}
      <div className={`${isExpanded ? 'block' : 'hidden'}`}>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          所有标签 ({filteredTags.length})
        </h4>
        <div className="max-h-64 overflow-y-auto">
          <div className="flex flex-wrap gap-2">
            {filteredTags.map(tag => {
              const isSelected = selectedTags.includes(tag.name);
              return (
                <button
                  key={tag.slug}
                  onClick={() => handleTagToggle(tag.name)}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm transition-colors ${
                    isSelected
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {tag.name}
                  <span className="ml-1 text-xs opacity-75">({tag.usageCount})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 快速标签（收起状态下显示热门标签） */}
      {!isExpanded && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            热门标签
          </h4>
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 8).map(tag => {
              const isSelected = selectedTags.includes(tag.name);
              return (
                <button
                  key={tag.slug}
                  onClick={() => handleTagToggle(tag.name)}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm transition-colors ${
                    isSelected
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {tag.name}
                  <span className="ml-1 text-xs opacity-75">({tag.usageCount})</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 无结果提示 */}
      {searchQuery && filteredTags.length === 0 && (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          <MagnifyingGlassIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>未找到匹配的标签</p>
        </div>
      )}
    </div>
  );
};

export default TagFilter;