import React from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  TagIcon,
  FolderIcon,
  EyeIcon,
  HeartIcon,
} from 'lucide-react';
import { Badge } from '@/components/UI';

interface ArticleMetaProps {
  title: string;
  author?: {
    name: string;
    avatar?: string;
    url?: string;
  };
  publishDate: string;
  updateDate?: string;
  readingTime: number;
  category: string;
  tags: string[];
  views?: number;
  likes?: number;
  className?: string;
  layout?: 'horizontal' | 'vertical';
  showAvatar?: boolean;
}

const ArticleMeta: React.FC<ArticleMetaProps> = ({
  title,
  author,
  publishDate,
  updateDate,
  readingTime,
  category,
  tags,
  views,
  likes,
  className = '',
  layout = 'vertical',
  showAvatar = true,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const MetaItem: React.FC<{
    icon: React.ReactNode;
    children: React.ReactNode;
    className?: string;
  }> = ({ icon, children, className: itemClassName = '' }) => (
    <div
      className={`flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 ${itemClassName}`}
    >
      {icon}
      {children}
    </div>
  );

  return (
    <div className={`${className}`}>
      {/* 文章标题 */}
      <h1 className='text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight'>
        {title}
      </h1>

      {/* 元信息容器 */}
      <div
        className={`
        ${
          layout === 'horizontal'
            ? 'flex flex-wrap items-center gap-4 md:gap-6'
            : 'space-y-4'
        }
      `}
      >
        {/* 作者信息 */}
        {author && (
          <div className='flex items-center gap-3'>
            {showAvatar && author.avatar && (
              <img
                src={author.avatar}
                alt={`${author.name}的头像`}
                className='w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700'
                onError={e => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20avatar%20portrait%20of%20${encodeURIComponent(author.name)}%2C%20friendly%20expression%2C%20clean%20background&image_size=square`;
                }}
              />
            )}
            <div className='flex flex-col'>
              <div className='flex items-center gap-1'>
                <UserIcon className='w-4 h-4' />
                {author.url ? (
                  <Link
                    to={author.url}
                    className='font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
                  >
                    {author.name}
                  </Link>
                ) : (
                  <span className='font-medium text-gray-900 dark:text-white'>
                    {author.name}
                  </span>
                )}
              </div>
              <span className='text-xs text-gray-500 dark:text-gray-400'>
                作者
              </span>
            </div>
          </div>
        )}

        {/* 发布日期 */}
        <MetaItem icon={<CalendarIcon className='w-4 h-4' />}>
          <time dateTime={publishDate}>{formatDate(publishDate)}</time>
        </MetaItem>

        {/* 更新日期 */}
        {updateDate && updateDate !== publishDate && (
          <MetaItem icon={<CalendarIcon className='w-4 h-4' />}>
            <span>更新于 </span>
            <time dateTime={updateDate}>{formatDate(updateDate)}</time>
          </MetaItem>
        )}

        {/* 阅读时间 */}
        <MetaItem icon={<ClockIcon className='w-4 h-4' />}>
          <span>{readingTime} 分钟阅读</span>
        </MetaItem>

        {/* 分类 */}
        <MetaItem icon={<FolderIcon className='w-4 h-4' />}>
          <Link
            to={`/category/${category}`}
            className='hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
          >
            {category}
          </Link>
        </MetaItem>

        {/* 浏览量 */}
        {views !== undefined && (
          <MetaItem icon={<EyeIcon className='w-4 h-4' />}>
            <span>{formatNumber(views)} 次浏览</span>
          </MetaItem>
        )}

        {/* 点赞数 */}
        {likes !== undefined && (
          <MetaItem icon={<HeartIcon className='w-4 h-4' />}>
            <span>{formatNumber(likes)} 个赞</span>
          </MetaItem>
        )}
      </div>

      {/* 标签 */}
      {tags.length > 0 && (
        <div className='mt-6'>
          <div className='flex items-center gap-2 mb-3'>
            <TagIcon className='w-4 h-4 text-gray-500 dark:text-gray-400' />
            <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
              标签
            </span>
          </div>
          <div className='flex flex-wrap gap-2'>
            {tags.map(tag => (
              <Link key={tag} to={`/tag/${tag}`} className='inline-block'>
                <Badge
                  variant='secondary'
                  className='hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer'
                >
                  #{tag}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 分隔线 */}
      <div className='mt-8 border-b border-gray-200 dark:border-gray-700'></div>
    </div>
  );
};

export default ArticleMeta;
