import { useState, useEffect, useCallback, useMemo } from 'react';
import { searchEngine, type SearchOptions, type EnhancedSearchResult } from '@/utils/searchEngine';
import { contentManager } from '@/utils/contentManager';
import { useDebounce } from './useDebounce';

/**
 * 搜索状态接口
 */
export interface SearchState {
  query: string;
  results: EnhancedSearchResult | null;
  loading: boolean;
  error: string | null;
  suggestions: string[];
  popularTerms: string[];
}

/**
 * 搜索配置接口
 */
export interface UseSearchConfig {
  debounceMs?: number;
  minQueryLength?: number;
  maxResults?: number;
  enableSuggestions?: boolean;
  enablePopularTerms?: boolean;
  searchOptions?: Partial<SearchOptions>;
}

/**
 * 搜索Hook
 * 提供搜索功能、建议、热门搜索词等
 */
export function useSearch(config: UseSearchConfig = {}) {
  const {
    debounceMs = 300,
    minQueryLength = 2,
    maxResults = 10,
    enableSuggestions = true,
    enablePopularTerms = true,
    searchOptions = {}
  } = config;

  const [state, setState] = useState<SearchState>({
    query: '',
    results: null,
    loading: false,
    error: null,
    suggestions: [],
    popularTerms: []
  });

  // 防抖查询
  const debouncedQuery = useDebounce(state.query, debounceMs);

  // 初始化搜索引擎
  useEffect(() => {
    const initializeSearch = async () => {
      try {
        if (!searchEngine['initialized']) {
          const posts = contentManager.getAllPosts();
          searchEngine.initialize(posts);
        }
        
        // 获取热门搜索词
        if (enablePopularTerms) {
          const popularTerms = searchEngine.getPopularSearchTerms();
          setState(prev => ({ ...prev, popularTerms }));
        }
      } catch (error) {
        console.error('搜索引擎初始化失败:', error);
        setState(prev => ({ 
          ...prev, 
          error: '搜索功能初始化失败' 
        }));
      }
    };

    initializeSearch();
  }, [enablePopularTerms]);

  // 执行搜索
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim() || query.length < minQueryLength) {
      setState(prev => ({ 
        ...prev, 
        results: null, 
        loading: false,
        suggestions: []
      }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const searchResult = searchEngine.search(query, {
        maxResults,
        includeContent: false,
        highlightMatches: true,
        ...searchOptions
      });

      setState(prev => ({
        ...prev,
        results: searchResult,
        loading: false,
        suggestions: enableSuggestions ? searchResult.suggestions : []
      }));
    } catch (error) {
      console.error('搜索执行失败:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: '搜索执行失败，请稍后重试'
      }));
    }
  }, [minQueryLength, maxResults, enableSuggestions, searchOptions]);

  // 监听防抖查询变化
  useEffect(() => {
    performSearch(debouncedQuery);
  }, [debouncedQuery, performSearch]);

  // 设置查询
  const setQuery = useCallback((query: string) => {
    setState(prev => ({ ...prev, query }));
  }, []);

  // 清空搜索
  const clearSearch = useCallback(() => {
    setState(prev => ({
      ...prev,
      query: '',
      results: null,
      suggestions: [],
      error: null
    }));
  }, []);

  // 立即搜索（不防抖）
  const searchImmediately = useCallback((query: string) => {
    setState(prev => ({ ...prev, query }));
    performSearch(query);
  }, [performSearch]);

  // 获取搜索统计
  const getSearchStats = useCallback(() => {
    try {
      return searchEngine.getIndexStats();
    } catch (error) {
      console.error('获取搜索统计失败:', error);
      return null;
    }
  }, []);

  // 计算派生状态
  const derivedState = useMemo(() => ({
    hasQuery: state.query.length >= minQueryLength,
    hasResults: state.results && state.results.posts.length > 0,
    isEmpty: state.results && state.results.posts.length === 0,
    isSearching: state.loading && state.query.length >= minQueryLength
  }), [state.query, state.results, state.loading, minQueryLength]);

  return {
    // 状态
    ...state,
    ...derivedState,
    
    // 方法
    setQuery,
    clearSearch,
    searchImmediately,
    getSearchStats,
    
    // 配置
    config: {
      debounceMs,
      minQueryLength,
      maxResults
    }
  };
}

/**
 * 简化的搜索Hook
 * 用于快速集成基础搜索功能
 */
export function useSimpleSearch(initialQuery = '') {
  const search = useSearch({
    debounceMs: 300,
    minQueryLength: 1,
    maxResults: 20
  });

  useEffect(() => {
    if (initialQuery) {
      search.setQuery(initialQuery);
    }
  }, [initialQuery, search]);

  return {
    query: search.query,
    results: search.results?.posts || [],
    loading: search.loading,
    error: search.error,
    setQuery: search.setQuery,
    clearSearch: search.clearSearch,
    hasResults: search.hasResults,
    isEmpty: search.isEmpty
  };
}