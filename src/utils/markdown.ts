import matter from 'gray-matter';
import { marked } from 'marked';
import hljs from 'highlight.js';
import { Buffer } from 'buffer';
import type { Post, PostFrontMatter } from '@/types/content';

// 确保Buffer在全局可用
if (typeof globalThis !== 'undefined' && !globalThis.Buffer) {
  globalThis.Buffer = Buffer;
}

/**
 * 计算文章阅读时间（分钟）
 * @param content Markdown内容
 * @param wordsPerMinute 每分钟阅读字数，默认200
 * @returns 阅读时间（分钟）
 */
export function calculateReadingTime(content: string, wordsPerMinute: number = 200): number {
  // 移除Markdown语法标记
  const plainText = content
    .replace(/```[\s\S]*?```/g, '') // 移除代码块
    .replace(/`[^`]*`/g, '') // 移除行内代码
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // 移除图片
    .replace(/\[[^\]]*\]\([^)]*\)/g, '') // 移除链接
    .replace(/#{1,6}\s/g, '') // 移除标题标记
    .replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, '$1') // 移除粗体斜体标记
    .replace(/\n/g, ' ') // 换行符替换为空格
    .trim();

  // 计算字数（中英文混合）
  const chineseChars = (plainText.match(/[\u4e00-\u9fa5]/g) || []).length;
  const englishWords = (plainText.match(/[a-zA-Z]+/g) || []).length;
  
  // 中文字符按1个字计算，英文单词按1个词计算
  const totalWords = chineseChars + englishWords;
  
  return Math.max(1, Math.ceil(totalWords / wordsPerMinute));
}

/**
 * 生成文章摘要
 * @param content Markdown内容
 * @param maxLength 最大长度，默认150字符
 * @returns 文章摘要
 */
export function generateExcerpt(content: string, maxLength: number = 150): string {
  // 移除Markdown语法，保留纯文本
  const plainText = content
    .replace(/```[\s\S]*?```/g, '') // 移除代码块
    .replace(/`[^`]*`/g, '') // 移除行内代码
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // 移除图片
    .replace(/\[[^\]]*\]\([^)]*\)/g, '') // 移除链接
    .replace(/#{1,6}\s/g, '') // 移除标题标记
    .replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, '$1') // 移除粗体斜体标记
    .replace(/\n+/g, ' ') // 多个换行符替换为单个空格
    .replace(/\s+/g, ' ') // 多个空格替换为单个空格
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  // 在单词边界截断，避免截断单词
  const truncated = plainText.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  if (lastSpaceIndex > maxLength * 0.8) {
    return truncated.substring(0, lastSpaceIndex) + '...';
  }
  
  return truncated + '...';
}

/**
 * 生成文章slug
 * @param title 文章标题
 * @returns URL友好的slug
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5\s-]/g, '') // 只保留字母、数字、中文、空格和连字符
    .replace(/\s+/g, '-') // 空格替换为连字符
    .replace(/-+/g, '-') // 多个连字符替换为单个
    .replace(/^-|-$/g, ''); // 移除首尾连字符
}

/**
 * 配置marked渲染器
 */
function configureMarked(): void {
  const renderer = new marked.Renderer();

  // 自定义标题渲染，添加锚点ID
  renderer.heading = function({ tokens, depth }) {
    const text = this.parser.parseInline(tokens);
    const id = text
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '');

    return `<h${depth} id="${id}" class="scroll-mt-20">${text}</h${depth}>`;
  };

  // 自定义代码块渲染，添加语法高亮
  renderer.code = function({ text, lang }) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        const highlighted = hljs.highlight(text, { language: lang }).value;
        return `<pre><code class="hljs language-${lang}">${highlighted}</code></pre>`;
      } catch (err) {
        console.warn('Highlight.js error:', err);
      }
    }
    return `<pre><code>${text}</code></pre>`;
  };

  // 自定义链接渲染，外部链接添加target="_blank"
  renderer.link = function({ href, title, text }) {
    const isExternal = href.startsWith('http') && !href.includes(window.location.hostname);
    const target = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
    const titleAttr = title ? ` title="${title}"` : '';
    return `<a href="${href}"${titleAttr}${target}>${text}</a>`;
  };

  // 配置marked选项
  marked.setOptions({
    renderer,
    breaks: true, // 支持GFM换行
    gfm: true, // 启用GitHub Flavored Markdown
  });
}

// 初始化marked配置
configureMarked();

/**
 * 解析Markdown文件内容
 * @param fileContent 文件原始内容
 * @param filePath 文件路径（用于生成slug）
 * @returns 解析后的文章对象
 */
export async function parseMarkdown(fileContent: string, filePath?: string): Promise<Post> {
  try {
    // 解析前置元数据
    const { data, content } = matter(fileContent);
    const frontMatter = data as PostFrontMatter;

    // 验证必需字段
    if (!frontMatter.title) {
      throw new Error('文章标题不能为空');
    }
    if (!frontMatter.date) {
      throw new Error('文章日期不能为空');
    }
    if (!frontMatter.category) {
      throw new Error('文章分类不能为空');
    }

    // 生成slug
    let slug = generateSlug(frontMatter.title);
    if (filePath) {
      // 如果提供了文件路径，优先使用文件名作为slug
      const fileName = filePath.split('/').pop()?.replace(/\.md$/, '') || '';
      if (fileName && fileName !== 'index') {
        slug = fileName;
      }
    }

    // 渲染Markdown内容
    const htmlContent = await marked.parse(content);

    // 生成摘要（如果前置元数据中没有提供）
    const excerpt = frontMatter.excerpt || generateExcerpt(content);

    // 计算阅读时间
    const readingTime = calculateReadingTime(content);

    // 处理标签
    const tags = Array.isArray(frontMatter.tags) ? frontMatter.tags : [];

    // 构建文章对象
    const post: Post = {
      slug,
      title: frontMatter.title,
      content: htmlContent,
      excerpt,
      date: frontMatter.date,
      category: frontMatter.category,
      tags,
      readingTime,
      draft: frontMatter.draft || false,
      author: frontMatter.author,
      updatedAt: frontMatter.updatedAt,
      coverImage: frontMatter.coverImage,
    };

    return post;
  } catch (error) {
    console.error('Markdown解析错误:', error);
    throw new Error(`Markdown解析失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}

/**
 * 批量解析Markdown文件
 * @param files 文件内容数组，每个元素包含content和path
 * @returns 解析后的文章数组
 */
export async function parseMarkdownFiles(
  files: Array<{ content: string; path: string }>
): Promise<Post[]> {
  const posts: Post[] = [];
  
  for (const file of files) {
    try {
      const post = await parseMarkdown(file.content, file.path);
      // 过滤草稿（在生产环境中）
      if (!post.draft || process.env.NODE_ENV === 'development') {
        posts.push(post);
      }
    } catch (error) {
      console.error(`解析文件 ${file.path} 失败:`, error);
      // 继续处理其他文件，不中断整个流程
    }
  }

  // 按日期降序排序
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * 提取文章中的标题列表（用于生成目录）
 * @param content Markdown内容
 * @returns 标题列表
 */
export function extractHeadings(content: string): Array<{ id: string; text: string; level: number }> {
  const headings: Array<{ id: string; text: string; level: number }> = [];
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '');

    headings.push({ id, text, level });
  }

  return headings;
}