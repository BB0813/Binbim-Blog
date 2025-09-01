import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  showSidebar?: boolean;
  sidebarPosition?: 'left' | 'right';
}

const Layout: React.FC<LayoutProps> = ({
  children,
  className = '',
  showSidebar = false,
  sidebarPosition = 'right',
}) => {
  return (
    <div className='min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white'>
      <Header />
      <div className='flex-1 flex'>
        {showSidebar && sidebarPosition === 'left' && (
          <Sidebar className='w-80 flex-shrink-0 p-6 border-r border-gray-200 dark:border-gray-700 hidden lg:block' />
        )}
        <main className={`flex-1 ${className}`}>{children}</main>
        {showSidebar && sidebarPosition === 'right' && (
          <Sidebar className='w-80 flex-shrink-0 p-6 border-l border-gray-200 dark:border-gray-700 hidden lg:block' />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
