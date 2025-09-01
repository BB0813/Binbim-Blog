import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, TrendingUpIcon } from 'lucide-react';
import { Card } from '@/components/UI';

interface LatestArticle {
  slug: string;
  title: string;
  date: string;
  readingTime: number;
  category: string;
  isHot?: boolean;
}

interface LatestArticlesProps {
  articles: LatestArticle[];
  title?: string;
  maxItems?: number;
  showCategory?: boolean;
  showDate?: boolean;
  showReadingTime?: boolean;
  className?: string;
  loading?: boolean;
}

const LatestArticles: React.FC<LatestArticlesProps> = ({
  articles,
  title = '最新文章',
  maxItems = 5,
  showCategory = true,
  showDate = true,
  showReadingTime = false,
  className = '',
  loading = false,
}) => {
  const displayArticles = articles.slice(0, maxItems);

  if (loading) {
    return (
      <Card className={`p-6 ${className}`}>
        <h3 className='text-lg font-bold mb-4 text-gray-900 dark:text-white'>
          {title}
        </h3>
        <div className='space-y-4'>
          {[...Array(3)].map((_, index) => (
            <div key={index} className='animate-pulse'>
              <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2'></div>
              <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2'></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (displayArticles.length === 0) {
    return (
      <Card className={`p-6 ${className}`}>
        <h3 className='text-lg font-bold mb-4 text-gray-900 dark:text-white'>
          {title}
        </h3>
        <div className='text-center py-8 text-gray-500 dark:text-gray-400'>
          <p>暂无文章</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-6 ${className}`}>
      <h3 className='text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2'>
        <TrendingUpIcon className='w-5 h-5 text-blue-600 dark:text-blue-400' />
        {title}
      </h3>

      <div className='space-y-4'>
        {displayArticles.map((article, index) => (
          <article key={article.slug} className='group'>
            <div className='flex items-start gap-3'>
              {/* 序号 */}
              <div
                className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  index < 3
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                {index + 1}
              </div>

              <div className='flex-1 min-w-0'>
                {/* 文章标题 */}
                <h4 className='font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight'>
                  <Link
                    to={`/post/${article.slug}`}
                    className='block'
                    title={article.title}
                  >
                    <span className='line-clamp-2'>
                      {article.title}
                      {article.isHot && (
                        <span className='inline-flex items-center ml-2 px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'>
                          热门
                        </span>
                      )}
                    </span>
                  </Link>
                </h4>

                {/* 文章元信息 */}
                <div className='flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400'>
                  {showDate && (
                    <div className='flex items-center gap-1'>
                      <CalendarIcon className='w-3 h-3' />
                      <time dateTime={article.date}>
                        {new Date(article.date).toLocaleDateString('zh-CN', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </time>
                    </div>
                  )}

                  {showCategory && (
                    <>
                      {showDate && <span>•</span>}
                      <Link
                        to={`/category/${article.category}`}
                        className='hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
                      >
                        {article.category}
                      </Link>
                    </>
                  )}

                  {showReadingTime && (
                    <>
                      {(showDate || showCategory) && <span>•</span>}
                      <span>{article.readingTime}分钟</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* 查看更多链接 */}
      {articles.length > maxItems && (
        <div className='mt-4 pt-4 border-t border-gray-200 dark:border-gray-700'>
          <Link
            to='/archive'
            className='text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors'
          >
            查看全部文章 →
          </Link>
        </div>
      )}
    </Card>
  );
};

export default LatestArticles;
