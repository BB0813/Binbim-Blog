import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ChevronUp, Hash } from 'lucide-react';
import { useArchive } from '@/hooks/useArchive';
import { formatDate } from '@/lib/utils';

const Archive: React.FC = () => {
  const { 
    archiveData, 
    stats, 
    loading, 
    error, 
    scrollToYear, 
    getYearList 
  } = useArchive();
  
  // 处理加载状态
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-8"></div>
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-4">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                <div className="space-y-3 ml-8">
                  {[1, 2].map(j => (
                    <div key={j} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  // 处理错误状态
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            加载归档数据失败
          </h2>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }
  
  const yearList = getYearList();

  return (
    <div className='max-w-4xl mx-auto px-4 py-8'>
      <header className='mb-8'>
        <div className='flex items-center mb-4'>
          <Calendar className='w-8 h-8 text-blue-600 dark:text-blue-400 mr-3' />
          <h1 className='text-3xl font-bold'>文章归档</h1>
        </div>
        <p className='text-gray-600 dark:text-gray-400'>
          按时间顺序浏览所有文章，共 {stats.totalPosts} 篇
        </p>
      </header>
      
      {/* 快速导航 */}
      {yearList.length > 1 && (
        <div className='mb-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md'>
          <div className='flex items-center mb-3'>
            <Hash className='w-4 h-4 text-gray-500 mr-2' />
            <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
              快速导航
            </span>
          </div>
          <div className='flex flex-wrap gap-2'>
            {yearList.map(year => (
              <button
                key={year}
                onClick={() => scrollToYear(year)}
                className='px-3 py-1 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors'
              >
                {year}年
              </button>
            ))}
          </div>
        </div>
      )}

      <div className='space-y-8'>
        {archiveData.map(yearData => {
          const totalPostsInYear = yearData.months.reduce((sum, month) => sum + month.posts.length, 0);
          
          return (
            <section key={yearData.year} id={`year-${yearData.year}`} className='relative'>
              {/* 年份标题 */}
              <div className='sticky top-4 z-10 mb-6'>
                <div className='inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg'>
                  <Calendar className='w-4 h-4 mr-2' />
                  <span className='font-semibold'>{yearData.year}</span>
                  <span className='ml-2 text-blue-200'>
                    ({totalPostsInYear}篇)
                  </span>
                </div>
              </div>

              {/* 按月分组的文章列表 */}
              <div className='space-y-6 ml-8'>
                {yearData.months.map(monthData => (
                  <div key={`${yearData.year}-${monthData.month}`} className='space-y-4'>
                    {/* 月份标题 */}
                    <div className='flex items-center mb-4'>
                      <div className='w-2 h-2 bg-blue-400 rounded-full mr-3'></div>
                      <h3 className='text-lg font-medium text-gray-700 dark:text-gray-300'>
                        {monthData.month}月
                        <span className='ml-2 text-sm text-gray-500'>({monthData.posts.length}篇)</span>
                      </h3>
                    </div>
                    
                    {/* 文章列表 */}
                    {monthData.posts.map((post, index) => (
                      <article
                        key={post.slug}
                        className='relative pl-8 pb-6 border-l-2 border-gray-200 dark:border-gray-700 last:border-l-0'
                      >
                        {/* 时间线圆点 */}
                        <div className='absolute -left-2 top-2 w-4 h-4 bg-blue-600 rounded-full border-2 border-white dark:border-gray-900'></div>

                        {/* 文章内容 */}
                        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow'>
                          <div className='flex items-start justify-between mb-2'>
                            <h2 className='text-lg font-semibold flex-1'>
                              <Link
                                to={`/post/${post.slug}`}
                                className='text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300'
                              >
                                {post.title}
                              </Link>
                            </h2>
                            <span className='px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-sm ml-4 whitespace-nowrap'>
                              {post.category}
                            </span>
                          </div>

                          {/* 文章摘要 */}
                          {post.excerpt && (
                            <p className='text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2'>
                              {post.excerpt}
                            </p>
                          )}

                          <div className='flex items-center text-sm text-gray-500 dark:text-gray-400'>
                            <Calendar className='w-4 h-4 mr-1' />
                            <time dateTime={post.date}>
                              {formatDate(post.date, 'MM月dd日')}
                            </time>
                            <span className='mx-2'>•</span>
                            <Clock className='w-4 h-4 mr-1' />
                            <span>{post.readingTime} 分钟阅读</span>
                            
                            {/* 标签 */}
                            {post.tags.length > 0 && (
                              <>
                                <span className='mx-2'>•</span>
                                <div className='flex items-center gap-1'>
                                  {post.tags.slice(0, 2).map(tag => (
                                    <span
                                      key={tag}
                                      className='px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs'
                                    >
                                      #{tag}
                                    </span>
                                  ))}
                                  {post.tags.length > 2 && (
                                    <span className='text-xs text-gray-400'>+{post.tags.length - 2}</span>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* 统计信息 */}
      <div className='mt-12 pt-8 border-t border-gray-200 dark:border-gray-700'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 text-center'>
          <div className='p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
            <div className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
              {stats.totalPosts}
            </div>
            <div className='text-sm text-gray-600 dark:text-gray-400'>
              文章总数
            </div>
          </div>
          <div className='p-4 bg-green-50 dark:bg-green-900/20 rounded-lg'>
            <div className='text-2xl font-bold text-green-600 dark:text-green-400'>
              {stats.totalYears}
            </div>
            <div className='text-sm text-gray-600 dark:text-gray-400'>
              活跃年份
            </div>
          </div>
          <div className='p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg'>
            <div className='text-2xl font-bold text-purple-600 dark:text-purple-400'>
              {stats.averageReadingTime}
            </div>
            <div className='text-sm text-gray-600 dark:text-gray-400'>
              平均阅读时长(分钟)
            </div>
          </div>
          <div className='p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg'>
            <div className='text-2xl font-bold text-orange-600 dark:text-orange-400'>
              {stats.averagePostsPerYear}
            </div>
            <div className='text-sm text-gray-600 dark:text-gray-400'>
              年均文章数
            </div>
          </div>
        </div>
        
        {/* 最新和最旧文章信息 */}
        {(stats.newestPost || stats.oldestPost) && (
          <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-4'>
            {stats.newestPost && (
              <div className='p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'>
                <h4 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  最新文章
                </h4>
                <Link
                  to={`/post/${stats.newestPost.slug}`}
                  className='text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium'
                >
                  {stats.newestPost.title}
                </Link>
                <p className='text-xs text-gray-500 mt-1'>
                  {formatDate(stats.newestPost.date, 'yyyy年MM月dd日')}
                </p>
              </div>
            )}
            {stats.oldestPost && (
              <div className='p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'>
                <h4 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  最早文章
                </h4>
                <Link
                  to={`/post/${stats.oldestPost.slug}`}
                  className='text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium'
                >
                  {stats.oldestPost.title}
                </Link>
                <p className='text-xs text-gray-500 mt-1'>
                  {formatDate(stats.oldestPost.date, 'yyyy年MM月dd日')}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* 回到顶部按钮 */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className='fixed bottom-8 right-8 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50'
        aria-label='回到顶部'
      >
        <ChevronUp className='w-5 h-5' />
      </button>
    </div>
  );
};

export default Archive;
