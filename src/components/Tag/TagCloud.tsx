import React from 'react';
import { Link } from 'react-router-dom';
import { TagIcon } from '@heroicons/react/24/outline';
import type { Tag } from '@/types/content';

interface TagCloudProps {
  tags: Tag[];
  maxTags?: number;
  className?: string;
  showCount?: boolean;
  variant?: 'default' | 'compact' | 'colorful';
}

const TagCloud: React.FC<TagCloudProps> = ({
  tags,
  maxTags = 20,
  className = '',
  showCount = true,
  variant = 'default'
}) => {
  if (tags.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <TagIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
        <p className="text-gray-500 dark:text-gray-400">暂无标签</p>
      </div>
    );
  }

  // 计算标签大小权重
  const maxUsage = Math.max(...tags.map(tag => tag.usageCount));
  const minUsage = Math.min(...tags.map(tag => tag.usageCount));
  const usageRange = maxUsage - minUsage || 1;

  const getTagSize = (usageCount: number): string => {
    const normalizedSize = (usageCount - minUsage) / usageRange;
    
    if (variant === 'compact') {
      return normalizedSize > 0.7 ? 'text-sm' : 'text-xs';
    }
    
    if (normalizedSize > 0.8) return 'text-xl';
    if (normalizedSize > 0.6) return 'text-lg';
    if (normalizedSize > 0.4) return 'text-base';
    if (normalizedSize > 0.2) return 'text-sm';
    return 'text-xs';
  };

  const getTagColor = (index: number, usageCount: number): string => {
    if (variant === 'colorful') {
      const colors = [
        'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200',
        'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200',
        'bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-200',
        'bg-pink-100 text-pink-800 hover:bg-pink-200 dark:bg-pink-900 dark:text-pink-200',
        'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-200',
        'bg-indigo-100 text-indigo-800 hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-200',
        'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-200',
        'bg-teal-100 text-teal-800 hover:bg-teal-200 dark:bg-teal-900 dark:text-teal-200'
      ];
      return colors[index % colors.length];
    }
    
    const normalizedSize = (usageCount - minUsage) / usageRange;
    if (normalizedSize > 0.6) {
      return 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200';
    }
    return 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300';
  };

  const displayTags = tags.slice(0, maxTags);

  if (variant === 'compact') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {displayTags.map((tag, index) => (
          <Link
            key={tag.slug}
            to={`/tag/${tag.slug}`}
            className={`inline-flex items-center px-2 py-1 rounded-full transition-colors ${
              getTagColor(index, tag.usageCount)
            } ${getTagSize(tag.usageCount)}`}
          >
            <TagIcon className="w-3 h-3 mr-1" />
            {tag.name}
            {showCount && (
              <span className="ml-1 opacity-75">({tag.usageCount})</span>
            )}
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="flex flex-wrap gap-3 justify-center items-center">
        {displayTags.map((tag, index) => {
          const tagSize = getTagSize(tag.usageCount);
          const tagColor = getTagColor(index, tag.usageCount);
          
          return (
            <Link
              key={tag.slug}
              to={`/tag/${tag.slug}`}
              className={`inline-flex items-center px-3 py-2 rounded-full transition-all duration-200 hover:scale-105 hover:shadow-md ${
                tagColor
              } ${tagSize} font-medium`}
              title={`${tag.name} (${tag.usageCount} 篇文章)`}
            >
              <TagIcon className="w-4 h-4 mr-1.5" />
              {tag.name}
              {showCount && (
                <span className="ml-2 text-xs opacity-75 bg-white bg-opacity-20 px-1.5 py-0.5 rounded-full">
                  {tag.usageCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>
      
      {tags.length > maxTags && (
        <div className="text-center mt-6">
          <Link
            to="/tag"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
          >
            <TagIcon className="w-4 h-4 mr-1" />
            查看全部 {tags.length} 个标签
          </Link>
        </div>
      )}
    </div>
  );
};

export default TagCloud;