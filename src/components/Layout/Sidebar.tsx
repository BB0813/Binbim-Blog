import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Tag, TrendingUp, Clock } from 'lucide-react';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  // 模拟数据
  const recentPosts = [
    {
      title: 'React 18 新特性详解',
      slug: 'react-18-features',
      date: '2024-01-15',
    },
    {
      title: 'TypeScript 最佳实践指南',
      slug: 'typescript-best-practices',
      date: '2024-01-10',
    },
    {
      title: 'Vite 构建优化技巧',
      slug: 'vite-optimization',
      date: '2024-01-05',
    },
  ];

  const popularTags = [
    { name: 'React', count: 8 },
    { name: 'TypeScript', count: 6 },
    { name: '前端开发', count: 5 },
    { name: 'Node.js', count: 4 },
    { name: 'Vite', count: 3 },
    { name: '工程化', count: 3 },
  ];

  const categories = [
    { name: '前端开发', count: 8, href: '/category/frontend' },
    { name: '后端开发', count: 5, href: '/category/backend' },
    { name: '工程化', count: 4, href: '/category/engineering' },
    { name: '个人思考', count: 3, href: '/category/thoughts' },
  ];

  return (
    <aside className={`space-y-6 ${className}`}>
      {/* 最新文章 */}
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6'>
        <div className='flex items-center mb-4'>
          <Clock className='w-5 h-5 text-blue-600 dark:text-blue-400 mr-2' />
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
            最新文章
          </h3>
        </div>
        <div className='space-y-3'>
          {recentPosts.map(post => (
            <div
              key={post.slug}
              className='border-b border-gray-200 dark:border-gray-700 last:border-b-0 pb-3 last:pb-0'
            >
              <Link
                to={`/post/${post.slug}`}
                className='block hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
              >
                <h4 className='text-sm font-medium text-gray-900 dark:text-white mb-1 line-clamp-2'>
                  {post.title}
                </h4>
                <p className='text-xs text-gray-500 dark:text-gray-400'>
                  {new Date(post.date).toLocaleDateString('zh-CN')}
                </p>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* 分类 */}
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6'>
        <div className='flex items-center mb-4'>
          <Calendar className='w-5 h-5 text-blue-600 dark:text-blue-400 mr-2' />
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
            分类
          </h3>
        </div>
        <div className='space-y-2'>
          {categories.map(category => (
            <Link
              key={category.name}
              to={category.href}
              className='flex items-center justify-between p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group'
            >
              <span className='text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400'>
                {category.name}
              </span>
              <span className='text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded-full'>
                {category.count}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* 热门标签 */}
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6'>
        <div className='flex items-center mb-4'>
          <Tag className='w-5 h-5 text-blue-600 dark:text-blue-400 mr-2' />
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
            热门标签
          </h3>
        </div>
        <div className='flex flex-wrap gap-2'>
          {popularTags.map(tag => (
            <Link
              key={tag.name}
              to={`/tag/${tag.name}`}
              className='inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-colors'
            >
              #{tag.name}
              <span className='ml-1 text-xs text-gray-500 dark:text-gray-400'>
                ({tag.count})
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* 统计信息 */}
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6'>
        <div className='flex items-center mb-4'>
          <TrendingUp className='w-5 h-5 text-blue-600 dark:text-blue-400 mr-2' />
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
            博客统计
          </h3>
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <div className='text-center'>
            <div className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
              24
            </div>
            <div className='text-sm text-gray-500 dark:text-gray-400'>
              文章总数
            </div>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold text-green-600 dark:text-green-400'>
              4
            </div>
            <div className='text-sm text-gray-500 dark:text-gray-400'>
              分类数量
            </div>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold text-purple-600 dark:text-purple-400'>
              12
            </div>
            <div className='text-sm text-gray-500 dark:text-gray-400'>
              标签数量
            </div>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold text-orange-600 dark:text-orange-400'>
              1.2k
            </div>
            <div className='text-sm text-gray-500 dark:text-gray-400'>
              总访问量
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
