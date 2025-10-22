import React, { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  MarkdownRenderer,
  TableOfContents,
  ReadingProgress,
  ArticleMeta,
  HeadingItem,
} from '@/components/Article';
import { LazyGiscus, CommentCount } from '@/components/Giscus';
import { getGiscusConfig, validateGiscusConfig } from '@/utils/giscus';
import { useContentInit } from '@/hooks/useContentInit';
import { contentManager } from '@/utils/contentManager';

const PostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const { initialized, loading, error } = useContentInit();

  // 获取giscus配置
  const giscusConfig = getGiscusConfig();
  const isGiscusEnabled = validateGiscusConfig(giscusConfig);

  // 使用useCallback优化回调函数，避免每次渲染都创建新的函数引用
  const handleHeadingsExtracted = useCallback(
    (extractedHeadings: HeadingItem[]) => {
      setHeadings(extractedHeadings);
    },
    []
  );

  // 获取文章数据
  const postResponse = initialized && slug ? contentManager.getPostWithRelated(slug) : null;
  const article = postResponse?.post;

  // 如果文章不存在或正在加载，显示相应状态
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">加载错误</h1>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">文章未找到</h1>
          <p className="text-gray-600 dark:text-gray-400">抱歉，您访问的文章不存在。</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 阅读进度条 */}
      <ReadingProgress target='.article-content' />

      <div className='max-w-7xl mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
          {/* 主要内容区域 */}
          <div className='lg:col-span-3'>
            <article className='article-content'>
              {/* 文章元信息 */}
              <ArticleMeta
                title={article.title}
                author={{
                  name: article.author || 'Binbim',
                  avatar: 'https://q1.qlogo.cn/g?b=qq&nk=1721822150&s=640',
                  url: '/about',
                }}
                publishDate={article.date}
                updateDate={article.updatedAt}
                readingTime={article.readingTime}
                category={article.category}
                tags={article.tags}
                views={article.views || 0}
                likes={article.likes || 0}
                className='mb-8'
              />

              {/* 评论数量显示 */}
              {isGiscusEnabled && slug && (
                <div className='mb-4'>
                  <CommentCount
                    repo={giscusConfig.repo}
                    pathname={`/post/${slug}`}
                    className='text-sm'
                  />
                </div>
              )}

              {/* 文章内容 */}
              <MarkdownRenderer
                content={article.content}
                onHeadingsExtracted={handleHeadingsExtracted}
                className='mb-12'
              />

              {/* 评论区域 */}
              <section className='mt-12'>
                <h2 className='text-2xl font-bold mb-6 text-gray-900 dark:text-white'>
                  评论
                </h2>
                {isGiscusEnabled && slug ? (
                  <LazyGiscus
                    repo={giscusConfig.repo}
                    repoId={giscusConfig.repoId}
                    category={giscusConfig.category}
                    categoryId={giscusConfig.categoryId}
                    threshold={0.1}
                    placeholderHeight={250}
                  />
                ) : (
                  <div className='bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6'>
                    <div className='flex items-center mb-2'>
                      <svg
                        className='w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                          clipRule='evenodd'
                        />
                      </svg>
                      <h3 className='text-sm font-medium text-yellow-800 dark:text-yellow-200'>
                        评论系统配置不完整
                      </h3>
                    </div>
                    <div className='text-sm text-yellow-700 dark:text-yellow-300'>
                      <p className='mb-2'>请完成以下配置以启用评论功能：</p>
                      <ul className='list-disc list-inside space-y-1'>
                        <li>在GitHub仓库中启用Discussions功能</li>
                        <li>
                          访问{' '}
                          <a
                            href='https://giscus.app'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='underline hover:text-yellow-600 dark:hover:text-yellow-200'
                          >
                            giscus.app
                          </a>{' '}
                          获取配置参数
                        </li>
                        <li>
                          在.env文件中设置正确的VITE_GISCUS_CATEGORY和VITE_GISCUS_CATEGORY_ID
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </section>
            </article>
          </div>

          {/* 侧边栏 */}
          <div className='lg:col-span-1'>
            <div className='sticky top-8 space-y-6'>
              {/* 目录导航 */}
              <TableOfContents headings={headings} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostDetail;
