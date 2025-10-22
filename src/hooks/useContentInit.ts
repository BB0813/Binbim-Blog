import { useState, useEffect } from 'react';
import { contentManager } from '@/utils/contentManager';

interface UseContentInitReturn {
  initialized: boolean;
  loading: boolean;
  error: string | null;
}

/**
 * 内容初始化Hook
 * 确保contentManager在使用前已经初始化
 */
export function useContentInit(): UseContentInitReturn {
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeContent = async () => {
      try {
        setLoading(true);
        setError(null);

        // 检查是否已经初始化
        if (contentManager['initialized']) {
          setInitialized(true);
          setLoading(false);
          return;
        }

        // 从实际的content目录加载Markdown文件
        // 在实际应用中，这些文件应该通过构建脚本或API加载
        const markdownFiles: Array<{ content: string; path: string }> = [];
        
        // 由于我们删除了示例文章，这里初始化为空数组
        // 用户可以在content/posts目录下添加自己的文章
        
        // 初始化contentManager
        await contentManager.initialize(markdownFiles);

        setInitialized(true);
        console.warn('内容管理系统初始化完成');
      } catch (err) {
        setError(err instanceof Error ? err.message : '初始化失败');
        console.error('内容管理系统初始化失败:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeContent();
  }, []);

  return { initialized, loading, error };
}
