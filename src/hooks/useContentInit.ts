import { useState, useEffect } from 'react';
import { contentManager } from '@/utils/contentManager';

interface UseContentInitReturn {
  initialized: boolean;
  loading: boolean;
  error: string | null;
}

export function useContentInit(): UseContentInitReturn {
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeContent = async () => {
      try {
        setLoading(true);
        setError(null);

        // 如果已经初始化，直接返回
        if (contentManager.isInitialized()) {
          setInitialized(true);
          setLoading(false);
          return;
        }

        try {
          // 动态获取基础路径，适配 GitHub Pages 子路径
          const baseUrl = import.meta.env.BASE_URL || '/';
          const apiUrl = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}api/posts.json`.replace(/\/+/g, '/');
          
          const res = await fetch(apiUrl);
          if (res.ok) {
            const data = await res.json();
            const posts = Array.isArray(data.posts) ? data.posts : [];
            if (posts.length > 0) {
              contentManager.loadFromPosts(posts);
              setInitialized(true);
              return;
            }
          }
        } catch (e) {
          console.warn('无法从 API 加载内容，尝试降级处理', e);
        }

        // 兜底方案：如果 API 失败，尝试加载空列表或默认数据
        await contentManager.initialize([]);
        (contentManager as any).initialized = true;
        setInitialized(true);
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
