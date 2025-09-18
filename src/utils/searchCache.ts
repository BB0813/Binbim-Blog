/**
 * 搜索缓存管理器
 * 提供搜索结果缓存、LRU淘汰策略等功能
 */

import type { EnhancedSearchResult } from './searchEngine';

/**
 * 缓存项接口
 */
interface CacheItem {
  result: EnhancedSearchResult;
  timestamp: number;
  accessCount: number;
  lastAccessed: number;
}

/**
 * 缓存配置接口
 */
export interface SearchCacheConfig {
  maxSize?: number;
  ttl?: number; // 缓存生存时间（毫秒）
  enablePersistence?: boolean;
  storageKey?: string;
}

/**
 * 搜索缓存类
 */
export class SearchCache {
  private cache = new Map<string, CacheItem>();
  private accessOrder: string[] = [];
  private config: Required<SearchCacheConfig>;

  constructor(config: SearchCacheConfig = {}) {
    this.config = {
      maxSize: 50,
      ttl: 5 * 60 * 1000, // 5分钟
      enablePersistence: true,
      storageKey: 'blog-search-cache',
      ...config
    };

    // 从localStorage加载缓存
    if (this.config.enablePersistence) {
      this.loadFromStorage();
    }

    // 定期清理过期缓存
    setInterval(() => this.cleanup(), 60 * 1000); // 每分钟清理一次
  }

  /**
   * 生成缓存键
   */
  private generateKey(query: string, options: Record<string, unknown> = {}): string {
    const optionsStr = JSON.stringify({
      maxResults: options.maxResults || 10,
      searchFields: options.searchFields || ['title', 'content', 'tags', 'category'],
      fuzzy: options.fuzzy !== false
    });
    return `${query.toLowerCase().trim()}:${btoa(optionsStr)}`;
  }

  /**
   * 获取缓存结果
   */
  get(query: string, options: Record<string, unknown> = {}): EnhancedSearchResult | null {
    const key = this.generateKey(query, options);
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    // 检查是否过期
    if (Date.now() - item.timestamp > this.config.ttl) {
      this.cache.delete(key);
      this.removeFromAccessOrder(key);
      return null;
    }

    // 更新访问信息
    item.accessCount++;
    item.lastAccessed = Date.now();
    this.updateAccessOrder(key);

    return item.result;
  }

  /**
   * 设置缓存结果
   */
  set(query: string, result: EnhancedSearchResult, options: Record<string, unknown> = {}): void {
    const key = this.generateKey(query, options);
    
    // 如果缓存已满，移除最少使用的项
    if (this.cache.size >= this.config.maxSize && !this.cache.has(key)) {
      this.evictLRU();
    }

    const item: CacheItem = {
      result,
      timestamp: Date.now(),
      accessCount: 1,
      lastAccessed: Date.now()
    };

    this.cache.set(key, item);
    this.updateAccessOrder(key);

    // 持久化到localStorage
    if (this.config.enablePersistence) {
      this.saveToStorage();
    }
  }

  /**
   * 更新访问顺序
   */
  private updateAccessOrder(key: string): void {
    // 移除旧位置
    this.removeFromAccessOrder(key);
    // 添加到末尾（最近访问）
    this.accessOrder.push(key);
  }

  /**
   * 从访问顺序中移除
   */
  private removeFromAccessOrder(key: string): void {
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
  }

  /**
   * LRU淘汰策略
   */
  private evictLRU(): void {
    if (this.accessOrder.length === 0) return;

    // 移除最少使用的项（访问顺序的第一个）
    const lruKey = this.accessOrder[0];
    this.cache.delete(lruKey);
    this.removeFromAccessOrder(lruKey);
  }

  /**
   * 清理过期缓存
   */
  private cleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    this.cache.forEach((item, key) => {
      if (now - item.timestamp > this.config.ttl) {
        expiredKeys.push(key);
      }
    });

    expiredKeys.forEach(key => {
      this.cache.delete(key);
      this.removeFromAccessOrder(key);
    });

    if (expiredKeys.length > 0 && this.config.enablePersistence) {
      this.saveToStorage();
    }
  }

  /**
   * 清空缓存
   */
  clear(): void {
    this.cache.clear();
    this.accessOrder = [];
    
    if (this.config.enablePersistence) {
      localStorage.removeItem(this.config.storageKey);
    }
  }

  /**
   * 获取缓存统计信息
   */
  getStats(): {
    size: number;
    maxSize: number;
    hitRate: number;
    totalAccess: number;
    averageAccessCount: number;
  } {
    const totalAccess = Array.from(this.cache.values())
      .reduce((sum, item) => sum + item.accessCount, 0);
    
    const averageAccessCount = this.cache.size > 0 
      ? totalAccess / this.cache.size 
      : 0;

    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      hitRate: 0, // 需要在使用时统计
      totalAccess,
      averageAccessCount: Math.round(averageAccessCount * 100) / 100
    };
  }

  /**
   * 保存到localStorage
   */
  private saveToStorage(): void {
    try {
      const data = {
        cache: Array.from(this.cache.entries()),
        accessOrder: this.accessOrder,
        timestamp: Date.now()
      };
      
      localStorage.setItem(this.config.storageKey, JSON.stringify(data));
    } catch (error) {
      console.warn('搜索缓存保存失败:', error);
    }
  }

  /**
   * 从localStorage加载
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.config.storageKey);
      if (!stored) return;

      const data = JSON.parse(stored);
      
      // 检查数据是否过期
      if (Date.now() - data.timestamp > this.config.ttl) {
        localStorage.removeItem(this.config.storageKey);
        return;
      }

      // 恢复缓存
      this.cache = new Map(data.cache);
      this.accessOrder = data.accessOrder || [];

      // 清理过期项
      this.cleanup();
    } catch (error) {
      console.warn('搜索缓存加载失败:', error);
      localStorage.removeItem(this.config.storageKey);
    }
  }

  /**
   * 预热缓存
   */
  async warmup(queries: string[], searchFunction: (query: string) => Promise<EnhancedSearchResult>): Promise<void> {
    const promises = queries.map(async (query) => {
      if (!this.get(query)) {
        try {
          const result = await searchFunction(query);
          this.set(query, result);
        } catch (error) {
          console.warn(`预热缓存失败: ${query}`, error);
        }
      }
    });

    await Promise.all(promises);
  }
}

// 导出单例实例
export const searchCache = new SearchCache();

/**
 * 搜索缓存装饰器
 * 为搜索函数添加缓存功能
 */
export function withSearchCache<T extends (...args: unknown[]) => EnhancedSearchResult>(
  searchFunction: T,
  cache: SearchCache = searchCache
): T {
  return ((...args: unknown[]) => {
    const [query, options] = args;
    
    // 尝试从缓存获取
    const cached = cache.get(query, options);
    if (cached) {
      return cached;
    }

    // 执行搜索并缓存结果
    const result = searchFunction(...args);
    cache.set(query, result, options);
    
    return result;
  }) as T;
}

/**
 * 异步搜索缓存装饰器
 */
export function withAsyncSearchCache<T extends (...args: unknown[]) => Promise<EnhancedSearchResult>>(
  searchFunction: T,
  cache: SearchCache = searchCache
): T {
  return (async (...args: unknown[]) => {
    const [query, options] = args;
    
    // 尝试从缓存获取
    const cached = cache.get(query, options);
    if (cached) {
      return cached;
    }

    // 执行搜索并缓存结果
    const result = await searchFunction(...args);
    cache.set(query, result, options);
    
    return result;
  }) as T;
}