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

        // 检查是否已经初始化
        if (contentManager['initialized']) {
          setInitialized(true);
          setLoading(false);
          return;
        }

        // 从实际的content目录加载Markdown文件
        // 在实际应用中，这些文件应该通过构建脚本或API加载
        const markdownFiles: Array<{ content: string; path: string }> = [
          {
            content: `---
title: "如何使用 Binbim Blog 写作"
date: "2024-01-15"
category: "使用指南"
tags: ["博客", "Markdown", "写作"]
excerpt: "这是一篇示例文章，展示如何在 Binbim Blog 中创建和编写文章。包含了 Markdown 语法的使用示例和最佳实践。"
author: "Binbim"
draft: false
updatedAt: "2024-01-15"
---

# 如何使用 Binbim Blog 写作

欢迎来到 Binbim Blog！这篇文章将向你展示如何创建和编写高质量的博客文章。

## 开始写作

### 1. 创建文章文件

在 \`content/posts/2024/\` 目录下创建一个新的 Markdown 文件。

### 2. 添加文章元数据

每篇文章都需要在开头添加 Front Matter，包含标题、日期、分类、标签等信息。

## Markdown 语法示例

### 文本格式

你可以使用 **粗体**、*斜体* 和 ~~删除线~~ 来强调文本。

### 代码块

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}

const message = greet("Binbim");
console.log(message);
\`\`\`

### 列表和引用

- 支持无序列表
- 支持有序列表
- 支持引用块

> 这是一个引用块，用于强调重要信息。

## 写作技巧

1. **结构清晰** - 使用有意义的标题和段落
2. **代码示例** - 为代码块指定语言类型
3. **图片使用** - 添加有意义的描述文本

## 总结

通过这篇示例文章，你可以了解如何在 Binbim Blog 中创建和编写文章。更多详细信息请查看 CONTENT_GUIDE.md 文档。`,
            path: 'content/posts/2024/example-article.md',
          },
        ];

        // 用户可以在content/posts目录下添加更多文章

        // 初始化contentManager
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
