import React from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { TagIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useTags, useTagPosts } from '@/hooks/useTags';
import { TagCloud, TagStats } from '@/components/Tag';
import { Empty } from '@/components';

const Tag: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const { tags, loading: tagsLoading } = useTags();
  const { posts, tag, loading: postsLoading, error, total } = useTagPosts(name);

  // 加载状态
  if (tagsLoading || postsLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <TagIcon className="w-16 h-16 text-red-300 dark:text-red-600 mx-auto mb-4" />
          <p className="text-red-500 dark:text-red-400 text-lg mb-4">{error}</p>
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  // 如果没有指定标签名，显示所有标签
  if (!name) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <TagIcon className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
              <h1 className="text-3xl font-bold">所有标签</h1>
            </div>
            <Link
              to="/"
              className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-1" />
              返回首页
            </Link>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            共有 {tags.length} 个标签，点击标签查看相关文章
          </p>
        </header>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <TagCloud tags={tags} maxTags={50} variant="colorful" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <TagIcon className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
            <h1 className="text-3xl font-bold">标签：{tag?.name || name}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/tag"
              className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              <TagIcon className="w-4 h-4 mr-1" />
              所有标签
            </Link>
            <Link
              to="/"
              className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-1" />
              返回首页
            </Link>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          包含标签 &quot;{tag?.name || name}&quot; 的文章共 {total} 篇
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 主内容区域 */}
        <div className="lg:col-span-3">
          {posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map(post => (
                <article
                  key={post.slug}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h2 className="text-xl font-semibold flex-1">
                      <Link
                        to={`/post/${post.slug}`}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-sm ml-4">
                      {post.category}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString('zh-CN')}
                      </time>
                      <span className="mx-2">•</span>
                      <span>{post.readingTime} 分钟阅读</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map(tagName => (
                        <Link
                          key={tagName}
                          to={`/tag/${tagName}`}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded text-xs hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                        >
                          #{tagName}
                        </Link>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <Empty
              icon={<TagIcon className="w-16 h-16" />}
              title="该标签下暂无文章"
              description={`标签 "${tag?.name || name}" 下还没有发布任何文章`}
            />
          )}
        </div>

        {/* 侧边栏 */}
        <div className="lg:col-span-1">
          {tag && posts.length > 0 && (
            <TagStats tag={tag} posts={posts} className="mb-6" />
          )}
          
          {/* 热门标签 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <TagIcon className="w-5 h-5 mr-2" />
              热门标签
            </h3>
            <TagCloud 
              tags={tags.slice(0, 10)} 
              maxTags={10} 
              variant="compact" 
              showCount={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tag;
