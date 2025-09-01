import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, ClockIcon, TagIcon } from 'lucide-react';
import { Card } from '@/components/UI';

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  tags: string[];
  coverImage?: string;
  readingTime: number;
}

interface ArticleListProps {
  articles: Article[];
  loading?: boolean;
  className?: string;
}

const ArticleList: React.FC<ArticleListProps> = ({
  articles,
  loading = false,
  className = '',
}) => {
  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        {[...Array(3)].map((_, index) => (
          <Card key={index} className='p-6'>
            <div className='animate-pulse'>
              <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4'></div>
              <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2'></div>
              <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4'></div>
              <div className='flex space-x-4'>
                <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-20'></div>
                <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-16'></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className='text-gray-500 dark:text-gray-400'>
          <p className='text-lg mb-2'>暂无文章</p>
          <p className='text-sm'>敬请期待更多精彩内容</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {articles.map(article => (
        <Card
          key={article.slug}
          className='p-6 hover:shadow-lg transition-shadow duration-200'
        >
          <article>
            {/* 文章标题 */}
            <h2 className='text-xl font-bold mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
              <Link to={`/post/${article.slug}`}>{article.title}</Link>
            </h2>

            {/* 文章摘要 */}
            <p className='text-gray-600 dark:text-gray-300 mb-4 line-clamp-3'>
              {article.excerpt}
            </p>

            {/* 文章元信息 */}
            <div className='flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4'>
              <div className='flex items-center gap-1'>
                <CalendarIcon className='w-4 h-4' />
                <time dateTime={article.date}>
                  {new Date(article.date).toLocaleDateString('zh-CN')}
                </time>
              </div>

              <div className='flex items-center gap-1'>
                <ClockIcon className='w-4 h-4' />
                <span>{article.readingTime} 分钟阅读</span>
              </div>

              <div className='flex items-center gap-1'>
                <TagIcon className='w-4 h-4' />
                <Link
                  to={`/category/${article.category}`}
                  className='hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
                >
                  {article.category}
                </Link>
              </div>
            </div>

            {/* 标签 */}
            {article.tags.length > 0 && (
              <div className='flex flex-wrap gap-2'>
                {article.tags.slice(0, 3).map(tag => (
                  <Link
                    key={tag}
                    to={`/tag/${tag}`}
                    className='px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-colors'
                  >
                    #{tag}
                  </Link>
                ))}
                {article.tags.length > 3 && (
                  <span className='px-2 py-1 text-gray-500 dark:text-gray-400 text-xs'>
                    +{article.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </article>
        </Card>
      ))}
    </div>
  );
};

export default ArticleList;
