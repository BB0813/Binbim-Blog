import type {
  Post,
  Category,
  Tag,
  PostsResponse,
  PostResponse,
  ContentStats,
  ArchiveData,
  RelatedPostsConfig,
} from '@/types/content';
import { parseMarkdownFiles } from './markdown';

/**
 * 内容管理器类
 * 负责处理文章的CRUD操作、元数据提取、分类标签管理等
 */
export class ContentManager {
  private posts: Post[] = [];
  private categories: Category[] = [];
  private tags: Tag[] = [];
  private initialized = false;

  /**
   * 初始化内容管理器
   * @param markdownFiles Markdown文件数组
   */
  async initialize(
    markdownFiles: Array<{ content: string; path: string }>
  ): Promise<void> {
    try {
      // 解析所有Markdown文件
      this.posts = await parseMarkdownFiles(markdownFiles);

      // 提取分类和标签
      this.extractCategoriesAndTags();

      this.initialized = true;
      console.warn(`内容管理器初始化完成，共加载 ${this.posts.length} 篇文章`);
    } catch (error) {
      console.error('内容管理器初始化失败:', error);
      throw error;
    }
  }

  /**
   * 检查是否已初始化
   */
  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error('内容管理器尚未初始化，请先调用 initialize() 方法');
    }
  }

  /**
   * 提取分类和标签信息
   */
  private extractCategoriesAndTags(): void {
    const categoryMap = new Map<string, number>();
    const tagMap = new Map<string, number>();

    // 统计分类和标签使用次数
    this.posts.forEach(post => {
      // 统计分类
      const currentCount = categoryMap.get(post.category) || 0;
      categoryMap.set(post.category, currentCount + 1);

      // 统计标签
      post.tags.forEach(tag => {
        const currentTagCount = tagMap.get(tag) || 0;
        tagMap.set(tag, currentTagCount + 1);
      });
    });

    // 生成分类数组
    this.categories = Array.from(categoryMap.entries()).map(
      ([name, postCount]) => ({
        name,
        postCount,
        slug: this.generateSlug(name),
        description: `${name}相关的文章`,
      })
    );

    // 生成标签数组
    this.tags = Array.from(tagMap.entries()).map(([name, usageCount]) => ({
      name,
      usageCount,
      slug: this.generateSlug(name),
      color: this.generateTagColor(name),
    }));

    // 按使用次数排序
    this.categories.sort((a, b) => b.postCount - a.postCount);
    this.tags.sort((a, b) => b.usageCount - a.usageCount);
  }

  /**
   * 生成URL友好的slug
   */
  private generateSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  /**
   * 为标签生成颜色
   */
  private generateTagColor(tagName: string): string {
    const colors = [
      '#3b82f6',
      '#ef4444',
      '#10b981',
      '#f59e0b',
      '#8b5cf6',
      '#06b6d4',
      '#84cc16',
      '#f97316',
      '#ec4899',
      '#6366f1',
      '#14b8a6',
      '#eab308',
    ];

    // 基于标签名生成一致的颜色
    let hash = 0;
    for (let i = 0; i < tagName.length; i++) {
      hash = tagName.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  }

  /**
   * 获取所有文章
   */
  getAllPosts(): Post[] {
    this.ensureInitialized();
    return [...this.posts];
  }

  /**
   * 根据slug获取单篇文章
   */
  getPostBySlug(slug: string): Post | null {
    this.ensureInitialized();
    return this.posts.find(post => post.slug === slug) || null;
  }

  /**
   * 获取文章列表（支持分页和筛选）
   */
  getPosts(
    options: {
      page?: number;
      pageSize?: number;
      category?: string;
      tag?: string;
      search?: string;
    } = {}
  ): PostsResponse {
    this.ensureInitialized();

    const { page = 1, pageSize = 10, category, tag, search } = options;
    let filteredPosts = [...this.posts];

    // 按分类筛选
    if (category) {
      filteredPosts = filteredPosts.filter(post => post.category === category);
    }

    // 按标签筛选
    if (tag) {
      filteredPosts = filteredPosts.filter(post => post.tags.includes(tag));
    }

    // 搜索筛选
    if (search) {
      const searchLower = search.toLowerCase();
      filteredPosts = filteredPosts.filter(
        post =>
          post.title.toLowerCase().includes(searchLower) ||
          post.excerpt.toLowerCase().includes(searchLower) ||
          post.content.toLowerCase().includes(searchLower) ||
          post.tags.some(t => t.toLowerCase().includes(searchLower))
      );
    }

    // 分页
    const total = filteredPosts.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

    return {
      posts: paginatedPosts,
      total,
      categories: this.categories.map(c => c.name),
      tags: this.tags.map(t => t.name),
      pagination: {
        page,
        pageSize,
        totalPages,
      },
    };
  }

  /**
   * 获取单篇文章及相关文章
   */
  getPostWithRelated(
    slug: string,
    config: RelatedPostsConfig = {
      maxCount: 3,
      algorithm: 'mixed',
      threshold: 0.3,
    }
  ): PostResponse | null {
    this.ensureInitialized();

    const post = this.getPostBySlug(slug);
    if (!post) {
      return null;
    }

    const relatedPosts = this.getRelatedPosts(post, config);

    return {
      post,
      related: relatedPosts,
    };
  }

  /**
   * 获取相关文章
   */
  private getRelatedPosts(
    targetPost: Post,
    config: RelatedPostsConfig
  ): Post[] {
    const { maxCount, algorithm, threshold } = config;
    const otherPosts = this.posts.filter(post => post.slug !== targetPost.slug);

    const scoredPosts = otherPosts.map(post => {
      let score = 0;

      switch (algorithm) {
        case 'tags':
          score = this.calculateTagSimilarity(targetPost, post);
          break;
        case 'category':
          score = targetPost.category === post.category ? 1 : 0;
          break;
        case 'mixed':
        default: {
          const tagScore = this.calculateTagSimilarity(targetPost, post);
          const categoryScore = targetPost.category === post.category ? 0.5 : 0;
          score = tagScore * 0.7 + categoryScore * 0.3;
          break;
        }
      }

      return { post, score };
    });

    return scoredPosts
      .filter(item => item.score >= threshold)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxCount)
      .map(item => item.post);
  }

  /**
   * 计算标签相似度
   */
  private calculateTagSimilarity(post1: Post, post2: Post): number {
    const tags1 = new Set(post1.tags);
    const tags2 = new Set(post2.tags);

    const intersection = new Set([...tags1].filter(tag => tags2.has(tag)));
    const union = new Set([...tags1, ...tags2]);

    return union.size > 0 ? intersection.size / union.size : 0;
  }

  /**
   * 获取所有分类
   */
  getCategories(): Category[] {
    this.ensureInitialized();
    return [...this.categories];
  }

  /**
   * 获取所有标签
   */
  getTags(): Tag[] {
    this.ensureInitialized();
    return [...this.tags];
  }

  /**
   * 获取内容统计信息
   */
  getContentStats(): ContentStats {
    this.ensureInitialized();

    const totalWords = this.posts.reduce((sum, post) => {
      // 简单估算：中文字符数 + 英文单词数
      const chineseChars = (post.content.match(/[\u4e00-\u9fa5]/g) || [])
        .length;
      const englishWords = (post.content.match(/[a-zA-Z]+/g) || []).length;
      return sum + chineseChars + englishWords;
    }, 0);

    const totalReadingTime = this.posts.reduce(
      (sum, post) => sum + post.readingTime,
      0
    );
    const averageReadingTime =
      this.posts.length > 0 ? totalReadingTime / this.posts.length : 0;

    // 获取最新更新时间
    const lastUpdated =
      this.posts.length > 0
        ? this.posts
            .reduce(
              (latest, post) => {
                const postDate = new Date(post.updatedAt || post.date);
                return postDate > latest ? postDate : latest;
              },
              new Date(this.posts[0].updatedAt || this.posts[0].date)
            )
            .toISOString()
        : new Date().toISOString();

    return {
      totalPosts: this.posts.length,
      totalCategories: this.categories.length,
      totalTags: this.tags.length,
      totalWords,
      averageReadingTime: Math.round(averageReadingTime * 10) / 10,
      lastUpdated,
    };
  }

  /**
   * 获取归档数据
   */
  getArchiveData(): ArchiveData[] {
    this.ensureInitialized();

    const archiveMap = new Map<number, Map<number, Post[]>>();

    // 按年月分组
    this.posts.forEach(post => {
      const date = new Date(post.date);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      if (!archiveMap.has(year)) {
        archiveMap.set(year, new Map());
      }

      const yearMap = archiveMap.get(year)!;
      if (!yearMap.has(month)) {
        yearMap.set(month, []);
      }

      yearMap.get(month)!.push(post);
    });

    // 转换为数组格式并排序
    const archiveData: ArchiveData[] = [];

    Array.from(archiveMap.entries())
      .sort(([a], [b]) => b - a) // 年份降序
      .forEach(([year, monthMap]) => {
        const months = Array.from(monthMap.entries())
          .sort(([a], [b]) => b - a) // 月份降序
          .map(([month, posts]) => ({
            month,
            posts: posts.sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            ),
          }));

        archiveData.push({ year, months });
      });

    return archiveData;
  }

  /**
   * 获取最新文章
   */
  getLatestPosts(count: number = 5): Post[] {
    this.ensureInitialized();
    return this.posts.slice(0, count);
  }

  /**
   * 获取热门标签
   */
  getPopularTags(count: number = 10): Tag[] {
    this.ensureInitialized();
    return this.tags.slice(0, count);
  }

  /**
   * 获取热门分类
   */
  getPopularCategories(count: number = 5): Category[] {
    this.ensureInitialized();
    return this.categories.slice(0, count);
  }
}

// 导出单例实例
export const contentManager = new ContentManager();
