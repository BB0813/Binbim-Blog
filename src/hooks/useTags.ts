import { useState, useEffect } from 'react';
import { contentManager } from '@/utils/contentManager';
import { useContentInit } from './useContentInit';
import type { Tag, Post } from '@/types/content';

interface UseTagsReturn {
  tags: Tag[];
  loading: boolean;
  error: string | null;
}

interface UseTagPostsReturn {
  posts: Post[];
  tag: Tag | null;
  loading: boolean;
  error: string | null;
  total: number;
}

/**
 * 获取所有标签的Hook
 */
export function useTags(): UseTagsReturn {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { initialized, loading: initLoading, error: initError } = useContentInit();

  useEffect(() => {
    if (initError) {
      setError(initError);
      setLoading(false);
      return;
    }

    if (!initialized || initLoading) {
      return;
    }

    try {
      const allTags = contentManager.getTags();
      setTags(allTags);
      setError(null);
    } catch (err) {
      console.error('获取标签失败:', err);
      setError(err instanceof Error ? err.message : '获取标签失败');
    } finally {
      setLoading(false);
    }
  }, [initialized, initLoading, initError]);

  return { tags, loading, error };
}

/**
 * 获取特定标签的文章的Hook
 */
export function useTagPosts(tagName?: string): UseTagPostsReturn {
  const [posts, setPosts] = useState<Post[]>([]);
  const [tag, setTag] = useState<Tag | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const { initialized, loading: initLoading, error: initError } = useContentInit();

  useEffect(() => {
    if (initError) {
      setError(initError);
      setLoading(false);
      return;
    }

    if (!initialized || initLoading) {
      return;
    }

    try {
      if (tagName) {
        // 获取特定标签的文章
        const response = contentManager.getPosts({ tag: tagName });
        setPosts(response.posts);
        setTotal(response.total);
        
        // 获取标签信息
        const allTags = contentManager.getTags();
        const foundTag = allTags.find(t => t.name === tagName || t.slug === tagName);
        setTag(foundTag || null);
      } else {
        // 如果没有指定标签，获取所有文章
        const response = contentManager.getPosts();
        setPosts(response.posts);
        setTotal(response.total);
        setTag(null);
      }
      setError(null);
    } catch (err) {
      console.error('获取标签文章失败:', err);
      setError(err instanceof Error ? err.message : '获取标签文章失败');
    } finally {
      setLoading(false);
    }
  }, [tagName, initialized, initLoading, initError]);

  return { posts, tag, loading, error, total };
}

/**
 * 获取热门标签的Hook
 */
export function usePopularTags(count: number = 10): UseTagsReturn {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { initialized, loading: initLoading, error: initError } = useContentInit();

  useEffect(() => {
    if (initError) {
      setError(initError);
      setLoading(false);
      return;
    }

    if (!initialized || initLoading) {
      return;
    }

    try {
      const popularTags = contentManager.getPopularTags(count);
      setTags(popularTags);
      setError(null);
    } catch (err) {
      console.error('获取热门标签失败:', err);
      setError(err instanceof Error ? err.message : '获取热门标签失败');
    } finally {
      setLoading(false);
    }
  }, [count, initialized, initLoading, initError]);

  return { tags, loading, error };
}