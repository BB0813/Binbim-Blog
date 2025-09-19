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

        // 模拟加载Markdown文件
        // 在实际应用中，这些文件应该从content目录或API加载
        const mockMarkdownFiles = [
          {
            content: `---
title: "React 18 新特性详解"
date: "2024-01-15"
category: "前端开发"
tags: ["React", "JavaScript", "前端", "Web开发"]
excerpt: "React 18 是 React 的一个重大版本更新，引入了许多令人兴奋的新特性和改进。本文将详细介绍这些新特性以及如何在项目中使用它们。"
coverImage: "/images/react-18-cover.jpg"
draft: false
author: "Binbim"
updatedAt: "2024-01-16"
---

# React 18 新特性详解

React 18 是 React 的一个重大版本更新，引入了许多令人兴奋的新特性和改进。本文将详细介绍这些新特性以及如何在项目中使用它们。

## 并发特性 (Concurrent Features)

### Automatic Batching

React 18 引入了自动批处理功能，这意味着 React 会自动将多个状态更新合并为一个重新渲染，以提高性能。`,
            path: 'content/posts/2024/react-18-features.md',
          },
          {
            content: `---
title: "TypeScript 最佳实践指南"
date: "2024-01-10"
category: "编程语言"
tags: ["TypeScript", "JavaScript", "最佳实践", "类型安全"]
excerpt: "TypeScript 为 JavaScript 带来了静态类型检查，提高了代码质量和开发效率。本文总结了 TypeScript 开发中的最佳实践。"
coverImage: "/images/typescript-cover.jpg"
draft: false
author: "Binbim"
---

# TypeScript 最佳实践指南

TypeScript 已经成为现代前端开发的标准工具之一。正确使用 TypeScript 不仅能提高代码质量，还能显著提升开发体验。`,
            path: 'content/posts/2024/typescript-best-practices.md',
          },
        ];

        // 初始化contentManager
        await contentManager.initialize(mockMarkdownFiles);

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
