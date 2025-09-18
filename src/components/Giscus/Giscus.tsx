import React, { useEffect, useRef, useState } from 'react';
import { GiscusProps } from '@/types/giscus';
import { createGiscusScript, updateGiscusTheme, getGiscusTheme } from '@/utils/giscus';
import { useTheme } from '@/hooks/useTheme';

interface GiscusComponentProps extends GiscusProps {
  className?: string;
}

const Giscus: React.FC<GiscusComponentProps> = ({
  repo,
  repoId,
  category,
  categoryId,
  mapping = 'pathname',
  strict = false,
  reactionsEnabled = true,
  emitMetadata = false,
  inputPosition = 'bottom',
  lang = 'zh-CN',
  loading = 'lazy',
  theme,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { theme: currentTheme } = useTheme();
  
  // 根据主题选择giscus主题
  const giscusTheme = theme || getGiscusTheme(currentTheme);
  
  useEffect(() => {
    if (!containerRef.current || isLoaded) return;
    
    // 验证必需参数
    if (!repo || !repoId || !category || !categoryId) {
      setError('giscus配置不完整，请检查repo、repoId、category和categoryId参数');
      return;
    }
    
    // 检查是否包含占位符
    if (category.includes('[在此输入') || categoryId.includes('[在此输入')) {
      setError('请完成giscus配置，替换占位符为实际的分类名称和ID');
      return;
    }
    
    try {
      const config = {
        repo,
        repoId,
        category,
        categoryId,
        mapping,
        strict,
        reactionsEnabled,
        emitMetadata,
        inputPosition,
        theme: giscusTheme,
        lang,
        loading
      };
      
      const script = createGiscusScript(config);
      
      script.onload = () => {
        setIsLoaded(true);
        setError(null);
      };
      
      script.onerror = () => {
        setError('giscus加载失败，请检查网络连接');
      };
      
      containerRef.current.appendChild(script);
      
      return () => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        const currentContainer = containerRef.current;
        if (currentContainer && script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    } catch (err) {
      setError('giscus初始化失败');
      console.error('Giscus initialization error:', err);
    }
  }, [repo, repoId, category, categoryId, mapping, strict, reactionsEnabled, emitMetadata, inputPosition, lang, loading, giscusTheme, isLoaded]);
  
  // 主题切换时更新giscus主题
  useEffect(() => {
    if (!isLoaded) return;
    
    const timer = setTimeout(() => {
      updateGiscusTheme(giscusTheme);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [giscusTheme, isLoaded]);
  
  if (error) {
    return (
      <div className={`giscus-container mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 ${className}`}>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
              评论系统加载失败
            </h3>
          </div>
          <div className="mt-2 text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      ref={containerRef} 
      className={`giscus-container mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 ${className}`}
    >
      {!isLoaded && (
        <div className="flex items-center justify-center h-32 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>正在加载评论...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Giscus;