import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  ClockIcon,
  TagIcon,
  FolderIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { useSearch } from '@/hooks/useSearch';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { formatDate } from '@/lib/utils';
import { Empty } from '@/components';

/**
 * 搜索页面组件
 */
const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = searchParams.get('q') || '';

  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // 搜索功能
  const search = useSearch({
    debounceMs: 300,
    minQueryLength: 1,
    maxResults: 20,
    enableSuggestions: true,
    enablePopularTerms: true,
  });

  // 搜索历史
  const searchHistory = useSearchHistory();

  // 初始化查询
  useEffect(() => {
    if (initialQuery && initialQuery !== search.query) {
      search.setQuery(initialQuery);
    }
  }, [initialQuery, search]);

  // 更新URL参数
  useEffect(() => {
    if (search.query) {
      setSearchParams({ q: search.query });
      // 添加到搜索历史
      if (search.results) {
        searchHistory.addSearchRecord(search.query, search.results.total);
      }
    } else {
      setSearchParams({});
    }
  }, [search.query, search.results, setSearchParams, searchHistory]);

  // 处理搜索输入
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    search.setQuery(e.target.value);
  };

  // 处理搜索提交
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.query.trim()) {
      search.searchImmediately(search.query);
    }
  };

  // 清空搜索
  const handleClearSearch = () => {
    search.clearSearch();
    navigate('/search');
  };

  // 选择建议
  const handleSelectSuggestion = (suggestion: string) => {
    search.setQuery(suggestion);
  };

  // 选择历史记录
  const handleSelectHistory = (historyItem: string) => {
    search.setQuery(historyItem);
  };

  // 过滤结果
  const filteredResults =
    search.results?.posts.filter(post => {
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(post.category)
      ) {
        return false;
      }
      if (
        selectedTags.length > 0 &&
        !post.tags.some(tag => selectedTags.includes(tag))
      ) {
        return false;
      }
      return true;
    }) || [];

  // 获取可用的分类和标签
  const availableCategories = search.results?.facets.categories || [];
  const availableTags = search.results?.facets.tags || [];

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='max-w-4xl mx-auto px-4 py-8'>
        {/* 搜索头部 */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-6'>
            搜索文章
          </h1>

          {/* 搜索框 */}
          <form onSubmit={handleSearchSubmit} className='relative'>
            <div className='relative'>
              <MagnifyingGlassIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
              <input
                type='text'
                value={search.query}
                onChange={handleSearchInput}
                placeholder='搜索文章标题、内容、标签...'
                className='w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
              {search.query && (
                <button
                  type='button'
                  onClick={handleClearSearch}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                >
                  <XMarkIcon className='w-5 h-5' />
                </button>
              )}
            </div>
          </form>

          {/* 搜索建议 */}
          {search.suggestions.length > 0 && search.query && (
            <div className='mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
              <h3 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center'>
                <SparklesIcon className='w-4 h-4 mr-1' />
                搜索建议
              </h3>
              <div className='flex flex-wrap gap-2'>
                {search.suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectSuggestion(suggestion)}
                    className='px-3 py-1 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors'
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 搜索历史 */}
          {!search.query && searchHistory.history.length > 0 && (
            <div className='mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
              <div className='flex items-center justify-between mb-3'>
                <h3 className='text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center'>
                  <ClockIcon className='w-4 h-4 mr-1' />
                  最近搜索
                </h3>
                <button
                  onClick={searchHistory.clearHistory}
                  className='text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                >
                  清空
                </button>
              </div>
              <div className='flex flex-wrap gap-2'>
                {searchHistory.getRecentSearches(8).map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectHistory(item.query)}
                    className='px-3 py-1 text-sm bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors'
                  >
                    {item.query}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 搜索结果 */}
        {search.query && (
          <div className='space-y-6'>
            {/* 结果统计和筛选 */}
            <div className='flex items-center justify-between'>
              <div className='text-sm text-gray-600 dark:text-gray-400'>
                {search.loading ? (
                  <span>搜索中...</span>
                ) : search.results ? (
                  <span>
                    找到{' '}
                    <span className='font-medium text-gray-900 dark:text-white'>
                      {filteredResults.length}
                    </span>{' '}
                    个结果
                    {search.results.searchTime && (
                      <span className='ml-2'>
                        ({search.results.searchTime.toFixed(2)}ms)
                      </span>
                    )}
                  </span>
                ) : null}
              </div>

              {search.results &&
                (availableCategories.length > 0 ||
                  availableTags.length > 0) && (
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className='flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300'
                  >
                    <AdjustmentsHorizontalIcon className='w-4 h-4 mr-1' />
                    筛选
                  </button>
                )}
            </div>

            {/* 筛选面板 */}
            {showFilters && search.results && (
              <div className='p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {/* 分类筛选 */}
                  {availableCategories.length > 0 && (
                    <div>
                      <h4 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center'>
                        <FolderIcon className='w-4 h-4 mr-1' />
                        分类
                      </h4>
                      <div className='space-y-2'>
                        {availableCategories.map(category => (
                          <label
                            key={category.name}
                            className='flex items-center'
                          >
                            <input
                              type='checkbox'
                              checked={selectedCategories.includes(
                                category.name
                              )}
                              onChange={e => {
                                if (e.target.checked) {
                                  setSelectedCategories([
                                    ...selectedCategories,
                                    category.name,
                                  ]);
                                } else {
                                  setSelectedCategories(
                                    selectedCategories.filter(
                                      c => c !== category.name
                                    )
                                  );
                                }
                              }}
                              className='mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                            />
                            <span className='text-sm text-gray-700 dark:text-gray-300'>
                              {category.name} ({category.count})
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 标签筛选 */}
                  {availableTags.length > 0 && (
                    <div>
                      <h4 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center'>
                        <TagIcon className='w-4 h-4 mr-1' />
                        标签
                      </h4>
                      <div className='space-y-2'>
                        {availableTags.map(tag => (
                          <label key={tag.name} className='flex items-center'>
                            <input
                              type='checkbox'
                              checked={selectedTags.includes(tag.name)}
                              onChange={e => {
                                if (e.target.checked) {
                                  setSelectedTags([...selectedTags, tag.name]);
                                } else {
                                  setSelectedTags(
                                    selectedTags.filter(t => t !== tag.name)
                                  );
                                }
                              }}
                              className='mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                            />
                            <span className='text-sm text-gray-700 dark:text-gray-300'>
                              {tag.name} ({tag.count})
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 清除筛选 */}
                {(selectedCategories.length > 0 || selectedTags.length > 0) && (
                  <div className='mt-4 pt-4 border-t border-gray-200 dark:border-gray-700'>
                    <button
                      onClick={() => {
                        setSelectedCategories([]);
                        setSelectedTags([]);
                      }}
                      className='text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    >
                      清除所有筛选
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 搜索结果列表 */}
            {search.loading ? (
              <div className='flex items-center justify-center py-12'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
                <span className='ml-3 text-gray-600 dark:text-gray-400'>
                  搜索中...
                </span>
              </div>
            ) : search.error ? (
              <div className='text-center py-12'>
                <div className='text-red-600 dark:text-red-400 mb-2'>
                  {search.error}
                </div>
                <button
                  onClick={() => search.searchImmediately(search.query)}
                  className='text-blue-600 dark:text-blue-400 hover:underline'
                >
                  重试
                </button>
              </div>
            ) : filteredResults.length === 0 ? (
              <Empty
                title='没有找到相关文章'
                description='尝试使用不同的关键词或调整筛选条件'
                action={
                  <button
                    onClick={handleClearSearch}
                    className='mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                  >
                    清空搜索
                  </button>
                }
              />
            ) : (
              <div className='space-y-6'>
                {filteredResults.map(post => (
                  <article
                    key={post.slug}
                    className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow'
                  >
                    <div className='flex items-start justify-between mb-3'>
                      <div className='flex-1'>
                        <Link to={`/post/${post.slug}`} className='block group'>
                          <h2
                            className='text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2'
                            dangerouslySetInnerHTML={{
                              __html: post.highlightedTitle || post.title,
                            }}
                          />
                        </Link>

                        <div className='flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3'>
                          <time dateTime={post.date}>
                            {formatDate(post.date)}
                          </time>
                          <span className='mx-2'>•</span>
                          <span>{post.category}</span>
                          <span className='mx-2'>•</span>
                          <span>{post.readingTime} 分钟阅读</span>
                          {post.relevanceScore && (
                            <>
                              <span className='mx-2'>•</span>
                              <span className='text-blue-600 dark:text-blue-400'>
                                相关度: {post.relevanceScore}%
                              </span>
                            </>
                          )}
                        </div>

                        <p
                          className='text-gray-600 dark:text-gray-300 mb-4 line-clamp-3'
                          dangerouslySetInnerHTML={{
                            __html: post.highlightedExcerpt || post.excerpt,
                          }}
                        />

                        {/* 标签 */}
                        {post.tags.length > 0 && (
                          <div className='flex flex-wrap gap-2 mb-3'>
                            {post.tags.map(tag => (
                              <Link
                                key={tag}
                                to={`/tag/${tag}`}
                                className='px-2 py-1 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors'
                              >
                                #{tag}
                              </Link>
                            ))}
                          </div>
                        )}

                        {/* 匹配字段 */}
                        {post.matchedFields.length > 0 && (
                          <div className='text-xs text-gray-500 dark:text-gray-400'>
                            匹配字段: {post.matchedFields.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 热门搜索词 */}
        {!search.query && search.popularTerms.length > 0 && (
          <div className='mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
            <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
              热门搜索
            </h3>
            <div className='flex flex-wrap gap-2'>
              {search.popularTerms.slice(0, 10).map((term, index) => (
                <button
                  key={index}
                  onClick={() => search.setQuery(term)}
                  className='px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors'
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
