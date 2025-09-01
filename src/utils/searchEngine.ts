import type { Post } from '@/types/content';
import { searchCache } from './searchCache';

/**
 * 搜索选项接口
 */
export interface SearchOptions {
  maxResults?: number;
  includeContent?: boolean;
  fuzzy?: boolean;
  highlightMatches?: boolean;
  searchFields?: ('title' | 'content' | 'tags' | 'category')[];
}

/**
 * 高亮匹配结果接口
 */
export interface HighlightedPost extends Post {
  highlightedTitle?: string;
  highlightedExcerpt?: string;
  matchedFields: string[];
  relevanceScore: number;
}

/**
 * 增强的搜索结果接口
 */
export interface EnhancedSearchResult {
  posts: HighlightedPost[];
  total: number;
  query: string;
  suggestions: string[];
  searchTime: number;
  facets: {
    categories: { name: string; count: number }[];
    tags: { name: string; count: number }[];
  };
}

/**
 * 搜索引擎类
 * 提供全文搜索、建议搜索等功能
 */
export class SearchEngine {
  private posts: Post[] = [];
  private index: Map<string, Set<string>> = new Map();
  private titleIndex: Map<string, Set<string>> = new Map();
  private tagIndex: Map<string, Set<string>> = new Map();
  private categoryIndex: Map<string, Set<string>> = new Map();
  private initialized = false;

  /**
   * 初始化搜索引擎
   * @param posts 文章数组
   */
  initialize(posts: Post[]): void {
    this.posts = posts;
    this.buildIndex();
    this.initialized = true;
    console.log(`搜索引擎初始化完成，索引了 ${posts.length} 篇文章`);
  }

