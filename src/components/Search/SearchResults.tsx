import React from 'react';
import { Link } from 'react-router-dom';
import {
  ClockIcon,
  TagIcon,
  FolderIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { type HighlightedPost } from '@/utils/searchEngine';
import { formatDate } from '@/lib/utils';
import { Empty } from '@/components';

/**
 * 搜索结果属性接口
 */
export interface SearchResultsProps {
  posts: HighlightedPost[];
  loading?: boolean;
  error?: string | null;
  query?: string;
  total?: number;
  searchTime?: number;
  onRetry?: () => void;
  className?: string;
  showRelevanceScore?: boolean;
  showMatchedFields?: boolean;
  compact?: boolean;
}

/**
 * 搜索结果组件
 * 展示搜索到的文章列表
 */
const SearchResults: React.FC<SearchResultsProps> = ({
  posts,
  loading = false,
  error = null,
  query = '',
  total,
  searchTime,
  onRetry,
  className = '',
  showRelevanceScore = true,
  showMatchedFields = true,
  compact = false,
}) => {
  // 加载状态
  if (loading) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
        <span className='ml-3 text-gray-600 dark:text-gray-400'>搜索中...</span>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className='text-red-600 dark:text-red-400 mb-4'>
          <svg
            className='w-12 h-12 mx-auto mb-2'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z'
            />
          </svg>
          <div className='text-lg font-medium mb-1'>搜索出错了</div>
          <div className='text-sm'>{error}</div>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
          >
            重试
          </button>
        )}
      </div>
    );
  }

  // 空结果状态
  if (posts.length === 0) {
    return (
      <div className={className}>
        <Empty
          title='没有找到相关文章'
          description={
            query ? `没有找到包含 "${query}" 的文章` : '尝试使用不同的关键词'
          }
          action={
            <div className='mt-4 space-y-2'>
              <div className='text-sm text-gray-500 dark:text-gray-400'>
                搜索建议：
              </div>
              <ul className='text-sm text-gray-600 dark:text-gray-300 space-y-1'>
                <li>• 检查拼写是否正确</li>
                <li>• 尝试使用更通用的关键词</li>
                <li>• 使用不同的关键词组合</li>
                <li>• 减少搜索词的数量</li>
              </ul>
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div className={className}>
      {/* 搜索统计 */}
      {(total !== undefined || searchTime !== undefined) && (
        <div className='mb-6 text-sm text-gray-600 dark:text-gray-400'>
          {total !== undefined && (
            <span>
              找到{' '}
              <span className='font-medium text-gray-900 dark:text-white'>
                {total}
              </span>{' '}
              个结果
            </span>
          )}
          {searchTime !== undefined && (
            <span className='ml-2'>({searchTime.toFixed(2)}ms)</span>
          )}
        </div>
      )}

      {/* 搜索结果列表 */}
      <div className={`space-y-${compact ? '4' : '6'}`}>
        {posts.map((post, index) => (
          <SearchResultItem
            key={post.slug}
            post={post}
            index={index}
            showRelevanceScore={showRelevanceScore}
            showMatchedFields={showMatchedFields}
            compact={compact}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * 搜索结果项属性接口
 */
interface SearchResultItemProps {
  post: HighlightedPost;
  index: number;
  showRelevanceScore: boolean;
  showMatchedFields: boolean;
  compact: boolean;
}

/**
 * 搜索结果项组件
 */
const SearchResultItem: React.FC<SearchResultItemProps> = ({
  post,
  index,
  showRelevanceScore,
  showMatchedFields,
  compact,
}) => {
  return (
    <article
      className={`
      bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 
      hover:shadow-md transition-shadow
      ${compact ? 'p-4' : 'p-6'}
    `}
    >
      <div className='flex items-start justify-between'>
        <div className='flex-1'>
          {/* 文章标题 */}
          <div className='mb-3'>
            <Link to={`/post/${post.slug}`} className='block group'>
              <h2
                className={`
                  font-semibold text-gray-900 dark:text-white 
                  group-hover:text-blue-600 dark:group-hover:text-blue-400 
                  transition-colors
                  ${compact ? 'text-lg' : 'text-xl'}
                `}
                dangerouslySetInnerHTML={{
                  __html: post.highlightedTitle || post.title,
                }}
              />
            </Link>
          </div>

          {/* 文章元信息 */}
          <div
            className={`flex items-center text-sm text-gray-500 dark:text-gray-400 ${compact ? 'mb-2' : 'mb-3'}`}
          >
            <ClockIcon className='w-4 h-4 mr-1' />
            <time dateTime={post.date}>{formatDate(post.date)}</time>

            <span className='mx-2'>•</span>
            <FolderIcon className='w-4 h-4 mr-1' />
            <Link
              to={`/category/${post.category}`}
              className='hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
            >
              {post.category}
            </Link>

            <span className='mx-2'>•</span>
            <span>{post.readingTime} 分钟阅读</span>

            {/* 相关度评分 */}
            {showRelevanceScore && post.relevanceScore && (
              <>
                <span className='mx-2'>•</span>
                <div className='flex items-center text-blue-600 dark:text-blue-400'>
                  <StarIcon className='w-4 h-4 mr-1' />
                  <span>相关度: {post.relevanceScore}%</span>
                </div>
              </>
            )}
          </div>

          {/* 文章摘要 */}
          {!compact && (
            <p
              className='text-gray-600 dark:text-gray-300 mb-4 line-clamp-3'
              dangerouslySetInnerHTML={{
                __html: post.highlightedExcerpt || post.excerpt,
              }}
            />
          )}

          {/* 标签 */}
          {post.tags.length > 0 && (
            <div
              className={`flex flex-wrap gap-2 ${compact ? 'mb-2' : 'mb-3'}`}
            >
              {post.tags.slice(0, compact ? 3 : 5).map(tag => (
                <Link
                  key={tag}
                  to={`/tag/${tag}`}
                  className='inline-flex items-center px-2 py-1 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors'
                >
                  <TagIcon className='w-3 h-3 mr-1' />
                  {tag}
                </Link>
              ))}
              {post.tags.length > (compact ? 3 : 5) && (
                <span className='text-xs text-gray-500 dark:text-gray-400'>
                  +{post.tags.length - (compact ? 3 : 5)} 更多
                </span>
              )}
            </div>
          )}

          {/* 匹配字段 */}
          {showMatchedFields && post.matchedFields.length > 0 && (
            <div className='text-xs text-gray-500 dark:text-gray-400'>
              <span className='font-medium'>匹配字段:</span>
              <span className='ml-1'>
                {post.matchedFields.map((field, index) => (
                  <span key={field}>
                    {field === 'title' && '标题'}
                    {field === 'content' && '内容'}
                    {field === 'tags' && '标签'}
                    {field === 'category' && '分类'}
                    {index < post.matchedFields.length - 1 && ', '}
                  </span>
                ))}
              </span>
            </div>
          )}
        </div>

        {/* 结果序号 */}
        <div className='ml-4 flex-shrink-0'>
          <div className='w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-400'>
            {index + 1}
          </div>
        </div>
      </div>
    </article>
  );
};

export default SearchResults;
