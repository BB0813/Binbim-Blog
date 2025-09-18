import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, ChartBarIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import type { Category, Post } from '@/types/content';
import { Badge } from '@/components/UI';

interface CategoryStatsProps {
  category: Category;
  posts: Post[];
  className?: string;
}

const CategoryStats: React.FC<CategoryStatsProps> = ({ category: _category, posts, className = '' }) => {
  // 计算统计信息
  const totalPosts = posts.length;
  const latestPost = posts.length > 0 ? posts[0] : null;
  // const _oldestPost = posts.length > 0 ? posts[posts.length - 1] : null;
  
  // 计算平均阅读时间
  const averageReadingTime = posts.length > 0 
    ? Math.round(posts.reduce((sum, post) => sum + post.readingTime, 0) / posts.length)
    : 0;
  
  // 按月份统计文章数量
  const monthlyStats = posts.reduce((acc, post) => {
    const date = new Date(post.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    acc[monthKey] = (acc[monthKey] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const monthlyEntries = Object.entries(monthlyStats)
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 6); // 显示最近6个月
  
  // 获取所有标签及其使用频率
  const tagStats = posts.reduce((acc, post) => {
    post.tags.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);
  
  const popularTags = Object.entries(tagStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8); // 显示前8个热门标签

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <ChartBarIcon className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
        分类统计
      </h3>
      
      {/* 基础统计 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {totalPosts}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">总文章数</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {averageReadingTime}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">平均阅读时间(分钟)</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {popularTags.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">相关标签</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {monthlyEntries.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">活跃月份</div>
        </div>
      </div>
      
      {/* 最新文章 */}
      {latestPost && (
        <div className="mb-6">
          <h4 className="text-md font-medium mb-3 flex items-center">
            <DocumentTextIcon className="w-4 h-4 mr-2" />
            最新文章
          </h4>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <Link 
              to={`/post/${latestPost.slug}`}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
            >
              {latestPost.title}
            </Link>
            <div className="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-400">
              <CalendarIcon className="w-4 h-4 mr-1" />
              <time dateTime={latestPost.date}>
                {new Date(latestPost.date).toLocaleDateString('zh-CN')}
              </time>
              <span className="mx-2">•</span>
              <span>{latestPost.readingTime} 分钟阅读</span>
            </div>
          </div>
        </div>
      )}
      
      {/* 热门标签 */}
      {popularTags.length > 0 && (
        <div className="mb-6">
          <h4 className="text-md font-medium mb-3">热门标签</h4>
          <div className="flex flex-wrap gap-2">
            {popularTags.map(([tag, count]) => (
              <Link
                key={tag}
                to={`/tag/${encodeURIComponent(tag)}`}
                className="group flex items-center"
              >
                <Badge 
                  variant="secondary" 
                  className="group-hover:bg-blue-100 dark:group-hover:bg-blue-900 transition-colors"
                >
                  #{tag}
                  <span className="ml-1 text-xs opacity-75">({count})</span>
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {/* 月度发布趋势 */}
      {monthlyEntries.length > 0 && (
        <div>
          <h4 className="text-md font-medium mb-3">发布趋势</h4>
          <div className="space-y-2">
            {monthlyEntries.map(([month, count]) => {
              const [year, monthNum] = month.split('-');
              const monthName = new Date(parseInt(year), parseInt(monthNum) - 1).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long'
              });
              
              const maxCount = Math.max(...monthlyEntries.map(([, c]) => c));
              const percentage = (count / maxCount) * 100;
              
              return (
                <div key={month} className="flex items-center">
                  <div className="w-20 text-sm text-gray-600 dark:text-gray-400">
                    {monthName.replace('年', '/').replace('月', '')}
                  </div>
                  <div className="flex-1 mx-3">
                    <div className="bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-8 text-sm font-medium text-gray-900 dark:text-white">
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

export default CategoryStats;