import React, { useState, useRef, useEffect } from 'react';
import Giscus from './Giscus';
import { LazyGiscusProps } from '@/types/giscus';

interface LazyGiscusComponentProps extends LazyGiscusProps {
  className?: string;
  placeholderHeight?: number;
}

const LazyGiscus: React.FC<LazyGiscusComponentProps> = ({
  repo,
  repoId,
  category,
  categoryId,
  threshold = 0.1,
  className = '',
  placeholderHeight = 200,
}) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // 检查是否支持 Intersection Observer
    if (!window.IntersectionObserver) {
      // 如果不支持，直接加载
      setShouldLoad(true);
      return;
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // 延迟一点时间再加载，避免快速滚动时频繁触发
          const timer = setTimeout(() => {
            setShouldLoad(true);
          }, 100);

          // 一旦开始加载就断开观察
          observerRef.current?.disconnect();

          return () => clearTimeout(timer);
        }
      },
      {
        threshold,
        rootMargin: '50px', // 提前50px开始加载
      }
    );

    if (containerRef.current) {
      observerRef.current.observe(containerRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [threshold]);

  // 如果已经决定加载，渲染真实的 Giscus 组件
  if (shouldLoad) {
    return (
      <div ref={containerRef} className={className}>
        <Giscus
          repo={repo}
          repoId={repoId}
          category={category}
          categoryId={categoryId}
        />
      </div>
    );
  }

  // 渲染占位符
  return (
    <div
      ref={containerRef}
      className={`${className}`}
      style={{ minHeight: `${placeholderHeight}px` }}
    >
      <div className='flex flex-col items-center justify-center h-full bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
        {isVisible ? (
          // 用户已经滚动到这里，显示加载状态
          <div className='flex items-center space-x-3 text-gray-500 dark:text-gray-400'>
            <svg
              className='animate-spin w-6 h-6'
              fill='none'
              viewBox='0 0 24 24'
            >
              <circle
                className='opacity-25'
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'
              ></circle>
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
              ></path>
            </svg>
            <span className='text-sm font-medium'>正在加载评论系统...</span>
          </div>
        ) : (
          // 用户还没有滚动到这里，显示提示
          <div className='text-center'>
            <svg
              className='w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-3'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1.5}
                d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
              />
            </svg>
            <p className='text-gray-500 dark:text-gray-400 text-sm font-medium mb-1'>
              评论区域
            </p>
            <p className='text-gray-400 dark:text-gray-500 text-xs'>
              滚动到此处加载评论
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LazyGiscus;
