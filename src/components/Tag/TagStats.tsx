import React from 'react';
import { Link } from 'react-router-dom';
import {
  TagIcon,
  DocumentTextIcon,
  CalendarIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import type { Tag, Post } from '@/types/content';

interface TagStatsProps {
  tag: Tag;
  posts: Post[];
  className?: string;
}

const TagStats: React.FC<TagStatsProps> = ({ tag, posts, className = '' }) => {
  // 计算统计数据
  const totalPosts = posts.length;
  const totalReadingTime = posts.reduce(
    (sum, post) => sum + post.readingTime,
    0
  );
  const averageReadingTime =
    totalPosts > 0 ? Math.round(totalReadingTime / totalPosts) : 0;

  // 获取最新文章
  const latestPost = posts.length > 0 ? posts[0] : null;

  // 获取相关分类
  const categories = [...new Set(posts.map(post => post.category))];

  // 获取相关标签（除当前标签外）
  const relatedTags = [
    ...new Set(posts.flatMap(post => post.tags.filter(t => t !== tag.name))),
  ].slice(0, 5);

  // 按月份统计文章数量
  const monthlyStats = posts.reduce(
    (acc, post) => {
      const date = new Date(post.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      acc[monthKey] = (acc[monthKey] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const recentMonths = Object.entries(monthlyStats)
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 6);

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${className}`}
    >
      <div className='flex items-center mb-6'>
        <TagIcon className='w-6 h-6 text-blue-600 dark:text-blue-400 mr-2' />
        <h3 className='text-lg font-semibold'>标签统计</h3>
      </div>

      {/* 基础统计 */}
      <div className='grid grid-cols-2 gap-4 mb-6'>
        <div className='text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
          <DocumentTextIcon className='w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-1' />
          <div className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
            {totalPosts}
          </div>
          <div className='text-sm text-gray-600 dark:text-gray-400'>篇文章</div>
        </div>

        <div className='text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg'>
          <CalendarIcon className='w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-1' />
          <div className='text-2xl font-bold text-green-600 dark:text-green-400'>
            {averageReadingTime}
          </div>
          <div className='text-sm text-gray-600 dark:text-gray-400'>
            平均阅读时间
          </div>
        </div>
      </div>

      {/* 最新文章 */}
      {latestPost && (
        <div className='mb-6'>
          <h4 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            最新文章
          </h4>
          <Link
            to={`/post/${latestPost.slug}`}
            className='block p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors'
          >
            <div className='font-medium text-gray-900 dark:text-gray-100 line-clamp-2 mb-1'>
              {latestPost.title}
            </div>
            <div className='text-sm text-gray-500 dark:text-gray-400'>
              {new Date(latestPost.date).toLocaleDateString('zh-CN')}
            </div>
          </Link>
        </div>
      )}

      {/* 相关分类 */}
      {categories.length > 0 && (
        <div className='mb-6'>
          <h4 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            相关分类
          </h4>
          <div className='flex flex-wrap gap-2'>
            {categories.map(category => (
              <Link
                key={category}
                to={`/category/${category}`}
                className='px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded text-sm hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors'
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 相关标签 */}
      {relatedTags.length > 0 && (
        <div className='mb-6'>
          <h4 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            相关标签
          </h4>
          <div className='flex flex-wrap gap-2'>
            {relatedTags.map(relatedTag => (
              <Link
                key={relatedTag}
                to={`/tag/${relatedTag}`}
                className='px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors'
              >
                #{relatedTag}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 月度趋势 */}
      {recentMonths.length > 0 && (
        <div>
          <div className='flex items-center mb-3'>
            <ChartBarIcon className='w-4 h-4 text-gray-600 dark:text-gray-400 mr-1' />
            <h4 className='text-sm font-medium text-gray-700 dark:text-gray-300'>
              月度发布趋势
            </h4>
          </div>
          <div className='space-y-2'>
            {recentMonths.map(([month, count]) => {
              const maxCount = Math.max(...recentMonths.map(([, c]) => c));
              const percentage = (count / maxCount) * 100;

              return (
                <div key={month} className='flex items-center'>
                  <div className='text-xs text-gray-500 dark:text-gray-400 w-16'>
                    {month}
                  </div>
                  <div className='flex-1 mx-2'>
                    <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
                      <div
                        className='bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300'
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className='text-xs text-gray-600 dark:text-gray-400 w-6 text-right'>
                    {count}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TagStats;
