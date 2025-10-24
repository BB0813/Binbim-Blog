# Binbim Blog 内容管理指南

本文档详细说明如何在 Binbim Blog 中添加、修改和管理文章内容。

## 📁 项目结构

```
content/
├── config/
│   └── blog.json          # 博客配置文件
├── pages/
│   └── about.md           # 关于页面
└── posts/
    └── 2024/              # 按年份组织的文章目录
        ├── your-post.md   # 你的文章文件
        └── ...
```

## ✍️ 添加新文章

### 1. 创建文章文件

在 `content/posts/2024/` 目录下创建新的 Markdown 文件：

```bash
# 文件命名建议：使用英文和连字符
content/posts/2024/my-first-post.md
content/posts/2024/react-tutorial.md
content/posts/2024/javascript-tips.md
```

### 2. 文章格式

每篇文章都需要包含 **Front Matter**（文章元数据）和 **正文内容**：

````markdown
---
title: '文章标题'
date: '2024-01-15'
category: '分类名称'
tags: ['标签1', '标签2', '标签3']
excerpt: '文章摘要，会显示在文章列表中'
author: 'Binbim'
draft: false
updatedAt: '2024-01-16'
coverImage: '/images/cover.jpg'
---

# 文章标题

这里是文章的正文内容，支持完整的 Markdown 语法。

## 二级标题

### 三级标题

- 列表项 1
- 列表项 2

**粗体文本** 和 _斜体文本_

```javascript
// 代码块示例
function hello() {
  console.log('Hello, World!');
}
```
````

> 引用文本

[链接文本](https://example.com)

```

### 3. Front Matter 字段说明

| 字段 | 必需 | 说明 | 示例 |
|------|------|------|------|
| `title` | ✅ | 文章标题 | `"React 18 新特性详解"` |
| `date` | ✅ | 发布日期 | `"2024-01-15"` |
| `category` | ✅ | 文章分类 | `"前端开发"` |
| `tags` | ✅ | 标签数组 | `["React", "JavaScript"]` |
| `excerpt` | ✅ | 文章摘要 | `"本文介绍 React 18 的新特性"` |
| `author` | ❌ | 作者名称 | `"Binbim"` |
| `draft` | ❌ | 是否为草稿 | `false` |
| `updatedAt` | ❌ | 更新日期 | `"2024-01-16"` |
| `coverImage` | ❌ | 封面图片 | `"/images/cover.jpg"` |

## 📝 修改现有文章

### 1. 找到文章文件

文章文件位于 `content/posts/年份/` 目录下，文件名通常是文章的 slug。

### 2. 编辑文章

直接编辑对应的 `.md` 文件：

1. 修改 Front Matter 中的元数据
2. 更新正文内容
3. 如果有重大修改，更新 `updatedAt` 字段

### 3. 保存文件

保存文件后，开发服务器会自动重新加载内容。

## 🏷️ 分类和标签管理

### 分类 (Categories)

- 每篇文章只能有一个分类
- 建议使用中文分类名
- 常用分类示例：
  - `"前端开发"`
  - `"后端开发"`
  - `"工程化"`
  - `"个人思考"`
  - `"技术分享"`

### 标签 (Tags)

- 每篇文章可以有多个标签
- 标签用于更细粒度的内容分类
- 标签示例：
  - 技术类：`["React", "Vue", "JavaScript", "TypeScript", "Node.js"]`
  - 工具类：`["Vite", "Webpack", "Docker", "Git"]`
  - 概念类：`["性能优化", "最佳实践", "架构设计"]`

## 🖼️ 图片管理

### 1. 图片存放

将图片文件放在 `public/images/` 目录下：

```

public/
└── images/
├── posts/
│ ├── 2024/
│ │ ├── react-tutorial/
│ │ │ ├── cover.jpg
│ │ │ └── screenshot.png
│ │ └── ...
│ └── ...
└── ...

````

### 2. 在文章中引用图片

```markdown
<!-- 相对路径引用 -->
![图片描述](/images/posts/2024/react-tutorial/screenshot.png)

<!-- 封面图片在 Front Matter 中设置 -->
---
coverImage: "/images/posts/2024/react-tutorial/cover.jpg"
---
````

## 📄 页面管理

### 关于页面

编辑 `content/pages/about.md` 文件来修改关于页面的内容。

### 添加新页面

1. 在 `content/pages/` 目录下创建新的 `.md` 文件
2. 添加相应的路由配置（需要修改代码）

## ⚙️ 博客配置

编辑 `content/config/blog.json` 文件来修改博客的基本信息：

```json
{
  "title": "Binbim Blog",
  "description": "个人技术博客",
  "author": "Binbim",
  "avatar": "https://q1.qlogo.cn/g?b=qq&nk=1721822150&s=640",
  "social": {
    "github": "https://github.com/BB0813",
    "twitter": "https://x.com/Binbim_ProMax",
    "email": "binbim_promax@163.com"
  }
}
```

## 🔄 内容更新流程

### 开发环境

1. 创建或修改文章文件
2. 保存文件
3. 开发服务器自动重新加载
4. 在浏览器中预览效果

### 生产环境

1. 提交代码到 Git 仓库
2. GitHub Actions 自动构建和部署
3. 网站自动更新

## 📋 文章模板

创建新文章时，可以使用以下模板：

````markdown
---
title: '在这里输入文章标题'
date: '2024-01-15'
category: '选择合适的分类'
tags: ['标签1', '标签2', '标签3']
excerpt: '简短的文章摘要，1-2句话描述文章内容'
author: 'Binbim'
draft: false
---

# 文章标题

## 前言

在这里写文章的引言或背景介绍。

## 主要内容

### 小节标题

文章的主要内容...

```javascript
// 代码示例
function example() {
  console.log('Hello, World!');
}
```
````

### 另一个小节

更多内容...

## 总结

总结文章的要点。

## 参考资料

- [参考链接1](https://example.com)
- [参考链接2](https://example.com)

```

## 🚀 最佳实践

### 文件命名

- 使用英文和连字符：`react-hooks-tutorial.md`
- 避免空格和特殊字符
- 保持简洁且有意义

### 内容组织

- 使用清晰的标题层级
- 添加目录（长文章）
- 合理使用代码块和引用
- 添加适当的图片说明

### SEO 优化

- 写好文章摘要（excerpt）
- 使用相关的标签
- 选择合适的分类
- 添加有意义的标题

### 代码规范

- 代码块指定语言类型
- 添加注释说明
- 保持代码格式整洁

## ❓ 常见问题

### Q: 文章不显示怎么办？

A: 检查以下几点：
1. Front Matter 格式是否正确
2. 必需字段是否都已填写
3. 日期格式是否为 `YYYY-MM-DD`
4. 文件是否保存在正确的目录

### Q: 如何设置文章为草稿？

A: 在 Front Matter 中设置 `draft: true`

### Q: 如何修改文章的 URL？

A: 文章的 URL 由文件名决定，修改文件名即可改变 URL

### Q: 支持哪些 Markdown 语法？

A: 支持标准 Markdown 语法，包括：
- 标题、段落、列表
- 粗体、斜体、删除线
- 链接、图片
- 代码块、引用
- 表格

---

如有其他问题，请查看项目的 README.md 文件或联系开发者。
```
