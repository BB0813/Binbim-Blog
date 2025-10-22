import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Mail, ExternalLink, MessageCircle, Send, Globe } from 'lucide-react';
import {
  ArticleList,
  Pagination,
  ProfileCard,
  LatestArticles,
} from '@/components/Blog';
import { TagCloud } from '@/components/Tag';
import { WebvisoStats } from '@/components/Analytics';
import { usePopularTags } from '@/hooks/useTags';
import { useContentInit } from '@/hooks/useContentInit';
import { contentManager } from '@/utils/contentManager';

const Home: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 5;
  const { initialized, loading, error } = useContentInit();

  // 获取热门标签
  const { tags: popularTags, loading: tagsLoading } = usePopularTags(12);

  // 获取文章数据
  const postsResponse = initialized ? contentManager.getPosts({
    page: currentPage,
    pageSize: articlesPerPage
  }) : { posts: [], total: 0, totalPages: 0, currentPage: 1 };

  // 获取最新文章（用于侧边栏）
  const latestArticles = initialized ? contentManager.getLatestPosts(5) : [];

  // 个人信息
  const profileData = {
    name: 'Binbim',
    avatar: 'https://q1.qlogo.cn/g?b=qq&nk=1721822150&s=640',
    bio: '全栈开发工程师，专注于前端技术和用户体验设计。热爱开源，喜欢分享技术心得。',
    location: '中国 · 北京',
    website: 'https://bb0813.github.io/Binbim-Blog/',
    email: 'binbim_promax@163.com',
    joinDate: '2023-01-01',
    socialLinks: [
      {
        name: 'GitHub',
        url: 'https://github.com/BB0813',
        icon: <Github className='w-5 h-5' />,
      },
      {
        name: 'QQ',
        url: 'https://qm.qq.com/q/jN4OII0UUM',
        icon: <MessageCircle className='w-5 h-5' />,
      },
      {
        name: 'Twitter',
        url: 'https://x.com/Binbim_ProMax',
        icon: <Twitter className='w-5 h-5' />,
      },
      {
        name: 'Email',
        url: 'mailto:binbim_promax@163.com',
        icon: <Mail className='w-5 h-5' />,
      },
      {
        name: 'Telegram',
        url: 'https://t.me/Binbim_Pro',
        icon: <Send className='w-5 h-5' />,
      },
      {
        name: 'Blog',
        url: 'https://bb0813.github.io/Binbim-Blog/',
        icon: <Globe className='w-5 h-5' />,
      },
    ],
    stats: initialized ? {
      posts: contentManager.getContentStats().totalPosts,
      views: 12500, // 这个可以后续集成真实的统计数据
      likes: 89,   // 这个可以后续集成真实的统计数据
    } : {
      posts: 0,
      views: 0,
      likes: 0,
    },
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
              articles={postsResponse.posts}
              loading={loading}
              className='mb-8'
            />

            {/* 分页组件 */}
            <Pagination
              currentPage={postsResponse.currentPage}
              totalPages={postsResponse.totalPages}
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
                        <div
                          key={i}
                          className='h-6 bg-gray-200 dark:bg-gray-700 rounded w-16'
                        ></div>
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
          
          {/* PV/UV 统计 */}
          <div className='mb-8'>
            <WebvisoStats size='lg' className='justify-center' />
          </div>
          
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
