import React, { useState, useEffect } from 'react';
import {
  Github,
  Mail,
  Twitter,
  MessageCircle,
  Send,
  Globe,
} from 'lucide-react';
import { contentManager } from '../utils/contentManager';

const About: React.FC = () => {
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalCategories: 0,
    totalTags: 0,
    totalWords: 0
  });
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initializeData = async () => {
      try {
        await contentManager.initialize();
        const contentStats = contentManager.getContentStats();
        setStats(contentStats);
        setInitialized(true);
      } catch (error) {
        console.error('Failed to initialize content:', error);
      }
    };

    initializeData();
  }, []);

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <div className='max-w-4xl mx-auto px-4 py-8'>
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8'>
        <header className='text-center mb-8'>
          <div className='w-32 h-32 mx-auto mb-6'>
            <img
              src='https://q1.qlogo.cn/g?b=qq&nk=1721822150&s=640'
              alt='头像'
              className='w-full h-full rounded-full object-cover border-4 border-blue-500'
            />
          </div>
          <h1 className='text-3xl font-bold mb-2'>关于我</h1>
          <p className='text-xl text-gray-600 dark:text-gray-400'>
            热爱技术的全栈开发者
          </p>
        </header>

        <div className='grid md:grid-cols-2 gap-8'>
          <section>
            <h2 className='text-2xl font-semibold mb-4'>个人简介</h2>
            <div className='prose dark:prose-invert'>
              <p>
                你好！我是一名充满热情的软件开发者，专注于现代Web技术栈的学习和实践。
                我喜欢探索新技术，分享开发经验，并通过这个博客记录我的技术成长历程。
              </p>
              <p>
                在这里，你可以找到关于前端开发、后端技术、DevOps实践以及个人思考的文章。
                我相信技术分享能够帮助更多的开发者成长，也希望能与大家一起交流学习。
              </p>
            </div>
          </section>

          <section>
            <h2 className='text-2xl font-semibold mb-4'>技能栈</h2>
            <div className='space-y-4'>
              <div>
                <h3 className='font-medium mb-2'>前端技术</h3>
                <div className='flex flex-wrap gap-2'>
                  {[
                    'React',
                    'TypeScript',
                    'Vue.js',
                    'Tailwind CSS',
                    'Vite',
                  ].map(skill => (
                    <span
                      key={skill}
                      className='px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm'
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className='font-medium mb-2'>后端技术</h3>
                <div className='flex flex-wrap gap-2'>
                  {[
                    'Node.js',
                    'Python',
                    'Express',
                    'FastAPI',
                    'PostgreSQL',
                  ].map(skill => (
                    <span
                      key={skill}
                      className='px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm'
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className='font-medium mb-2'>工具 &amp; 平台</h3>
                <div className='flex flex-wrap gap-2'>
                  {['Git', 'Docker', 'GitHub Actions', 'Vercel', 'AWS'].map(
                    skill => (
                      <span
                        key={skill}
                        className='px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm'
                      >
                        {skill}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className='mt-8 pt-8 border-t border-gray-200 dark:border-gray-700'>
          <h2 className='text-2xl font-semibold mb-4'>联系方式</h2>
          <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
            <a
              href='https://github.com/BB0813'
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
            >
              <Github className='w-5 h-5 mr-2' />
              GitHub
            </a>
            <a
              href='https://qm.qq.com/q/jN4OII0UUM'
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
            >
              <MessageCircle className='w-5 h-5 mr-2' />
              QQ
            </a>
            <a
              href='https://x.com/Binbim_ProMax'
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
            >
              <Twitter className='w-5 h-5 mr-2' />
              Twitter
            </a>
            <a
              href='mailto:binbim_promax@163.com'
              className='flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
            >
              <Mail className='w-5 h-5 mr-2' />
              Email
            </a>
            <a
              href='https://t.me/Binbim_Pro'
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
            >
              <Send className='w-5 h-5 mr-2' />
              Telegram
            </a>
            <a
              href='https://bb0813.github.io/Binbim-Blog/'
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
            >
              <Globe className='w-5 h-5 mr-2' />
              Blog
            </a>
          </div>
        </section>

        <section className='mt-8 pt-8 border-t border-gray-200 dark:border-gray-700'>
          <h2 className='text-2xl font-semibold mb-4'>博客统计</h2>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <div className='text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
              <div className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
                {initialized ? stats.totalPosts : '...'}
              </div>
              <div className='text-sm text-gray-600 dark:text-gray-400'>
                文章总数
              </div>
            </div>
            <div className='text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
              <div className='text-2xl font-bold text-green-600 dark:text-green-400'>
                {initialized ? stats.totalCategories : '...'}
              </div>
              <div className='text-sm text-gray-600 dark:text-gray-400'>
                分类数量
              </div>
            </div>
            <div className='text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
              <div className='text-2xl font-bold text-purple-600 dark:text-purple-400'>
                {initialized ? stats.totalTags : '...'}
              </div>
              <div className='text-sm text-gray-600 dark:text-gray-400'>
                标签数量
              </div>
            </div>
            <div className='text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
              <div className='text-2xl font-bold text-orange-600 dark:text-orange-400'>
                {initialized ? formatNumber(stats.totalWords) : '...'}
              </div>
              <div className='text-sm text-gray-600 dark:text-gray-400'>
                总访问量
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
