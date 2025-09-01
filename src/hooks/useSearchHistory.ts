import { useState, useEffect, useCallback } from 'react';

/**
 * 搜索历史项接口
 */
export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: number;
  resultCount?: number;
}

/**
 * 搜索历史配置接口
 */
export interface UseSearchHistoryConfig {
  maxItems?: number;
  storageKey?: string;
  enablePersistence?: boolean;
}

/**
 * 搜索历史Hook
 * 管理用户搜索历史记录
 */
export function useSearchHistory(config: UseSearchHistoryConfig = {}) {
  const {
    maxItems = 20,
    storageKey = 'blog-search-history',
    enablePersistence = true
  } = config;

  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 从localStorage加载历史记录
  useEffect(() => {
    if (!enablePersistence) {
      setLoading(false);
      return;
    }

    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsedHistory = JSON.parse(stored) as SearchHistoryItem[];
        // 验证数据格式并按时间排序
        const validHistory = parsedHistory
          .filter(item => 
            item && 
            typeof item.query === 'string' && 
            typeof item.timestamp === 'number'
          )
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, maxItems);
        
        setHistory(validHistory);
      }
    } catch (error) {
      console.error('加载搜索历史失败:', error);
      // 清除损坏的数据
      localStorage.removeItem(storageKey);
    } finally {
      setLoading(false);
    }
  }, [storageKey, maxItems, enablePersistence]);

  // 保存历史记录到localStorage
  const saveToStorage = useCallback((newHistory: SearchHistoryItem[]) => {
    if (!enablePersistence) return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(newHistory));
    } catch (error) {
      console.error('保存搜索历史失败:', error);
    }
  }, [storageKey, enablePersistence]);

  // 添加搜索记录
  const addSearchRecord = useCallback((query: string, resultCount?: number) => {
    if (!query.trim()) return;

    const newItem: SearchHistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      query: query.trim(),
      timestamp: Date.now(),
      resultCount
    };

    setHistory(prevHistory => {
      // 移除重复的查询
      const filteredHistory = prevHistory.filter(
        item => item.query.toLowerCase() !== query.toLowerCase()
      );
      
      // 添加新记录并限制数量
      const newHistory = [newItem, ...filteredHistory].slice(0, maxItems);
      
      // 保存到localStorage
      saveToStorage(newHistory);
      
      return newHistory;
    });
  }, [maxItems, saveToStorage]);

  // 删除特定记录
  const removeSearchRecord = useCallback((id: string) => {
    setHistory(prevHistory => {
      const newHistory = prevHistory.filter(item => item.id !== id);
      saveToStorage(newHistory);
      return newHistory;
    });
  }, [saveToStorage]);

  // 清空所有历史记录
  const clearHistory = useCallback(() => {
    setHistory([]);
    if (enablePersistence) {
      localStorage.removeItem(storageKey);
    }
  }, [storageKey, enablePersistence]);

  // 获取最近的搜索记录
  const getRecentSearches = useCallback((count: number = 5) => {
    return history.slice(0, count);
  }, [history]);

  // 获取热门搜索词（基于频率）
  const getPopularSearches = useCallback((count: number = 5) => {
    const queryCount = new Map<string, number>();
    
    history.forEach(item => {
      const query = item.query.toLowerCase();
      queryCount.set(query, (queryCount.get(query) || 0) + 1);
    });
    
    return Array.from(queryCount.entries())
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, count)
      .map(([query]) => query);
  }, [history]);

  // 搜索历史记录
  const searchHistory = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return history;
    
    const query = searchQuery.toLowerCase();
    return history.filter(item => 
      item.query.toLowerCase().includes(query)
    );
  }, [history]);

  // 获取搜索统计
  const getSearchStats = useCallback(() => {
    const totalSearches = history.length;
    const uniqueQueries = new Set(history.map(item => item.query.toLowerCase())).size;
    const averageResultCount = history
      .filter(item => typeof item.resultCount === 'number')
      .reduce((sum, item, _, arr) => sum + (item.resultCount || 0) / arr.length, 0);
    
    const oldestSearch = history.length > 0 
      ? Math.min(...history.map(item => item.timestamp))
      : null;
    
    const newestSearch = history.length > 0
      ? Math.max(...history.map(item => item.timestamp))
      : null;

    return {
      totalSearches,
      uniqueQueries,
      averageResultCount: Math.round(averageResultCount * 10) / 10,
      oldestSearch: oldestSearch ? new Date(oldestSearch) : null,
      newestSearch: newestSearch ? new Date(newestSearch) : null,
      searchFrequency: totalSearches > 0 && oldestSearch && newestSearch
        ? totalSearches / Math.max(1, (newestSearch - oldestSearch) / (1000 * 60 * 60 * 24)) // 每天搜索次数
        : 0
    };
  }, [history]);

  // 导出历史记录
  const exportHistory = useCallback(() => {
    const exportData = {
      version: '1.0',
      exportTime: new Date().toISOString(),
      history: history
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `search-history-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [history]);

  // 导入历史记录
  const importHistory = useCallback((file: File) => {
    return new Promise<boolean>((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const importData = JSON.parse(content);
          
          if (importData.history && Array.isArray(importData.history)) {
            const validHistory = importData.history
              .filter((item: any) => 
                item && 
                typeof item.query === 'string' && 
                typeof item.timestamp === 'number'
              )
              .map((item: any) => ({
                id: item.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                query: item.query,
                timestamp: item.timestamp,
                resultCount: item.resultCount
              }));
            
            // 合并现有历史记录，去重并排序
            const mergedHistory = [...history, ...validHistory]
              .reduce((acc, item) => {
                const existing = acc.find(h => h.query.toLowerCase() === item.query.toLowerCase());
                if (!existing || existing.timestamp < item.timestamp) {
                  return acc.filter(h => h.query.toLowerCase() !== item.query.toLowerCase()).concat(item);
                }
                return acc;
              }, [] as SearchHistoryItem[])
              .sort((a, b) => b.timestamp - a.timestamp)
              .slice(0, maxItems);
            
            setHistory(mergedHistory);
            saveToStorage(mergedHistory);
            resolve(true);
          } else {
            reject(new Error('无效的历史记录格式'));
          }
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('文件读取失败'));
      reader.readAsText(file);
    });
  }, [history, maxItems, saveToStorage]);

  return {
    // 状态
    history,
    loading,
    
    // 基础操作
    addSearchRecord,
    removeSearchRecord,
    clearHistory,
    
    // 查询操作
    getRecentSearches,
    getPopularSearches,
    searchHistory,
    
    // 统计和分析
    getSearchStats,
    
    // 导入导出
    exportHistory,
    importHistory,
    
    // 配置
    config: {
      maxItems,
      storageKey,
      enablePersistence
    }
  };
}

/**
 * 简化的搜索历史Hook
 * 用于快速集成基础历史记录功能
 */
export function useSimpleSearchHistory() {
  const history = useSearchHistory({
    maxItems: 10,
    enablePersistence: true
  });

  return {
    recentSearches: history.getRecentSearches(5),
    addSearch: history.addSearchRecord,
    clearHistory: history.clearHistory,
    loading: history.loading
  };
}