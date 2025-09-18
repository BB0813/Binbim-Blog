import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Home, User, Archive, Search, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { SearchBox } from '@/components/Search';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearchBox, setShowSearchBox] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const navigation = [
    { name: '首页', href: '/', icon: Home },
    { name: '归档', href: '/archive', icon: Archive },
    { name: '关于', href: '/about', icon: User },
  ];

  // 处理搜索
  const handleSearch = (_query: string) => {
    setShowSearchBox(false);
    setIsMenuOpen(false);
  };

  // 切换搜索框显示
  const toggleSearchBox = () => {
    setShowSearchBox(!showSearchBox);
  };

  // 处理移动端搜索
  const handleMobileSearch = () => {
    setIsMenuOpen(false);
    navigate('/search');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className='sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <Link
            to='/'
            className='flex items-center space-x-2 text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
          >
            <div className='w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm'>
              B
            </div>
            <span>Binbim Blog</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex items-center space-x-4'>
            {navigation.map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className='w-4 h-4' />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {/* Search Box or Search Button */}
            {showSearchBox ? (
              <div className='w-64'>
                <SearchBox
                  size='sm'
                  placeholder='搜索文章...'
                  onSearch={handleSearch}
                  onBlur={() => setShowSearchBox(false)}
                  autoFocus
                  className='w-full'
                />
              </div>
            ) : (
              <button 
                onClick={toggleSearchBox}
                className='p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors'
                aria-label='搜索'
              >
                <Search className='w-5 h-5' />
              </button>
            )}

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className='p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors'
              aria-label='切换主题'
            >
              {theme === 'dark' ? (
                <Sun className='w-5 h-5' />
              ) : (
                <Moon className='w-5 h-5' />
              )}
            </button>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className='md:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors'
          >
            {isMenuOpen ? (
              <X className='w-6 h-6' />
            ) : (
              <Menu className='w-6 h-6' />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className='md:hidden py-4 border-t border-gray-200 dark:border-gray-700'>
            <nav className='space-y-2'>
              {navigation.map(item => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive(item.href)
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                        : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className='w-5 h-5' />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              <button
                onClick={handleMobileSearch}
                className='flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors w-full'
              >
                <Search className='w-5 h-5' />
                <span>搜索</span>
              </button>
              <button
                onClick={() => {
                  toggleTheme();
                  setIsMenuOpen(false);
                }}
                className='flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors w-full'
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className='w-5 h-5' />
                    <span>浅色模式</span>
                  </>
                ) : (
                  <>
                    <Moon className='w-5 h-5' />
                    <span>深色模式</span>
                  </>
                )}
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
