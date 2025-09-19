// 内容管理系统类型定义

/**
 * 文章接口定义
 */
export interface Post {
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  category: string;
  tags: string[];
  coverImage?: string;
  readingTime: number;
  draft?: boolean;
  author?: string;
  updatedAt?: string;
}

/**
 * 文章前置元数据接口
 */
export interface PostFrontMatter {
  title: string;
  date: string;
  category: string;
  tags: string[];
  excerpt?: string;
  coverImage?: string;
  draft?: boolean;
  author?: string;
  updatedAt?: string;
}

/**
 * 博客配置接口
 */
export interface BlogConfig {
  title: string;
  description: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
    social: {
      github?: string;
      twitter?: string;
      email?: string;
      linkedin?: string;
    };
  };
  giscus?: {
    repo: string;
    repoId: string;
    category: string;
    categoryId: string;
  };
  seo?: {
    keywords: string[];
    ogImage?: string;
  };
}

/**
 * 分类接口定义
 */
export interface Category {
  name: string;
  description?: string;
  postCount: number;
  slug: string;
}

/**
 * 标签接口定义
 */
export interface Tag {
  name: string;
  color?: string;
  usageCount: number;
  slug: string;
}

/**
 * 文章列表API响应接口
 */
export interface PostsResponse {
  posts: Post[];
  total: number;
  categories: string[];
  tags: string[];
  pagination?: {
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

/**
 * 单篇文章API响应接口
 */
export interface PostResponse {
  post: Post;
  related?: Post[];
}

/**
 * 搜索结果接口
 */
export interface SearchResult {
  posts: Post[];
  total: number;
  query: string;
  suggestions?: string[];
}

/**
 * 搜索索引接口
 */
export interface SearchIndex {
  posts: Post[];
  index: Map<string, Set<string>>;
  categories: Category[];
  tags: Tag[];
}

/**
 * 内容统计接口
 */
export interface ContentStats {
  totalPosts: number;
  totalCategories: number;
  totalTags: number;
  totalWords: number;
  averageReadingTime: number;
  lastUpdated: string;
}

/**
 * 归档数据接口
 */
export interface ArchiveData {
  year: number;
  months: {
    month: number;
    posts: Post[];
  }[];
}

/**
 * 相关文章推荐配置
 */
export interface RelatedPostsConfig {
  maxCount: number;
  algorithm: 'tags' | 'category' | 'mixed';
  threshold: number;
}
