import React, { useState, useEffect, useCallback, useRef } from 'react';

interface ReadingProgressProps {
  target?: string; // 目标元素的选择器，默认为整个文档
  className?: string;
}

const ReadingProgress: React.FC<ReadingProgressProps> = ({
  target,
  className = '',
}) => {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>();
  const lastProgressRef = useRef(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const resizeTimeoutRef = useRef<NodeJS.Timeout>();

  // 使用useCallback优化进度计算函数
  const calculateProgress = useCallback(() => {
    let scrollTop: number;
    let scrollHeight: number;

    if (target) {
      const element = document.querySelector(target);
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const elementTop = rect.top + window.pageYOffset;
      const elementHeight = rect.height;

      scrollTop = Math.max(0, window.pageYOffset - elementTop);
      scrollHeight = elementHeight;
    } else {
      scrollTop = window.pageYOffset;
      scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    }

    if (scrollHeight <= 0) {
      return;
    }

    const newProgress = Math.min(
      100,
      Math.max(0, (scrollTop / scrollHeight) * 100)
    );

    // 只有当进度变化超过1%时才更新状态，减少不必要的重渲染
    if (Math.abs(newProgress - lastProgressRef.current) > 1) {
      lastProgressRef.current = newProgress;
      setProgress(newProgress);
    }
  }, [target]);

  // 防抖的滚动处理函数
  const handleScroll = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(calculateProgress);
    }, 32); // 降低到约30fps的防抖
  }, [calculateProgress]);

  // 防抖的resize处理函数
  const handleResize = useCallback(() => {
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }

    resizeTimeoutRef.current = setTimeout(() => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(calculateProgress);
    }, 200); // resize事件防抖200ms
  }, [calculateProgress]);

  useEffect(() => {
    // 初始计算
    calculateProgress();

    // 添加事件监听器
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      // 清理事件监听器
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);

      // 清理定时器
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      // 取消待执行的动画帧
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [calculateProgress, handleScroll, handleResize]);

  return (
    <div
      className={`fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 z-50 ${className}`}
    >
      <div
        className='h-full bg-gradient-to-r from-blue-500 to-purple-600'
        style={{
          width: `${progress}%`,
        }}
      />

      {/* 可选：显示百分比文本 */}
      {progress > 10 && (
        <div className='absolute top-2 right-4 text-xs font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded shadow-sm'>
          {Math.round(progress)}%
        </div>
      )}
    </div>
  );
};

export default ReadingProgress;
