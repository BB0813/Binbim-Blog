import { useState, useEffect, useMemo } from 'react';
import { contentManager } from '@/utils/contentManager';
import { useContentInit } from './useContentInit';
import type { ArchiveData, Post } from '@/types/content';

/**
 * 归档统计信息接口
 */
export interface ArchiveStats {
  totalPosts: number;
  totalYears: number;
  averagePostsPerYear: number;
  averageReadingTime: number;
  oldestPost?: Post;
  newestPost?: Post;
}

/**
 * 归档Hook配置接口
 */
export interface UseArchiveConfig {
  enableStats?: boolean;
  sortOrder?: 'desc' | 'asc';
}

/**
 * 归档Hook返回值接口
 */
export interface UseArchiveReturn {
  archiveData: ArchiveData[];
  stats: ArchiveStats;
  loading: boolean;
  error: string | null;

  // 导航功能
  scrollToYear: (year: number) => void;
  getYearList: () => number[];

  // 搜索功能
  searchByYear: (year: number) => ArchiveData | null;
  searchByMonth: (year: number, month: number) => Post[];
}

/**
 * 归档数据管理Hook
 * 提供归档数据获取、统计信息计算和导航功能
 */
export function useArchive(config: UseArchiveConfig = {}): UseArchiveReturn {
  const { enableStats = true, sortOrder = 'desc' } = config;

  const [archiveData, setArchiveData] = useState<ArchiveData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 使用内容初始化Hook
  const { initialized, error: initError } = useContentInit();

  // 获取归档数据
  useEffect(() => {
    if (!initialized) return;

    const fetchArchiveData = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = contentManager.getArchiveData();

        // 根据配置排序
        const sortedData = [...data].sort((a, b) => {
          return sortOrder === 'desc' ? b.year - a.year : a.year - b.year;
        });

        setArchiveData(sortedData);
      } catch (err) {
        console.error('获取归档数据失败:', err);
        setError(err instanceof Error ? err.message : '获取归档数据失败');
      } finally {
        setLoading(false);
      }
    };

    fetchArchiveData();
  }, [initialized, sortOrder]);

  // 处理初始化错误
  useEffect(() => {
    if (initError) {
      setError(initError);
      setLoading(false);
    }
  }, [initError]);

  // 计算统计信息
  const stats = useMemo((): ArchiveStats => {
    if (!enableStats || archiveData.length === 0) {
      return {
        totalPosts: 0,
        totalYears: 0,
        averagePostsPerYear: 0,
        averageReadingTime: 0,
      };
    }

    const allPosts = archiveData.flatMap(year =>
      year.months.flatMap(month => month.posts)
    );

    const totalPosts = allPosts.length;
    const totalYears = archiveData.length;
    const averagePostsPerYear = totalYears > 0 ? totalPosts / totalYears : 0;

    const totalReadingTime = allPosts.reduce(
      (sum, post) => sum + post.readingTime,
      0
    );
    const averageReadingTime =
      totalPosts > 0 ? totalReadingTime / totalPosts : 0;

    // 找到最新和最旧的文章
    const sortedPosts = [...allPosts].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return {
      totalPosts,
      totalYears,
      averagePostsPerYear: Math.round(averagePostsPerYear * 10) / 10,
      averageReadingTime: Math.round(averageReadingTime * 10) / 10,
      oldestPost: sortedPosts[0],
      newestPost: sortedPosts[sortedPosts.length - 1],
    };
  }, [archiveData, enableStats]);

  // 滚动到指定年份
  const scrollToYear = (year: number) => {
    const element = document.getElementById(`year-${year}`);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  // 获取年份列表
  const getYearList = (): number[] => {
    return archiveData.map(item => item.year);
  };

  // 按年份搜索
  const searchByYear = (year: number): ArchiveData | null => {
    return archiveData.find(item => item.year === year) || null;
  };

  // 按年月搜索
  const searchByMonth = (year: number, month: number): Post[] => {
    const yearData = searchByYear(year);
    if (!yearData) return [];

    const monthData = yearData.months.find(m => m.month === month);
    return monthData ? monthData.posts : [];
  };

  return {
    archiveData,
    stats,
    loading,
    error,
    scrollToYear,
    getYearList,
    searchByYear,
    searchByMonth,
  };
}

/**
 * 简化的归档Hook
 * 用于快速获取归档数据
 */
export function useSimpleArchive() {
  const archive = useArchive({
    enableStats: false,
    sortOrder: 'desc',
  });

  return {
    archiveData: archive.archiveData,
    loading: archive.loading,
    error: archive.error,
    scrollToYear: archive.scrollToYear,
  };
}
