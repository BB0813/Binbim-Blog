import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Mail, Heart, Rss } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'GitHub',
      href: 'https://github.com',
      icon: Github,
      color: 'hover:text-gray-900 dark:hover:text-white',
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com',
      icon: Twitter,
      color: 'hover:text-blue-400',
    },
    {
      name: 'Email',
      href: 'mailto:contact@example.com',
      icon: Mail,
      color: 'hover:text-red-500',
    },
    {
      name: 'RSS',
      href: '/rss.xml',
      icon: Rss,
      color: 'hover:text-orange-500',
    },
  ];

  const quickLinks = [
    { name: '首页', href: '/' },
    { name: '归档', href: '/archive' },
    { name: '关于', href: '/about' },
  ];

  const categories = [
    { name: '前端开发', href: '/category/frontend' },
    { name: '后端开发', href: '/category/backend' },
    { name: '工程化', href: '/category/engineering' },
    { name: '个人思考', href: '/category/thoughts' },
  ];

  return (
    <footer className='bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* 博客信息 */}
          <div className='col-span-1 md:col-span-2'>
            <Link
              to='/'
              className='flex items-center space-x-2 text-xl font-bold text-gray-900 dark:text-white mb-4'
            >
              <div className='w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm'>
                B
              </div>
              <span>Binbim Blog</span>
            </Link>
            <p className='text-gray-600 dark:text-gray-400 mb-4 max-w-md'>
              分享技术与生活的个人博客。专注于前端开发、后端技术、DevOps实践以及个人成长思考。
            </p>
            <div className='flex space-x-4'>
              {socialLinks.map(link => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={
                      link.href.startsWith('http')
                        ? 'noopener noreferrer'
                        : undefined
                    }
                    className={`text-gray-500 dark:text-gray-400 ${link.color} transition-colors`}
                    aria-label={link.name}
                  >
                    <Icon className='w-5 h-5' />
                  </a>
                );
              })}
            </div>
          </div>

          {/* 快速链接 */}
          <div>
            <h3 className='text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4'>
              快速链接
            </h3>
            <ul className='space-y-2'>
              {quickLinks.map(link => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className='text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 分类 */}
          <div>
            <h3 className='text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4'>
              分类
            </h3>
            <ul className='space-y-2'>
              {categories.map(category => (
                <li key={category.name}>
                  <Link
                    to={category.href}
                    className='text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 底部信息 */}
        <div className='mt-8 pt-8 border-t border-gray-200 dark:border-gray-700'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <div className='flex items-center text-gray-600 dark:text-gray-400 text-sm'>
              <span>© {currentYear} Binbim Blog. </span>
              <span className='mx-1'>Made with</span>
              <Heart className='w-4 h-4 text-red-500 mx-1' />
              <span>using React & TypeScript</span>
            </div>
            <div className='mt-4 md:mt-0 flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400'>
              <span>Powered by GitHub Pages</span>
              <span>•</span>
              <a
                href='https://github.com/username/blog'
                target='_blank'
                rel='noopener noreferrer'
                className='hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
              >
                源码
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
