import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { HeadingItem } from './MarkdownRenderer';

interface TableOfContentsProps {
  headings: HeadingItem[];
  className?: string;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({
  headings,
  className = '',
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeHeading, setActiveHeading] = useState<string>('');
  const observerRef = useRef<IntersectionObserver | null>(null);
  const headingElementsRef = useRef<Element[]>([]);

  // 使用useCallback优化滚动到标题的函数
  const scrollToHeading = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // 考虑固定头部的高度
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }, []);

  // 使用useCallback优化IntersectionObserver的回调函数
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const visibleHeadings = entries
        .filter(entry => entry.isIntersecting)
        .map(entry => entry.target.id);

      if (visibleHeadings.length > 0) {
        // 选择第一个可见的标题作为活跃标题
        setActiveHeading(visibleHeadings[0]);
      }
    },
    []
  );

  // 优化IntersectionObserver的创建和管理
  useEffect(() => {
    // 清理之前的observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // 如果没有标题，直接返回
    if (headings.length === 0) {
      return;
    }

    // 获取所有标题元素
    const headingElements = headings
      .map(heading => document.getElementById(heading.id))
      .filter(Boolean) as Element[];

    // 保存元素引用
    headingElementsRef.current = headingElements;

    if (headingElements.length === 0) {
      return;
    }

    // 创建新的observer
    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: '-20% 0px -35% 0px',
      threshold: 0,
    });

    // 观察所有标题元素
    headingElements.forEach(element => {
      observer.observe(element);
    });

    observerRef.current = observer;

    // 清理函数
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [headings, handleIntersection]); // 只在headings或handleIntersection变化时重新创建

  // 获取标题的缩进级别
  const getIndentClass = (level: number) => {
    const baseIndent = Math.max(0, level - 1);
    return `ml-${baseIndent * 4}`;
  };

  // 检查标题是否为活跃状态
  const isActiveHeading = (id: string) => {
    return activeHeading === id;
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}
    >
      {/* 标题栏 */}
      <div
        className='flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h3 className='font-semibold text-gray-900 dark:text-gray-100 text-sm'>
          目录
        </h3>
        {isCollapsed ? (
          <ChevronRight className='w-4 h-4 text-gray-500' />
        ) : (
          <ChevronDown className='w-4 h-4 text-gray-500' />
        )}
      </div>

      {/* 目录内容 */}
      {!isCollapsed && (
        <div className='p-4 max-h-96 overflow-y-auto'>
          <nav className='space-y-1'>
            {headings.map(heading => (
              <button
                key={heading.id}
                onClick={() => scrollToHeading(heading.id)}
                className={`
                  block w-full text-left px-2 py-1 rounded text-sm transition-colors duration-200
                  ${getIndentClass(heading.level)}
                  ${
                    isActiveHeading(heading.id)
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium border-l-2 border-blue-500'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                {heading.text}
              </button>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
};

export default TableOfContents;
