import fs from 'fs';
import path from 'path';
import type { Post, BlogConfig } from '@/types/content';
import { contentManager } from './contentManager';
import { searchEngine } from './searchEngine';

/**
 * 内容加载器
 * 负责在构建时加载所有Markdown文件并初始化内容管理系统
 */
export class ContentLoader {
  private contentDir: string;
  private postsDir: string;
  private pagesDir: string;
  private configDir: string;

  constructor(contentDir: string = 'content') {
    this.contentDir = contentDir;
    this.postsDir = path.join(contentDir, 'posts');
    this.pagesDir = path.join(contentDir, 'pages');
    this.configDir = path.join(contentDir, 'config');
  }

  /**
   * 递归获取目录下的所有Markdown文件
   */
  private getMarkdownFiles(dir: string): string[] {
    const files: string[] = [];
    
    if (!fs.existsSync(dir)) {
      console.warn(`目录不存在: ${dir}`);
      return files;
    }

    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        files.push(...this.getMarkdownFiles(fullPath));
      } else if (item.endsWith('.md')) {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  /**
   * 读取Markdown文件内容
   */
  private readMarkdownFile(filePath: string): { content: string; path: string } {
    const content = fs.readFileSync(filePath, 'utf-8');
    // 生成相对路径作为标识
    const relativePath = path.relative(this.contentDir, filePath);
    
    return {
      content,
      path: relativePath
    };
  }

  /**
   * 加载博客配置
   */
  loadBlogConfig(): BlogConfig | null {
    const configPath = path.join(this.configDir, 'blog.json');
    
    if (!fs.existsSync(configPath)) {
      console.warn('博客配置文件不存在，使用默认配置');
      return null;
    }

    try {
      const configContent = fs.readFileSync(configPath, 'utf-8');
      const config = JSON.parse(configContent) as BlogConfig;
      console.warn('博客配置加载成功');
      return config;
    } catch (error) {
      console.error('加载博客配置失败:', error);
      return null;
    }
  }

  /**
   * 加载所有文章
   */
  async loadPosts(): Promise<Array<{ content: string; path: string }>> {
    console.warn('开始加载文章...');
    
    const postFiles = this.getMarkdownFiles(this.postsDir);
    const posts = postFiles.map(filePath => this.readMarkdownFile(filePath));
    
    console.warn(`加载了 ${posts.length} 篇文章`);
    return posts;
  }

  /**
   * 加载所有页面
   */
  async loadPages(): Promise<Array<{ content: string; path: string }>> {
    console.warn('开始加载页面...');
    
    const pageFiles = this.getMarkdownFiles(this.pagesDir);
    const pages = pageFiles.map(filePath => this.readMarkdownFile(filePath));
    
    console.warn(`加载了 ${pages.length} 个页面`);
    return pages;
  }

  /**
   * 初始化内容管理系统
   */
  async initializeContentSystem(): Promise<{
    posts: Post[];
    config: BlogConfig | null;
  }> {
    try {
      console.warn('开始初始化内容管理系统...');
      
      // 加载配置
      const config = this.loadBlogConfig();
      
      // 加载文章
      const postFiles = await this.loadPosts();
      
      // 初始化内容管理器
      await contentManager.initialize(postFiles);
      
      // 获取解析后的文章
      const posts = contentManager.getAllPosts();
      
      // 初始化搜索引擎
      searchEngine.initialize(posts);
      
      console.warn('内容管理系统初始化完成');
      
      return { posts, config };
    } catch (error) {
      console.error('初始化内容管理系统失败:', error);
      throw error;
    }
  }

  /**
   * 构建静态文件
   */
  async buildStaticFiles(outputDir: string = 'dist'): Promise<void> {
    try {
      console.warn('开始构建静态文件...');
      
      // 初始化内容管理系统
      await this.initializeContentSystem();
      
      // 生成静态API文件
      const generator = new (await import('./staticGenerator')).StaticGenerator(outputDir);
      await generator.generateAll();
      
      console.warn('静态文件构建完成');
    } catch (error) {
      console.error('构建静态文件失败:', error);
      throw error;
    }
  }

  /**
   * 开发模式下的内容热重载
   */
  setupHotReload(callback?: () => void): void {
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    console.warn('设置内容热重载...');
    
    // 监听文件变化
    const watchDirs = [this.postsDir, this.pagesDir, this.configDir];
    
    watchDirs.forEach(dir => {
      if (fs.existsSync(dir)) {
        fs.watch(dir, { recursive: true }, async (eventType, filename) => {
          if (filename && filename.endsWith('.md') || filename.endsWith('.json')) {
            console.warn(`检测到文件变化: ${filename}`);
            
            try {
              // 重新初始化内容管理系统
              await this.initializeContentSystem();
              console.warn('内容热重载完成');
              
              // 执行回调
              callback?.();
            } catch (error) {
              console.error('内容热重载失败:', error);
            }
          }
        });
      }
    });
  }

  /**
   * 验证内容结构
   */
  validateContentStructure(): {
    valid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 检查必要目录
    if (!fs.existsSync(this.contentDir)) {
      errors.push(`内容目录不存在: ${this.contentDir}`);
    }

    if (!fs.existsSync(this.postsDir)) {
      warnings.push(`文章目录不存在: ${this.postsDir}`);
    }

    if (!fs.existsSync(this.configDir)) {
      warnings.push(`配置目录不存在: ${this.configDir}`);
    }

    // 检查配置文件
    const configPath = path.join(this.configDir, 'blog.json');
    if (!fs.existsSync(configPath)) {
      warnings.push(`博客配置文件不存在: ${configPath}`);
    }

    // 检查文章数量
    if (fs.existsSync(this.postsDir)) {
      const postFiles = this.getMarkdownFiles(this.postsDir);
      if (postFiles.length === 0) {
        warnings.push('没有找到任何文章文件');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * 获取内容统计信息
   */
  getContentInfo(): {
    postsCount: number;
    pagesCount: number;
    totalFiles: number;
    directories: string[];
  } {
    const postFiles = fs.existsSync(this.postsDir) ? this.getMarkdownFiles(this.postsDir) : [];
    const pageFiles = fs.existsSync(this.pagesDir) ? this.getMarkdownFiles(this.pagesDir) : [];
    
    const directories = [];
    if (fs.existsSync(this.postsDir)) directories.push(this.postsDir);
    if (fs.existsSync(this.pagesDir)) directories.push(this.pagesDir);
    if (fs.existsSync(this.configDir)) directories.push(this.configDir);

    return {
      postsCount: postFiles.length,
      pagesCount: pageFiles.length,
      totalFiles: postFiles.length + pageFiles.length,
      directories
    };
  }
}

// 导出默认实例
export const contentLoader = new ContentLoader();

// 导出构建函数（用于构建脚本）
export async function buildContent(outputDir: string = 'dist'): Promise<void> {
  const loader = new ContentLoader();
  
  // 验证内容结构
  const validation = loader.validateContentStructure();
  
  if (!validation.valid) {
    console.error('内容结构验证失败:');
    validation.errors.forEach(error => console.error(`  ❌ ${error}`));
    throw new Error('内容结构验证失败');
  }

  if (validation.warnings.length > 0) {
    console.warn('内容结构警告:');
    validation.warnings.forEach(warning => console.warn(`  ⚠️  ${warning}`));
  }

  // 显示内容信息
  const info = loader.getContentInfo();
  console.warn('内容信息:');
  console.warn(`  📝 文章数量: ${info.postsCount}`);
  console.warn(`  📄 页面数量: ${info.pagesCount}`);
  console.warn(`  📁 总文件数: ${info.totalFiles}`);

  // 构建静态文件
  await loader.buildStaticFiles(outputDir);
}