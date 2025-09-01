import fs from 'fs';
import path from 'path';
// 移除未使用的类型导入
import { contentManager } from './contentManager';

/**
 * 静态文件生成器
 * 负责在构建时生成JSON API文件
 */
export class StaticGenerator {
  private outputDir: string;
  private apiDir: string;

  constructor(outputDir: string = 'dist') {
    this.outputDir = outputDir;
    this.apiDir = path.join(outputDir, 'api');
  }

  /**
   * 确保目录存在
   */
  private ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  /**
   * 写入JSON文件
   */
  private writeJsonFile(filePath: string, data: any): void {
    const jsonContent = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonContent, 'utf-8');
    console.log(`生成文件: ${filePath}`);
  }

  /**
   * 生成文章列表API文件
   */
  private generatePostsApi(): void {
    const postsResponse = contentManager.getPosts({ pageSize: 1000 }); // 获取所有文章
    
    // 生成主要的posts.json
    this.writeJsonFile(
      path.join(this.apiDir, 'posts.json'),
      postsResponse
    );

    // 生成分页的文章列表
    const pageSize = 10;
    const totalPages = Math.ceil(postsResponse.total / pageSize);
    
    for (let page = 1; page <= totalPages; page++) {
      const pageData = contentManager.getPosts({ page, pageSize });
      this.writeJsonFile(
        path.join(this.apiDir, 'posts', `page-${page}.json`),
        pageData
      );
    }
  }

  /**
   * 生成单篇文章API文件
   */
  private generatePostApi(): void {
    const posts = contentManager.getAllPosts();
    
    posts.forEach(post => {
      const postWithRelated = contentManager.getPostWithRelated(post.slug);
      if (postWithRelated) {
        const postDir = path.join(this.apiDir, 'posts', post.slug);
        this.ensureDirectoryExists(postDir);
        this.writeJsonFile(
          path.join(postDir, 'index.json'),
          postWithRelated
        );
      }
    });
  }

  /**
   * 生成分类API文件
   */
  private generateCategoriesApi(): void {
    const categories = contentManager.getCategories();
    
    // 生成分类列表
    this.writeJsonFile(
      path.join(this.apiDir, 'categories.json'),
      { categories }
    );

    // 为每个分类生成文章列表
    categories.forEach(category => {
      const categoryPosts = contentManager.getPosts({ 
        category: category.name,
        pageSize: 1000 
      });
      
      const categoryDir = path.join(this.apiDir, 'categories', category.slug);
      this.ensureDirectoryExists(categoryDir);
      this.writeJsonFile(
        path.join(categoryDir, 'index.json'),
        categoryPosts
      );
    });
  }

  /**
   * 生成标签API文件
   */
  private generateTagsApi(): void {
    const tags = contentManager.getTags();
    
    // 生成标签列表
    this.writeJsonFile(
      path.join(this.apiDir, 'tags.json'),
      { tags }
    );

    // 为每个标签生成文章列表
    tags.forEach(tag => {
      const tagPosts = contentManager.getPosts({ 
        tag: tag.name,
        pageSize: 1000 
      });
      
      const tagDir = path.join(this.apiDir, 'tags', tag.slug);
      this.ensureDirectoryExists(tagDir);
      this.writeJsonFile(
        path.join(tagDir, 'index.json'),
        tagPosts
      );
    });
  }

  /**
   * 生成归档API文件
   */
  private generateArchiveApi(): void {
    const archiveData = contentManager.getArchiveData();
    
    this.writeJsonFile(
      path.join(this.apiDir, 'archive.json'),
      { archive: archiveData }
    );
  }

  /**
   * 生成统计信息API文件
   */
  private generateStatsApi(): void {
    const stats = contentManager.getContentStats();
    
    this.writeJsonFile(
      path.join(this.apiDir, 'stats.json'),
      stats
    );
  }

  /**
   * 生成最新文章API文件
   */
  private generateLatestApi(): void {
    const latestPosts = contentManager.getLatestPosts(10);
    
    this.writeJsonFile(
      path.join(this.apiDir, 'latest.json'),
      { posts: latestPosts }
    );
  }

  /**
   * 生成热门内容API文件
   */
  private generatePopularApi(): void {
    const popularTags = contentManager.getPopularTags(20);
    const popularCategories = contentManager.getPopularCategories(10);
    
    this.writeJsonFile(
      path.join(this.apiDir, 'popular.json'),
      {
        tags: popularTags,
        categories: popularCategories
      }
    );
  }

  /**
   * 生成sitemap.xml
   */
  private generateSitemap(): void {
    const posts = contentManager.getAllPosts();
    const categories = contentManager.getCategories();
    const tags = contentManager.getTags();
    
    const baseUrl = process.env.VITE_BASE_URL || 'https://yourdomain.com';
    const currentDate = new Date().toISOString().split('T')[0];
    
    const urls = [
      // 主页
      {
        loc: baseUrl,
        lastmod: currentDate,
        changefreq: 'daily',
        priority: '1.0'
      },
      // 关于页面
      {
        loc: `${baseUrl}/about`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: '0.8'
      },
      // 归档页面
      {
        loc: `${baseUrl}/archive`,
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: '0.8'
      },
      // 文章页面
      ...posts.map(post => ({
        loc: `${baseUrl}/post/${post.slug}`,
        lastmod: post.updatedAt || post.date,
        changefreq: 'monthly',
        priority: '0.9'
      })),
      // 分类页面
      ...categories.map(category => ({
        loc: `${baseUrl}/category/${category.slug}`,
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: '0.7'
      })),
      // 标签页面
      ...tags.map(tag => ({
        loc: `${baseUrl}/tag/${tag.slug}`,
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: '0.6'
      }))
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('')}
</urlset>`;

    fs.writeFileSync(
      path.join(this.outputDir, 'sitemap.xml'),
      sitemap,
      'utf-8'
    );
    console.log(`生成文件: ${path.join(this.outputDir, 'sitemap.xml')}`);
  }

  /**
   * 生成robots.txt
   */
  private generateRobots(): void {
    const baseUrl = process.env.VITE_BASE_URL || 'https://yourdomain.com';
    
    const robots = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml`;
    
    fs.writeFileSync(
      path.join(this.outputDir, 'robots.txt'),
      robots,
      'utf-8'
    );
    console.log(`生成文件: ${path.join(this.outputDir, 'robots.txt')}`);
  }

  /**
   * 生成RSS feed
   */
  private generateRssFeed(): void {
    const posts = contentManager.getLatestPosts(20);
    const baseUrl = process.env.VITE_BASE_URL || 'https://yourdomain.com';
    const blogTitle = process.env.VITE_APP_TITLE || '个人博客';
    const blogDescription = process.env.VITE_APP_DESCRIPTION || '分享技术与生活';
    
    const rssItems = posts.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/post/${post.slug}</link>
      <guid>${baseUrl}/post/${post.slug}</guid>
      <description><![CDATA[${post.excerpt}]]></description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <category>${post.category}</category>
      ${post.tags.map(tag => `<category>${tag}</category>`).join('\n      ')}
    </item>`).join('');

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${blogTitle}</title>
    <link>${baseUrl}</link>
    <description>${blogDescription}</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />${rssItems}
  </channel>
</rss>`;

    fs.writeFileSync(
      path.join(this.outputDir, 'rss.xml'),
      rss,
      'utf-8'
    );
    console.log(`生成文件: ${path.join(this.outputDir, 'rss.xml')}`);
  }

  /**
   * 生成所有静态文件
   */
  async generateAll(): Promise<void> {
    console.log('开始生成静态API文件...');
    
    // 确保输出目录存在
    this.ensureDirectoryExists(this.apiDir);
    this.ensureDirectoryExists(path.join(this.apiDir, 'posts'));
    this.ensureDirectoryExists(path.join(this.apiDir, 'categories'));
    this.ensureDirectoryExists(path.join(this.apiDir, 'tags'));

    try {
      // 生成各种API文件
      this.generatePostsApi();
      this.generatePostApi();
      this.generateCategoriesApi();
      this.generateTagsApi();
      this.generateArchiveApi();
      this.generateStatsApi();
      this.generateLatestApi();
      this.generatePopularApi();
      
      // 生成SEO相关文件
      this.generateSitemap();
      this.generateRobots();
      this.generateRssFeed();
      
      console.log('静态API文件生成完成！');
    } catch (error) {
      console.error('生成静态文件时出错:', error);
      throw error;
    }
  }

  /**
   * 清理输出目录
   */
  clean(): void {
    if (fs.existsSync(this.apiDir)) {
      fs.rmSync(this.apiDir, { recursive: true, force: true });
      console.log('清理API目录完成');
    }
  }
}

// 导出默认实例
export const staticGenerator = new StaticGenerator();