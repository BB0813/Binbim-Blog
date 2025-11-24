import { useState, useEffect } from 'react';
import { contentManager } from '@/utils/contentManager';

interface UseContentInitReturn {
  initialized: boolean;
  loading: boolean;
  error: string | null;
}

/**
 * 内容初始化Hook
 * 确保contentManager在使用前已经初始化
 */
export function useContentInit(): UseContentInitReturn {
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeContent = async () => {
      try {
        setLoading(true);
        setError(null);

        if (contentManager['initialized']) {
          setInitialized(true);
          setLoading(false);
          return;
        }

        try {
          const res = await fetch('/api/posts.json');
          if (res.ok) {
            const data = await res.json();
            const posts = Array.isArray(data.posts) ? data.posts : [];
            if (posts.length > 0) {
              contentManager.loadFromPosts(posts);
              setInitialized(true);
              return;
            }
          }
        } catch (_err) {
          void _err;
        }

        const markdownFiles: Array<{ content: string; path: string }> = [
          {
            content:
              `---\n` +
              `title: "如何使用 Binbim Blog 写作"\n` +
              `date: "2024-01-15"\n` +
              `category: "使用指南"\n` +
              `tags: ["博客", "Markdown", "写作"]\n` +
              `excerpt: "这是一篇示例文章，展示如何在 Binbim Blog 中创建和编写文章。包含了 Markdown 语法的使用示例和最佳实践。"\n` +
              `author: "Binbim"\n` +
              `draft: false\n` +
              `updatedAt: "2024-01-15"\n` +
              `---\n\n` +
              `# 如何使用 Binbim Blog 写作\n\n` +
              `欢迎来到 Binbim Blog！这篇文章将向你展示如何创建和编写高质量的博客文章。\n\n` +
              `## 开始写作\n\n` +
              `### 1. 创建文章文件\n\n` +
              `在 \`content/posts/2024/\` 目录下创建一个新的 Markdown 文件。\n\n` +
              `### 2. 添加文章元数据\n\n` +
              `每篇文章都需要在开头添加 Front Matter，包含标题、日期、分类、标签等信息。\n\n` +
              `## Markdown 语法示例\n\n` +
              `### 文本格式\n\n` +
              `你可以使用 **粗体**、*斜体* 和 ~~删除线~~ 来强调文本。\n\n` +
              `### 代码块\n\n` +
              `\`\`\`javascript\n` +
              `function greet(name) {\n` +
              `  return \`Hello, \${name}!\`;\n` +
              `}\n\n` +
              `const message = greet("Binbim");\n` +
              `console.log(message);\n` +
              `\`\`\`\n\n` +
              `### 列表和引用\n\n` +
              `- 支持无序列表\n` +
              `- 支持有序列表\n` +
              `- 支持引用块\n\n` +
              `> 这是一个引用块，用于强调重要信息。\n\n` +
              `## 写作技巧\n\n` +
              `1. **结构清晰** - 使用有意义的标题和段落\n` +
              `2. **代码示例** - 为代码块指定语言类型\n` +
              `3. **图片使用** - 添加有意义的描述文本\n\n` +
              `## 总结\n\n` +
              `通过这篇示例文章，你可以了解如何在 Binbim Blog 中创建和编写文章。更多详细信息请查看 CONTENT_GUIDE.md 文档。`,
            path: 'content/posts/2024/example-article.md',
          },
        ];

        await contentManager.initialize(markdownFiles);

        setInitialized(true);
        console.warn('内容管理系统初始化完成');
      } catch (err) {
        setError(err instanceof Error ? err.message : '初始化失败');
        console.error('内容管理系统初始化失败:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeContent();
  }, []);

  return { initialized, loading, error };
}