  /**
   * 检查是否已初始化
   */
  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error('搜索引擎尚未初始化，请先调用 initialize() 方法');
    }
  }

  /**
   * 构建搜索索引
   */
  private buildIndex(): void {
    console.log('开始构建搜索索引...');
    
    this.posts.forEach(post => {
      // 构建全文索引
      this.indexContent(post.slug, post.content);
      
      // 构建标题索引
      this.indexText(this.titleIndex, post.slug, post.title);
      
      // 构建标签索引
      post.tags.forEach(tag => {
        this.indexText(this.tagIndex, post.slug, tag);
      });
      
      // 构建分类索引
      this.indexText(this.categoryIndex, post.slug, post.category);
    });
    
    console.log('搜索索引构建完成');
  }

  /**
   * 索引文本内容
   */
  private indexText(index: Map<string, Set<string>>, postSlug: string, text: string): void {
    const words = this.tokenize(text);
    
    words.forEach(word => {
      if (!index.has(word)) {
        index.set(word, new Set());
      }
      index.get(word)!.add(postSlug);
    });
  }

  /**
   * 索引文章内容
   */
  private indexContent(postSlug: string, content: string): void {
    // 移除HTML标签和Markdown语法
    const plainText = this.stripMarkdown(content);
    this.indexText(this.index, postSlug, plainText);
  }

  /**
   * 移除Markdown语法，提取纯文本
   */
  private stripMarkdown(content: string): string {
    return content
      .replace(/<[^>]*>/g, '') // 移除HTML标签
      .replace(/```[\s\S]*?```/g, '') // 移除代码块
      .replace(/`[^`]*`/g, '') // 移除行内代码
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // 移除图片
      .replace(/\[[^\]]*\]\([^)]*\)/g, '') // 移除链接
      .replace(/#{1,6}\s/g, '') // 移除标题标记
      .replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, '$1') // 移除粗体斜体标记
      .replace(/\n+/g, ' ') // 换行符替换为空格
      .replace(/\s+/g, ' ') // 多个空格替换为单个空格
      .trim();
  }

  /**
   * 文本分词
   */
  private tokenize(text: string): string[] {
    // 转换为小写
    const lowerText = text.toLowerCase();
    
    // 提取中文字符、英文单词和数字
    const chineseChars = lowerText.match(/[\u4e00-\u9fa5]/g) || [];
    const englishWords = lowerText.match(/[a-z0-9]+/g) || [];
    
    // 合并并去重
    const words = [...new Set([...chineseChars, ...englishWords])];
    
    // 过滤掉过短的词
    return words.filter(word => word.length >= 1);
  }

  /**
   * 搜索文章（带缓存）
   * @param query 搜索查询
   * @param options 搜索选项
   * @returns 搜索结果
   */
  search(query: string, options: SearchOptions = {}): EnhancedSearchResult {
    // 尝试从缓存获取结果
    const cached = searchCache.get(query, options);
    if (cached) {
      return cached;
    }

    // 执行搜索
    const result = this.performSearch(query, options);
    
    // 缓存结果
    searchCache.set(query, result, options);
    
    return result;
  }

  /**
   * 执行搜索（不使用缓存）
   * @param query 搜索查询
   * @param options 搜索选项
   * @returns 搜索结果
   */
  private performSearch(query: string, options: SearchOptions = {}): EnhancedSearchResult {
    const startTime = performance.now();
    this.ensureInitialized();
    
    const { 
      maxResults = 10, 
      includeContent = false, 
      fuzzy = true,
      highlightMatches = true,
      searchFields = ['title', 'content', 'tags', 'category']
    } = options;
    
    if (!query.trim()) {
      return {
        posts: [],
        total: 0,
        query,
        suggestions: [],
        searchTime: performance.now() - startTime,
        facets: {
          categories: [],
          tags: []
        }
      };
    }

    const keywords = this.tokenize(query);
    const postScores = new Map<string, { score: number; matchedFields: Set<string> }>();

    // 搜索各个索引
    keywords.forEach(keyword => {
      // 标题搜索（权重最高）
      if (searchFields.includes('title')) {
        this.searchInIndexWithFields(this.titleIndex, keyword, postScores, 3.0, fuzzy, 'title');
      }
      
      // 标签搜索（权重较高）
      if (searchFields.includes('tags')) {
        this.searchInIndexWithFields(this.tagIndex, keyword, postScores, 2.0, fuzzy, 'tags');
      }
      
      // 分类搜索（权重中等）
      if (searchFields.includes('category')) {
        this.searchInIndexWithFields(this.categoryIndex, keyword, postScores, 1.5, fuzzy, 'category');
      }
      
      // 内容搜索（权重较低）
      if (searchFields.includes('content')) {
        this.searchInIndexWithFields(this.index, keyword, postScores, 1.0, fuzzy, 'content');
      }
    });

    // 按分数排序并获取文章
    const sortedResults = Array.from(postScores.entries())
      .sort(([, a], [, b]) => b.score - a.score)
      .slice(0, maxResults)
      .map(([slug, { score, matchedFields }]) => {
        const post = this.posts.find(p => p.slug === slug)!;
        return this.createHighlightedPost(post, query, score, Array.from(matchedFields), highlightMatches);
      })
      .filter(Boolean);

    // 生成搜索建议
    const suggestions = this.getSuggestions(query);
    
    // 生成分面统计
    const facets = this.generateFacets(sortedResults);
    
    const searchTime = performance.now() - startTime;

    return {
      posts: includeContent ? sortedResults : sortedResults.map(post => ({
        ...post,
        content: '' // 不包含内容以减少数据量
      })),
      total: sortedResults.length,
      query,
      suggestions,
      searchTime,
      facets
    };
  }

  /**
   * 在指定索引中搜索（带字段信息）
   */
  private searchInIndexWithFields(
    index: Map<string, Set<string>>,
    keyword: string,
    postScores: Map<string, { score: number; matchedFields: Set<string> }>,
    weight: number,
    fuzzy: boolean,
    fieldName: string
  ): void {
    // 精确匹配
    if (index.has(keyword)) {
      index.get(keyword)!.forEach(postSlug => {
        const current = postScores.get(postSlug) || { score: 0, matchedFields: new Set() };
        current.score += weight;
        current.matchedFields.add(fieldName);
        postScores.set(postSlug, current);
      });
    }

    // 模糊匹配
    if (fuzzy && keyword.length >= 2) {
      index.forEach((postSlugs, indexedWord) => {
        if (indexedWord.includes(keyword) || keyword.includes(indexedWord)) {
          const similarity = this.calculateSimilarity(keyword, indexedWord);
          if (similarity > 0.5) {
            postSlugs.forEach(postSlug => {
              const current = postScores.get(postSlug) || { score: 0, matchedFields: new Set() };
              current.score += weight * similarity * 0.5;
              current.matchedFields.add(fieldName);
              postScores.set(postSlug, current);
            });
          }
        }
      });
    }
  }

  /**
   * 在指定索引中搜索（兼容旧版本）
   */
  private searchInIndex(
    index: Map<string, Set<string>>,
    keyword: string,
    postScores: Map<string, number>,
    weight: number,
    fuzzy: boolean
  ): void {
    // 精确匹配
    if (index.has(keyword)) {
      index.get(keyword)!.forEach(postSlug => {
        const currentScore = postScores.get(postSlug) || 0;
        postScores.set(postSlug, currentScore + weight);
      });
    }

    // 模糊匹配
    if (fuzzy && keyword.length >= 2) {
      index.forEach((postSlugs, indexedWord) => {
        if (indexedWord.includes(keyword) || keyword.includes(indexedWord)) {
          const similarity = this.calculateSimilarity(keyword, indexedWord);
          if (similarity > 0.5) {
            postSlugs.forEach(postSlug => {
              const currentScore = postScores.get(postSlug) || 0;
              postScores.set(postSlug, currentScore + weight * similarity * 0.5);
            });
          }
        }
      });
    }
  }

  /**
   * 计算字符串相似度
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) {
      return 1.0;
    }
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  /**
   * 计算编辑距离
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  /**
   * 创建高亮文章对象
   */
  private createHighlightedPost(
    post: Post, 
    query: string, 
    score: number, 
    matchedFields: string[], 
    highlightMatches: boolean
  ): HighlightedPost {
    const highlightedPost: HighlightedPost = {
      ...post,
      matchedFields,
      relevanceScore: Math.round(score * 100) / 100
    };

    if (highlightMatches) {
      const keywords = this.tokenize(query);
      
      // 高亮标题
      if (matchedFields.includes('title')) {
        highlightedPost.highlightedTitle = this.highlightText(post.title, keywords);
      }
      
      // 高亮摘要
      if (matchedFields.includes('content') && post.excerpt) {
        highlightedPost.highlightedExcerpt = this.highlightText(post.excerpt, keywords);
      }
    }

    return highlightedPost;
  }

  /**
   * 高亮文本中的关键词
   */
  private highlightText(text: string, keywords: string[]): string {
    let highlightedText = text;
    
    keywords.forEach(keyword => {
      if (keyword.length >= 2) {
        const regex = new RegExp(`(${this.escapeRegExp(keyword)})`, 'gi');
        highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
      }
    });
    
    return highlightedText;
  }

  /**
   * 转义正则表达式特殊字符
   */
  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * 生成分面统计
   */
  private generateFacets(results: HighlightedPost[]): {
    categories: { name: string; count: number }[];
    tags: { name: string; count: number }[];
  } {
    const categoryCount = new Map<string, number>();
    const tagCount = new Map<string, number>();

    results.forEach(post => {
      // 统计分类
      const currentCategoryCount = categoryCount.get(post.category) || 0;
      categoryCount.set(post.category, currentCategoryCount + 1);

      // 统计标签
      post.tags.forEach(tag => {
        const currentTagCount = tagCount.get(tag) || 0;
        tagCount.set(tag, currentTagCount + 1);
      });
    });

    return {
      categories: Array.from(categoryCount.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
      tags: Array.from(tagCount.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10) // 限制标签数量
    };
  }



  /**
   * 获取热门搜索词
   */
  getPopularSearchTerms(): string[] {
    this.ensureInitialized();
    
    const termFrequency = new Map<string, number>();
    
    // 统计词频
    this.posts.forEach(post => {
      const words = this.tokenize(post.title + ' ' + post.excerpt);
      words.forEach(word => {
        if (word.length >= 2) {
          const count = termFrequency.get(word) || 0;
          termFrequency.set(word, count + 1);
        }
      });
    });
    
    // 按频率排序并返回前20个
    return Array.from(termFrequency.entries())
      .sort(([, freqA], [, freqB]) => freqB - freqA)
      .slice(0, 20)
      .map(([term]) => term);
  }

  /**
   * 获取搜索索引统计信息
   */
  getIndexStats(): {
    totalPosts: number;
    totalTerms: number;
    titleTerms: number;
    tagTerms: number;
    categoryTerms: number;
  } {
    this.ensureInitialized();
    
    return {
      totalPosts: this.posts.length,
      totalTerms: this.index.size,
      titleTerms: this.titleIndex.size,
      tagTerms: this.tagIndex.size,
      categoryTerms: this.categoryIndex.size
    };
  }

  /**
   * 导出搜索索引（用于静态生成）
   */
  exportIndex(): {
    posts: Post[];
    index: Record<string, string[]>;
    titleIndex: Record<string, string[]>;
    tagIndex: Record<string, string[]>;
    categoryIndex: Record<string, string[]>;
  } {
    this.ensureInitialized();
    
    const convertMapToObject = (map: Map<string, Set<string>>) => {
      const obj: Record<string, string[]> = {};
      map.forEach((postSlugs, term) => {
        obj[term] = Array.from(postSlugs);
      });
      return obj;
    };
    
    return {
      posts: this.posts,
      index: convertMapToObject(this.index),
      titleIndex: convertMapToObject(this.titleIndex),
      tagIndex: convertMapToObject(this.tagIndex),
      categoryIndex: convertMapToObject(this.categoryIndex)
    };
  }

  /**
   * 从导出的索引数据导入
   */
  importIndex(data: {
    posts: Post[];
    index: Record<string, string[]>;
    titleIndex: Record<string, string[]>;
    tagIndex: Record<string, string[]>;
    categoryIndex: Record<string, string[]>;
  }): void {
    const convertObjectToMap = (obj: Record<string, string[]>) => {
      const map = new Map<string, Set<string>>();
      Object.entries(obj).forEach(([term, postSlugs]) => {
        map.set(term, new Set(postSlugs));
      });
      return map;
    };
    
    this.posts = data.posts;
    this.index = convertObjectToMap(data.index);
    this.titleIndex = convertObjectToMap(data.titleIndex);
    this.tagIndex = convertObjectToMap(data.tagIndex);
    this.categoryIndex = convertObjectToMap(data.categoryIndex);
    this.initialized = true;
    
    console.log(`搜索引擎从导入数据初始化完成，索引了 ${this.posts.length} 篇文章`);
  }

  /**
   * 清空搜索缓存
   */
  clearCache(): void {
    searchCache.clear();
  }

  /**
   * 获取缓存统计信息
   */
  getCacheStats() {
    return searchCache.getStats();
  }

  /**
   * 预热搜索缓存
   * @param queries 预热查询列表
   */
  async warmupCache(queries: string[] = []): Promise<void> {
    this.ensureInitialized();
    
    // 默认预热查询
    const defaultQueries = [
      ...this.getPopularSearchTerms().slice(0, 10),
      ...queries
    ];

    await searchCache.warmup(defaultQueries, (query) => 
      Promise.resolve(this.performSearch(query))
    );
  }

  /**
   * 批量搜索
   * @param queries 查询列表
   * @param options 搜索选项
   * @returns 搜索结果映射
   */
  batchSearch(
    queries: string[], 
    options: SearchOptions = {}
  ): Map<string, EnhancedSearchResult> {
    const results = new Map<string, EnhancedSearchResult>();
    
    queries.forEach(query => {
      if (query.trim()) {
        results.set(query, this.search(query, options));
      }
    });
    
    return results;
  }

  /**
   * 获取搜索建议（优化版）
   * @param query 查询字符串
   * @param maxSuggestions 最大建议数量
   * @returns 建议列表
   */
  getSuggestions(query: string, maxSuggestions: number = 5): string[] {
    if (!query.trim() || query.length < 2) {
      return [];
    }

    const suggestions = new Set<string>();
    const queryLower = query.toLowerCase();

    // 从标题索引获取建议
    this.titleIndex.forEach((postSlugs, term) => {
      if (term.includes(queryLower) && suggestions.size < maxSuggestions * 2) {
        // 获取对应的文章标题
        postSlugs.forEach(slug => {
          const post = this.posts.find(p => p.slug === slug);
          if (post && suggestions.size < maxSuggestions * 2) {
            suggestions.add(post.title);
          }
        });
      }
    });

    // 从标签索引获取建议
    this.tagIndex.forEach((postSlugs, tag) => {
      if (tag.includes(queryLower) && suggestions.size < maxSuggestions * 2) {
        suggestions.add(tag);
      }
    });

    return Array.from(suggestions).slice(0, maxSuggestions);
  }
}

// 导出单例实例
export const searchEngine = new SearchEngine();