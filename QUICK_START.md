# 🚀 快速开始指南

## 📝 添加你的第一篇文章

### 1. 创建文章文件

在 `content/posts/2024/` 目录下创建一个新文件：

```bash
content/posts/2024/my-first-post.md
```

### 2. 复制文章模板

```markdown
---
title: "我的第一篇文章"
date: "2024-01-15"
category: "个人分享"
tags: ["生活", "思考"]
excerpt: "这是我在 Binbim Blog 上发布的第一篇文章"
author: "Binbim"
draft: false
---

# 我的第一篇文章

欢迎来到我的博客！这是我的第一篇文章。

## 关于我

在这里介绍一下自己...

## 博客计划

我计划在这个博客中分享：

- 技术学习心得
- 项目开发经验
- 生活感悟

## 结语

感谢你的阅读！
```

### 3. 更新代码

将文章内容添加到 `src/hooks/useContentInit.ts` 文件中的 `markdownFiles` 数组：

```typescript
const markdownFiles: Array<{ content: string; path: string }> = [
  // 现有的示例文章...
  {
    content: `你的文章内容（包含 Front Matter）`,
    path: 'content/posts/2024/my-first-post.md',
  },
];
```

### 4. 查看效果

保存文件后，开发服务器会自动重新加载，你就能在首页看到新文章了！

## 🎨 自定义博客信息

编辑 `content/config/blog.json` 文件：

```json
{
  "title": "你的博客名称",
  "description": "你的博客描述",
  "author": "你的名字",
  "avatar": "你的头像URL"
}
```

## 📚 更多信息

- 详细文档：查看 `CONTENT_GUIDE.md`
- 示例文章：参考 `content/posts/2024/example-article.md`
- 项目结构：查看 `README.md`

开始你的博客之旅吧！ 🎉