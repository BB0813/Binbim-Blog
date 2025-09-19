import React, { useState, useEffect } from 'react';
import { CommentCountProps } from '@/types/giscus';

const CommentCount: React.FC<CommentCountProps> = ({
  repo,
  pathname,
  className = '',
}) => {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    let messageHandler: ((event: MessageEvent) => void) | null = null;

    const fetchCommentCount = async () => {
      try {
        // 监听giscus的metadata事件
        messageHandler = (event: MessageEvent) => {
          if (event.origin !== 'https://giscus.app') return;

          const { data } = event;
          if (data.giscus?.discussion) {
            const commentCount = data.giscus.discussion.totalCommentCount || 0;
            if (mounted) {
              setCount(commentCount);
              setLoading(false);
              setError(false);
            }
          }
        };

        window.addEventListener('message', messageHandler);

        // 设置超时，避免无限等待
        const timeout = setTimeout(() => {
          if (mounted && loading) {
            setLoading(false);
            setError(true);
          }
        }, 10000); // 10秒超时

        return () => {
          clearTimeout(timeout);
        };
      } catch (err) {
        console.error('Failed to fetch comment count:', err);
        if (mounted) {
          setLoading(false);
          setError(true);
        }
      }
    };

    fetchCommentCount();

    return () => {
      mounted = false;
      if (messageHandler) {
        window.removeEventListener('message', messageHandler);
      }
    };
  }, [repo, pathname, loading]);

  // 格式化评论数量显示
  const formatCount = (num: number): string => {
    if (num === 0) return '暂无评论';
    if (num === 1) return '1 条评论';
    if (num < 1000) return `${num} 条评论`;
    if (num < 10000) return `${(num / 1000).toFixed(1)}k 条评论`;
    return `${(num / 10000).toFixed(1)}w 条评论`;
  };

  if (loading) {
    return (
      <div
        className={`flex items-center text-gray-500 dark:text-gray-400 ${className}`}
      >
        <svg
          className='w-4 h-4 mr-1.5'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
          />
        </svg>
        <span className='text-sm animate-pulse'>加载中...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex items-center text-gray-400 dark:text-gray-500 ${className}`}
      >
        <svg
          className='w-4 h-4 mr-1.5'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
          />
        </svg>
        <span className='text-sm'>评论</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors ${className}`}
    >
      <svg
        className='w-4 h-4 mr-1.5'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
        />
      </svg>
      <span className='text-sm font-medium'>
        {count !== null ? formatCount(count) : '评论'}
      </span>
    </div>
  );
};

export default CommentCount;
