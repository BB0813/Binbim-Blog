import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Mail, ExternalLink } from 'lucide-react';
import {
  ArticleList,
  Pagination,
  ProfileCard,
  LatestArticles,
} from '@/components/Blog';
import { TagCloud } from '@/components/Tag';
import { usePopularTags } from '@/hooks/useTags';

const Home: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const articlesPerPage = 5;
  
  // 获取热门标签
  const { tags: popularTags, loading: tagsLoading } = usePopularTags(12);

  // 模拟文章数据
  const allArticles = [
    {
      slug: 'react-18-features',
      title: 'React 18 新特性详解',
      excerpt:
        '深入了解React 18带来的并发特性、自动批处理、Suspense改进等重要更新，以及如何在项目中应用这些新特性。',
      date: '2024-01-15',
      category: '前端开发',
      tags: ['React', 'JavaScript', '前端'],
      readingTime: 8,
    },
    {
      slug: 'typescript-best-practices',
      title: 'TypeScript 最佳实践指南',
      excerpt:
        '总结TypeScript开发中的最佳实践，包括类型定义、泛型使用、配置优化等方面的经验分享。',
      date: '2024-01-10',
      category: '前端开发',
      tags: ['TypeScript', '最佳实践'],
      readingTime: 12,
    },
    {
      slug: 'vite-optimization',
      title: 'Vite 构建优化技巧',
      excerpt:
        '分享Vite项目的构建优化技巧，包括依赖预构建、代码分割、插件配置等实用方法。',
      date: '2024-01-05',
      category: '工程化',
      tags: ['Vite', '构建优化', '性能'],
      readingTime: 6,
    },
    {
      slug: 'nodejs-microservices',
      title: 'Node.js 微服务架构实践',
      excerpt: '探讨Node.js微服务架构的设计原则、技术选型和实际应用经验。',
      date: '2024-01-01',
      category: '后端开发',
      tags: ['Node.js', '微服务', '架构'],
      readingTime: 15,
    },
    {
      slug: 'docker-deployment',
      title: 'Docker 容器化部署指南',
      excerpt:
        '从零开始学习Docker容器化技术，包括镜像构建、容器编排和生产环境部署。',
      date: '2023-12-28',
      category: 'DevOps',
      tags: ['Docker', '容器化', '部署'],
      readingTime: 10,
    },
  ];

  // 个人信息
  const profileData = {
    name: 'Binbim',
    avatar:
      'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20developer%20avatar%2C%20friendly%20tech%20person%2C%20modern%20style&image_size=square',
    bio: '全栈开发工程师，专注于前端技术和用户体验设计。热爱开源，喜欢分享技术心得。',
    location: '中国 · 北京',
    website: 'https://binbim.dev',
    email: 'contact@binbim.dev',
    joinDate: '2023-01-01',
    socialLinks: [
      {
        name: 'GitHub',
        url: 'https://github.com/binbim',
        icon: <Github className='w-5 h-5' />,
      },
      {
        name: 'Twitter',
        url: 'https://twitter.com/binbim',
        icon: <Twitter className='w-5 h-5' />,
      },
      {
        name: 'Email',
        url: 'mailto:contact@binbim.dev',
        icon: <Mail className='w-5 h-5' />,
      },
    ],
    stats: {
      posts: allArticles.length,
      views: 12500,
      likes: 89,
    },
  };

  // 最新文章数据
  const latestArticles = allArticles.slice(0, 5).map(article => ({
    ...article,
    isHot: article.slug === 'react-18-features',
  }));

  // 分页逻辑
  const totalPages = Math.ceil(allArticles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const currentArticles = allArticles.slice(
    startIndex,
    startIndex + articlesPerPage
  );

  const handlePageChange = (page: number) => {
    setLoading(true);
    setCurrentPage(page);
    // 模拟加载延迟
    setTimeout(() => setLoading(false), 500);
  };

  return (
    <div className='min-h-screen'>
      {/* 主要内容区域 */}
      <div className='max-w-7xl mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
          {/* 左侧内容 - 文章列表 */}
          <div className='lg:col-span-3'>
            {/* 页面标题 */}
            <div className='mb-8'>
              <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
                最新文章
              </h1>
              <p className='text-gray-600 dark:text-gray-400'>
                分享技术心得，记录学习历程
              </p>
            </div>

            {/* 文章列表 */}
            <ArticleList
              articles={currentArticles}
              loading={loading}
              className='mb-8'
            />

            {/* 分页组件 */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              className='mb-8'
            />
          </div>

          {/* 右侧边栏 */}
          <div className='lg:col-span-1'>
            <div className='space-y-6 sticky top-8'>
              {/* 个人简介卡片 */}
              <ProfileCard
                name={profileData.name}
                avatar={profileData.avatar}
                bio={profileData.bio}
                location={profileData.location}
                website={profileData.website}
                email={profileData.email}
                joinDate={profileData.joinDate}
                socialLinks={profileData.socialLinks}
                stats={profileData.stats}
              />

              {/* 最新文章 */}
              <LatestArticles
                articles={latestArticles}
                title='热门文章'
                maxItems={5}
                showCategory={true}
                showDate={true}
                showReadingTime={false}
              />
              
              {/* 热门标签 */}
              <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6'>
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                    热门标签
                  </h3>
                  <Link
                    to='/tag'
                    className='text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300'
                  >
                    查看全部
                  </Link>
                </div>
                {tagsLoading ? (
                  <div className='animate-pulse'>
                    <div className='flex flex-wrap gap-2'>
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className='h-6 bg-gray-200 dark:bg-gray-700 rounded w-16'></div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <TagCloud 
                    tags={popularTags} 
                    maxTags={12} 
                    variant='compact' 
                    showCount={false}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部介绍区域 */}
      <section className='bg-gray-50 dark:bg-gray-900 py-16'>
        <div className='max-w-4xl mx-auto px-4 text-center'>
          <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-6'>
            关于这个博客
          </h2>
          <p className='text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed'>
            这里记录我在技术学习和项目实践中的思考与总结。希望通过分享经验，
            与更多开发者交流学习，共同成长。欢迎在评论区留下你的想法！
          </p>
          <div className='flex justify-center space-x-4'>
            <Link
              to='/about'
              className='inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
            >
              <ExternalLink className='w-4 h-4 mr-2' />
              了解更多
            </Link>
            <Link
              to='/archive'
              className='inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
            >
              查看归档
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
