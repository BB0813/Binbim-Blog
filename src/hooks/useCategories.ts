import { useState, useEffect } from 'react';
import { contentManager } from '@/utils/contentManager';
import { useContentInit } from './useContentInit';
import type { Category, Post } from '@/types/content';

interface UseCategoriesReturn {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

interface UseCategoryPostsReturn {
  posts: Post[];
  category: Category | null;
  loading: boolean;
  error: string | null;
  totalPosts: number;
}

/**
 * 获取所有分类的Hook
 */
export function useCategories(): UseCategoriesReturn {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { initialized, loading: initLoading, error: initError } = useContentInit();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        if (!initialized) {
          return; // 等待初始化完成
        }
        
        setLoading(true);
        setError(null);
        
        const categoriesData = contentManager.getCategories();
        setCategories(categoriesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载分类失败');
        console.error('加载分类失败:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [initialized]);

  // 如果初始化出错，返回初始化错误
  if (initError) {
    return { categories: [], loading: false, error: initError };
  }

  // 如果还在初始化中，返回加载状态
  if (initLoading || !initialized) {
    return { categories: [], loading: true, error: null };
  }

  return { categories, loading, error };
}

/**
 * 获取特定分类下文章的Hook
 */
export function useCategoryPosts(categoryName: string): UseCategoryPostsReturn {
  const [posts, setPosts] = useState<Post[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPosts, setTotalPosts] = useState(0);
  const { initialized, loading: initLoading, error: initError } = useContentInit();

  useEffect(() => {
    const loadCategoryPosts = async () => {
      try {
        if (!initialized) {
          return; // 等待初始化完成
        }
        
        setLoading(true);
        setError(null);
        
        if (!categoryName) {
          throw new Error('分类名称不能为空');
        }
        
        // 获取分类信息
        const categories = contentManager.getCategories();
        const categoryInfo = categories.find(cat => 
          cat.name === categoryName || cat.slug === categoryName
        );
        
        if (!categoryInfo) {
          throw new Error(`分类 "${categoryName}" 不存在`);
        }
        
        setCategory(categoryInfo);
        
        // 获取该分类下的文章
        const postsResponse = contentManager.getPosts({
          category: categoryInfo.name,
          pageSize: 100 // 暂时获取所有文章
        });
        
        setPosts(postsResponse.posts);
        setTotalPosts(postsResponse.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载分类文章失败');
        console.error('加载分类文章失败:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCategoryPosts();
  }, [categoryName, initialized]);

  // 如果初始化出错，返回初始化错误
  if (initError) {
    return { posts: [], category: null, loading: false, error: initError, totalPosts: 0 };
  }

  // 如果还在初始化中，返回加载状态
  if (initLoading || !initialized) {
    return { posts: [], category: null, loading: true, error: null, totalPosts: 0 };
  }

  return { posts, category, loading, error, totalPosts };
}