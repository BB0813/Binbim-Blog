import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { TagIcon, ArrowLeftIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { useTags } from '@/hooks/useTags';
import { contentManager } from '@/utils/contentManager';
import { TagCloud, TagStats, TagFilter } from '@/components/Tag';
import { Empty } from '@/components';
import type { Post, Tag } from '@/types/content';

const TagExplorer: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { tags, loading: tagsLoading } = useTags();
  
  // 从URL参数获取筛选条件
  const selectedTagsParam = searchParams.get('tags');
  const searchQueryParam = searchParams.get('q') || '';
  
  const [selectedTags, setSelectedTags] = useState<string[]>(
    selectedTagsParam ? selectedTagsParam.split(',').filter(Boolean) : []
  );
  const [searchQuery, setSearchQuery] = useState(searchQueryParam);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  // 更新URL参数
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedTags.length > 0) {
      params.set('tags', selectedTags.join(','));
    }
    if (searchQuery.trim()) {
      params.set('q', searchQuery.trim());
    }
    setSearchParams(params);
  }, [selectedTags, searchQuery, setSearchParams]);

  // 根据筛选条件获取文章
  useEffect(() => {
    if (tagsLoading) return;
    
    setLoading(true);
    try {
      let posts: Post[] = [];
      
      if (selectedTags.length > 0) {
        // 多标签筛选：获取包含所有选中标签的文章
        const allPosts = contentManager.getAllPosts();
        posts = allPosts.filter(post => 
          selectedTags.every(tag => post.tags.includes(tag))
        );
      } else if (searchQuery.trim()) {
        // 仅搜索查询
        const response = contentManager.getPosts({ search: searchQuery.trim() });
        posts = response.posts;
      } else {
        // 无筛选条件，显示所有文章
        const response = contentManager.getPosts();
        posts = response.posts;
      }
      
      // 如果有搜索查询，进一步过滤
      if (searchQuery.trim() && selectedTags.length > 0) {
        const searchLower = searchQuery.toLowerCase();
        posts = posts.filter(post => 
          post.title.toLowerCase().includes(searchLower) ||
          post.excerpt.toLowerCase().includes(searchLower) ||
          post.content.toLowerCase().includes(searchLower)
        );
      }
      
      setFilteredPosts(posts);
    } catch (error) {
      console.error('筛选文章失败:', error);
      setFilteredPosts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedTags, searchQuery, tagsLoading]);

  const handleTagsChange = (newTags: string[]) => {
    setSelectedTags(newTags);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleClearFilters = () => {
    setSelectedTags([]);
    setSearchQuery('');
  };

  // 计算相关统计
  const selectedTagObjects = tags.filter(tag => selectedTags.includes(tag.name));
  const hasActiveFilters = selectedTags.length > 0 || searchQuery.trim().length > 0;

  if (tagsLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
            <div className="lg:col-span-1">
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <TagIcon className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
            <h1 className="text-3xl font-bold">
              {hasActiveFilters ? '标签筛选结果' : '标签探索'}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                showFilter
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <AdjustmentsHorizontalIcon className="w-4 h-4 mr-1" />
              筛选器
            </button>
            <Link
              to="/"
              className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-1" />
              返回首页
            </Link>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-gray-600 dark:text-gray-400">
            {hasActiveFilters ? (
              <>
                找到 <span className="font-semibold">{filteredPosts.length}</span> 篇文章
                {selectedTags.length > 0 && (
                  <span className="ml-2">
                    标签: {selectedTags.map((tag, index) => (
                      <span key={tag}>
                        <span className="font-medium text-blue-600 dark:text-blue-400">{tag}</span>
                        {index < selectedTags.length - 1 && ', '}
                      </span>
                    ))}
                  </span>
                )}
                {searchQuery && (
                  <span className="ml-2">
                    搜索: <span className="font-medium text-blue-600 dark:text-blue-400">"{searchQuery}"</span>
                  </span>
                )}
              </>
            ) : (
              `共有 ${tags.length} 个标签，${filteredPosts.length} 篇文章`
            )}
          </p>
          
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              清除所有筛选
            </button>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 主内容区域 */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              ))}
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="space-y-6">
              {filteredPosts.map(post => (
                <article
                  key={post.slug}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h2 className="text-xl font-semibold flex-1">
                      <Link
                        to={`/post/${post.slug}`}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-sm ml-4">
                      {post.category}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString('zh-CN')}
                      </time>
                      <span className="mx-2">•</span>
                      <span>{post.readingTime} 分钟阅读</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 4).map(tagName => {
                        const isSelected = selectedTags.includes(tagName);
                        return (
                          <button
                            key={tagName}
                            onClick={() => {
                              if (isSelected) {
                                setSelectedTags(selectedTags.filter(t => t !== tagName));
                              } else {
                                setSelectedTags([...selectedTags, tagName]);
                              }
                            }}
                            className={`px-2 py-1 rounded text-xs transition-colors ${
                              isSelected
                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                          >
                            #{tagName}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <Empty
              icon={<TagIcon className="w-16 h-16" />}
              title={hasActiveFilters ? '未找到匹配的文章' : '暂无文章'}
              description={
                hasActiveFilters
                  ? '尝试调整筛选条件或清除筛选器'
                  : '还没有发布任何文章'
              }
            />
          )}
        </div>

        {/* 侧边栏 */}
        <div className="lg:col-span-1 space-y-6">
          {/* 筛选器 */}
          {showFilter && (
            <TagFilter
              tags={tags}
              selectedTags={selectedTags}
              searchQuery={searchQuery}
              onTagsChange={handleTagsChange}
              onSearchChange={handleSearchChange}
              onClear={handleClearFilters}
            />
          )}
          
          {/* 选中标签的统计信息 */}
          {selectedTagObjects.length === 1 && filteredPosts.length > 0 && (
            <TagStats 
              tag={selectedTagObjects[0]} 
              posts={filteredPosts} 
            />
          )}
          
          {/* 标签云 */}
          {!hasActiveFilters && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <TagIcon className="w-5 h-5 mr-2" />
                标签云
              </h3>
              <TagCloud 
                tags={tags} 
                maxTags={20} 
                variant="colorful"
              />
            </div>
          )}
          
          {/* 热门标签 */}
          {hasActiveFilters && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <TagIcon className="w-5 h-5 mr-2" />
                热门标签
              </h3>
              <TagCloud 
                tags={tags.slice(0, 10)} 
                maxTags={10} 
                variant="compact" 
                showCount={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TagExplorer;