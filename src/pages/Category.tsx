import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FolderIcon,
  DocumentTextIcon,
  CalendarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { useCategories, useCategoryPosts } from '@/hooks/useCategories';
import { Badge } from '@/components/UI';
import { CategoryStats, CategoryNavigation } from '@/components/Category';

const Category: React.FC = () => {
  const { name } = useParams<{ name: string }>();

  // 如果没有指定分类名称，显示所有分类列表
  if (!name) {
    return <CategoryList />;
  }

  // 显示特定分类的文章
  return <CategoryPosts categoryName={decodeURIComponent(name)} />;
};

// 分类列表组件
const CategoryList: React.FC = () => {
  const { categories, loading, error } = useCategories();

  if (loading) {
    return (
      <div className='max-w-4xl mx-auto px-4 py-8'>
        <div className='animate-pulse'>
          <div className='h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4'></div>
          <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8'></div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className='h-32 bg-gray-200 dark:bg-gray-700 rounded-lg'
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='max-w-4xl mx-auto px-4 py-8'>
        <div className='text-center py-12'>
          <h1 className='text-2xl font-bold mb-4 text-red-600 dark:text-red-400'>
            加载失败
          </h1>
          <p className='text-gray-600 dark:text-gray-400'>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto px-4 py-8'>
      <header className='mb-8'>
        <h1 className='text-3xl font-bold mb-4 flex items-center'>
          <FolderIcon className='w-8 h-8 mr-3 text-blue-600 dark:text-blue-400' />
          文章分类
        </h1>
        <p className='text-gray-600 dark:text-gray-400'>
          共有 {categories.length} 个分类
        </p>
      </header>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {categories.map(category => (
          <Link
            key={category.slug}
            to={`/category/${encodeURIComponent(category.name)}`}
            className='group block'
          >
            <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200 group-hover:scale-105'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
                  {category.name}
                </h3>
                <Badge variant='secondary'>{category.postCount}</Badge>
              </div>

              <p className='text-gray-600 dark:text-gray-300 text-sm mb-4'>
                {category.description}
              </p>

              <div className='flex items-center text-sm text-gray-500 dark:text-gray-400'>
                <DocumentTextIcon className='w-4 h-4 mr-1' />
                <span>{category.postCount} 篇文章</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {categories.length === 0 && (
        <div className='text-center py-12'>
          <FolderIcon className='w-16 h-16 mx-auto text-gray-400 mb-4' />
          <p className='text-gray-500 dark:text-gray-400 text-lg'>暂无分类</p>
        </div>
      )}
    </div>
  );
};

// 分类文章组件
interface CategoryPostsProps {
  categoryName: string;
}

const CategoryPosts: React.FC<CategoryPostsProps> = ({ categoryName }) => {
  const { posts, category, loading, error, totalPosts } =
    useCategoryPosts(categoryName);

  if (loading) {
    return (
      <div className='max-w-4xl mx-auto px-4 py-8'>
        <div className='animate-pulse'>
          <div className='h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4'></div>
          <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-8'></div>
          <div className='space-y-6'>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className='h-40 bg-gray-200 dark:bg-gray-700 rounded-lg'
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='max-w-4xl mx-auto px-4 py-8'>
        <div className='text-center py-12'>
          <h1 className='text-2xl font-bold mb-4 text-red-600 dark:text-red-400'>
            加载失败
          </h1>
          <p className='text-gray-600 dark:text-gray-400'>{error}</p>
          <Link
            to='/category'
            className='inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
          >
            返回分类列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-6xl mx-auto px-4 py-8'>
      {/* 面包屑导航 */}
      <nav className='mb-6'>
        <ol className='flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400'>
          <li>
            <Link
              to='/'
              className='hover:text-blue-600 dark:hover:text-blue-400'
            >
              首页
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link
              to='/category'
              className='hover:text-blue-600 dark:hover:text-blue-400'
            >
              分类
            </Link>
          </li>
          <li>/</li>
          <li className='text-gray-900 dark:text-white font-medium'>
            {category?.name || categoryName}
          </li>
        </ol>
      </nav>

      {/* 分类头部 */}
      <header className='mb-8'>
        <h1 className='text-3xl font-bold mb-4 flex items-center'>
          <FolderIcon className='w-8 h-8 mr-3 text-blue-600 dark:text-blue-400' />
          {category?.name || categoryName}
        </h1>

        <div className='flex items-center space-x-6 text-gray-600 dark:text-gray-400'>
          <div className='flex items-center'>
            <DocumentTextIcon className='w-5 h-5 mr-2' />
            <span>共 {totalPosts} 篇文章</span>
          </div>
          {category?.description && (
            <p className='text-sm'>{category.description}</p>
          )}
        </div>
      </header>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* 主内容区域 */}
        <div className='lg:col-span-2'>
          {/* 文章列表 */}
          <div className='space-y-6'>
            {posts.map(post => (
              <article
                key={post.slug}
                className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow'
              >
                <h2 className='text-xl font-semibold mb-2'>
                  <Link
                    to={`/post/${post.slug}`}
                    className='text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors'
                  >
                    {post.title}
                  </Link>
                </h2>

                <p className='text-gray-600 dark:text-gray-300 mb-4 line-clamp-3'>
                  {post.excerpt}
                </p>

                {/* 文章标签 */}
                {post.tags.length > 0 && (
                  <div className='flex flex-wrap gap-2 mb-4'>
                    {post.tags.map(tag => (
                      <Link
                        key={tag}
                        to={`/tag/${encodeURIComponent(tag)}`}
                        className='text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors'
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                )}

                {/* 文章元信息 */}
                <div className='flex items-center text-sm text-gray-500 dark:text-gray-400'>
                  <CalendarIcon className='w-4 h-4 mr-1' />
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString('zh-CN')}
                  </time>
                  <span className='mx-2'>•</span>
                  <ClockIcon className='w-4 h-4 mr-1' />
                  <span>{post.readingTime} 分钟阅读</span>
                </div>
              </article>
            ))}
          </div>

          {/* 空状态 */}
          {posts.length === 0 && (
            <div className='text-center py-12'>
              <DocumentTextIcon className='w-16 h-16 mx-auto text-gray-400 mb-4' />
              <p className='text-gray-500 dark:text-gray-400 text-lg'>
                该分类下暂无文章
              </p>
              <Link
                to='/category'
                className='inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
              >
                浏览其他分类
              </Link>
            </div>
          )}
        </div>

        {/* 侧边栏 */}
        <div className='lg:col-span-1 space-y-6'>
          {/* 分类导航 */}
          <CategoryNavigation
            currentCategory={category || undefined}
            className='sticky top-8'
          />

          {/* 分类统计 */}
          {category && posts.length > 0 && (
            <CategoryStats category={category} posts={posts} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Category;
