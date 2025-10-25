# 🌟 Binbim Blog

<div align="center">

![Binbim Blog](https://img.shields.io/badge/Binbim-Blog-blue?style=for-the-badge&logo=react)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-06B6D4?style=for-the-badge&logo=tailwindcss)

**一个现代化、功能丰富的个人博客系统**

[🚀 在线演示](https://bb0813.github.io/Binbim-Blog/) | [📖 文档](./CONTENT_GUIDE.md) | [🔧 部署指南](./DEPLOY.md)

</div>

## 📸 项目截图

<div align="center">

### 🏠 首页展示
![首页](./public/images/screenshots/home.png)

### 📝 文章详情
![文章详情](./public/images/screenshots/post-detail.png)

### 🔍 搜索功能
![搜索功能](./public/images/screenshots/search.png)

### 🌙 深色模式
![深色模式](./public/images/screenshots/dark-mode.png)

### 📱 移动端适配
![移动端](./public/images/screenshots/mobile.png)

</div>

## ✨ 特性

### 🎨 现代化设计
- **响应式布局** - 完美适配桌面端、平板和移动设备
- **深色模式** - 支持明暗主题切换，保护眼睛
- **优雅动画** - 流畅的页面过渡和交互动效
- **现代 UI** - 基于 Tailwind CSS 的精美界面设计

### 📝 内容管理
- **Markdown 支持** - 完整的 Markdown 语法支持，包括代码高亮
- **文章分类** - 灵活的分类系统，支持多级分类
- **标签系统** - 强大的标签功能，便于内容组织
- **草稿功能** - 支持文章草稿，便于内容创作
- **阅读时间** - 自动计算文章阅读时间
- **文章摘要** - 智能生成或自定义文章摘要

### 🔍 搜索功能
- **全文搜索** - 支持标题、内容、标签的全文搜索
- **智能建议** - 搜索关键词智能提示
- **高亮显示** - 搜索结果关键词高亮
- **实时搜索** - 输入即搜索，无需等待

### 📊 数据统计
- **博客统计** - 文章数量、分类统计、标签统计
- **阅读统计** - 总字数、平均阅读时间等
- **分类分析** - 各分类文章分布和趋势
- **标签云** - 可视化标签使用频率

### 🗂️ 内容组织
- **归档页面** - 按年月组织的文章归档
- **分类浏览** - 按分类浏览文章
- **标签浏览** - 按标签筛选文章
- **相关推荐** - 智能推荐相关文章

### 🚀 性能优化
- **静态生成** - 构建时预生成静态内容
- **代码分割** - 按需加载，优化首屏性能
- **图片优化** - 支持现代图片格式
- **缓存策略** - 智能缓存机制

### 🔧 开发体验
- **TypeScript** - 完整的类型安全
- **ESLint + Prettier** - 代码质量保证
- **热重载** - 开发时实时预览
- **自动化部署** - GitHub Actions 自动部署

## 🛠️ 技术栈

### 前端框架
- **React 18** - 现代化的前端框架
- **TypeScript** - 类型安全的 JavaScript
- **React Router** - 客户端路由管理
- **Zustand** - 轻量级状态管理

### 构建工具
- **Vite** - 快速的构建工具和开发服务器
- **PostCSS** - CSS 后处理器
- **ESLint** - JavaScript/TypeScript 代码检查
- **Prettier** - 代码格式化工具

### 样式方案
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Tailwind Typography** - 优美的排版样式
- **Lucide React** - 现代化图标库
- **Heroicons** - 精美的 SVG 图标

### 内容处理
- **Gray Matter** - Front Matter 解析
- **Marked** - Markdown 解析器
- **Highlight.js** - 代码语法高亮
- **Remark** - Markdown 处理生态系统

### 工具库
- **Date-fns** - 现代化日期处理库
- **Clsx** - 条件类名工具
- **Buffer** - Node.js Buffer 兼容

## 🚀 快速开始

### 环境要求

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0 或 **yarn** >= 1.22.0

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/BB0813/Binbim-Blog.git
cd Binbim-Blog
```

2. **安装依赖**
```bash
npm install
# 或
yarn install
```

3. **启动开发服务器**
```bash
npm run dev
# 或
yarn dev
```

4. **打开浏览器**
访问 [http://localhost:5173](http://localhost:5173) 查看效果

### 构建部署

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview

# 类型检查
npm run type-check

# 代码检查
npm run lint

# 格式化代码
npm run format
```

## 📝 内容管理

### 添加文章

1. 在 `content/posts/2024/` 目录下创建 `.md` 文件
2. 添加 Front Matter 元数据：

```markdown
---
title: "文章标题"
date: "2024-01-15"
category: "技术分享"
tags: ["React", "TypeScript", "前端"]
excerpt: "文章摘要描述"
author: "Binbim"
draft: false
---

# 文章内容

这里是文章的正文内容...
```

### 配置博客信息

编辑 `content/config/blog.json` 文件：

```json
{
  "title": "你的博客名称",
  "description": "博客描述",
  "author": {
    "name": "你的名字",
    "avatar": "头像URL",
    "bio": "个人简介",
    "social": {
      "github": "GitHub链接",
      "twitter": "Twitter链接",
      "email": "邮箱地址"
    }
  }
}
```

详细的内容管理指南请查看 [📖 内容管理指南](./CONTENT_GUIDE.md)

## 🚀 部署

### GitHub Pages 部署（推荐）

1. **Fork 项目**
   ```bash
   # Fork 本项目到你的 GitHub 账户
   # 或者直接克隆并推送到你的仓库
   git clone https://github.com/BB0813/Binbim-Blog.git
   cd Binbim-Blog
   git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   ```

2. **配置 GitHub Pages**
   - 进入仓库设置 → Pages
   - Source 选择 "GitHub Actions"
   - 推送代码后会自动触发部署

3. **环境变量配置**
   
   在仓库设置中添加以下 Secrets（可选）：
   ```
   VITE_BASE_URL=your-repo-name  # 如果部署在子路径
   VITE_GISCUS_REPO=your-username/your-repo  # 评论系统
   VITE_GISCUS_REPO_ID=your-repo-id
   VITE_GISCUS_CATEGORY=General
   VITE_GISCUS_CATEGORY_ID=your-category-id
   ```

### Vercel 部署

1. **连接 GitHub**
   - 访问 [Vercel](https://vercel.com)
   - 导入你的 GitHub 仓库

2. **构建配置**
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "installCommand": "npm install"
   }
   ```

3. **环境变量**
   在 Vercel 项目设置中添加相同的环境变量

### Netlify 部署

1. **连接仓库**
   - 访问 [Netlify](https://netlify.com)
   - 连接你的 GitHub 仓库

2. **构建设置**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

### 自定义服务器部署

#### 使用 Docker

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 使用 PM2

```bash
# 安装 PM2
npm install -g pm2

# 构建项目
npm run build

# 使用 serve 提供静态文件服务
npm install -g serve
pm2 start "serve -s dist -l 3000" --name "binbim-blog"
```

#### Nginx 配置

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/binbim-blog/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 环境变量说明

创建 `.env` 文件配置环境变量：

```bash
# 基础配置
VITE_APP_TITLE="你的博客标题"
VITE_APP_DESCRIPTION="博客描述"
VITE_BASE_URL="/"  # 部署路径，GitHub Pages 通常是仓库名

# Giscus 评论系统（可选）
VITE_GISCUS_REPO="username/repository"
VITE_GISCUS_REPO_ID="R_kgDOH..."
VITE_GISCUS_CATEGORY="General"
VITE_GISCUS_CATEGORY_ID="DIC_kwDOH..."

# 分析工具（可选）
VITE_GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
VITE_BAIDU_ANALYTICS_ID="your-baidu-id"
```

详细的部署指南和故障排除请查看 [🔧 部署指南](./DEPLOY.md)

## 📁 项目结构

```
Binbim-Blog/
├── content/                 # 内容目录
│   ├── config/             # 配置文件
│   │   └── blog.json       # 博客配置
│   ├── pages/              # 页面内容
│   │   └── about.md        # 关于页面
│   └── posts/              # 文章目录
│       └── 2024/           # 按年份组织
├── public/                 # 静态资源
│   └── images/             # 图片资源
├── src/                    # 源代码
│   ├── components/         # React 组件
│   │   ├── Layout/         # 布局组件
│   │   ├── Blog/           # 博客组件
│   │   ├── Article/        # 文章组件
│   │   └── UI/             # UI 组件
│   ├── pages/              # 页面组件
│   ├── hooks/              # 自定义 Hooks
│   ├── utils/              # 工具函数
│   ├── types/              # TypeScript 类型
│   └── lib/                # 库文件
├── scripts/                # 构建脚本
├── .github/                # GitHub Actions
└── docs/                   # 文档
```

## 🎯 核心功能

### 内容管理系统
- **ContentManager** - 核心内容管理器
- **SearchEngine** - 全文搜索引擎
- **StaticGenerator** - 静态内容生成器
- **ContentLoader** - 内容加载器

### 组件系统
- **Layout** - 响应式布局系统
- **Blog** - 博客相关组件
- **Article** - 文章展示组件
- **Search** - 搜索功能组件

### 工具函数
- **Markdown 解析** - 完整的 Markdown 处理
- **搜索算法** - 高效的全文搜索
- **内容统计** - 智能数据分析
- **SEO 优化** - 搜索引擎优化

## 🔧 开发指南

### 代码规范

项目使用 ESLint 和 Prettier 确保代码质量：

```bash
# 检查代码规范
npm run lint

# 自动修复代码问题
npm run lint:fix

# 格式化代码
npm run format

# 检查格式
npm run format:check
```

### 类型安全

项目使用 TypeScript 提供完整的类型安全：

```bash
# 类型检查
npm run type-check
```

### 测试

```bash
# 运行所有检查
npm run test

# CI 环境测试
npm run test:ci
```

## 🤝 贡献指南

我们欢迎所有形式的贡献！无论是 bug 报告、功能建议、代码贡献还是文档改进。

### 🐛 报告 Bug

如果你发现了 bug，请：

1. 检查 [Issues](https://github.com/BB0813/Binbim-Blog/issues) 确认问题未被报告
2. 创建新的 Issue，包含：
   - 清晰的标题和描述
   - 重现步骤
   - 预期行为 vs 实际行为
   - 环境信息（浏览器、操作系统等）
   - 截图或错误日志（如果适用）

### 💡 功能建议

对于新功能建议：

1. 先在 [Discussions](https://github.com/BB0813/Binbim-Blog/discussions) 中讨论
2. 创建 Feature Request Issue
3. 详细描述功能需求和使用场景

### 🔧 代码贡献

#### 开发流程

1. **Fork 项目**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Binbim-Blog.git
   cd Binbim-Blog
   ```

2. **创建开发分支**
   ```bash
   git checkout -b feature/your-feature-name
   # 或
   git checkout -b fix/your-bug-fix
   ```

3. **安装依赖**
   ```bash
   npm install
   ```

4. **开发和测试**
   ```bash
   npm run dev          # 启动开发服务器
   npm run lint         # 代码检查
   npm run type-check   # 类型检查
   npm run format       # 代码格式化
   npm run test         # 运行测试
   ```

5. **提交代码**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   git push origin feature/your-feature-name
   ```

6. **创建 Pull Request**
   - 提供清晰的 PR 标题和描述
   - 关联相关的 Issue
   - 确保所有检查通过

#### 代码规范

**提交信息规范**

使用 [Conventional Commits](https://www.conventionalcommits.org/) 格式：

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

类型说明：
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式化
- `refactor`: 代码重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

示例：
```
feat(search): add fuzzy search functionality
fix(ui): resolve mobile navigation issue
docs(readme): update installation guide
```

**代码风格**

- 使用 TypeScript 进行类型安全
- 遵循 ESLint 和 Prettier 配置
- 组件使用 PascalCase 命名
- 文件名使用 kebab-case
- 变量和函数使用 camelCase

**组件开发规范**

```typescript
// 组件文件结构示例
import React from 'react';
import { ComponentProps } from './types';
import './Component.css';

interface Props extends ComponentProps {
  // 组件特定的 props
}

export const Component: React.FC<Props> = ({ 
  prop1, 
  prop2,
  ...rest 
}) => {
  // 组件逻辑
  
  return (
    <div className="component" {...rest}>
      {/* 组件内容 */}
    </div>
  );
};

export default Component;
```

**测试规范**

- 为新功能编写单元测试
- 测试文件命名：`Component.test.tsx`
- 使用 React Testing Library
- 确保测试覆盖率 > 80%

#### 开发环境设置

**推荐的 VS Code 扩展**

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

**VS Code 设置**

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

### 📝 文档贡献

文档改进同样重要：

- 修复错别字和语法错误
- 改进现有文档的清晰度
- 添加缺失的文档
- 翻译文档到其他语言

### 🎯 贡献者指南

**首次贡献者**

1. 查看标有 `good first issue` 的 Issues
2. 阅读项目文档和代码风格指南
3. 在小的改动上开始练习

**核心贡献者**

1. 参与 Issue 讨论和代码审查
2. 帮助维护项目质量
3. 指导新贡献者

### 🏆 贡献者认可

我们会在以下地方认可贡献者：

- README 中的贡献者列表
- 发布说明中的感谢
- 项目网站的贡献者页面

感谢所有为项目做出贡献的开发者！ 🙏

## ❓ 常见问题

### 部署相关

**Q: GitHub Pages 部署失败怎么办？**

A: 检查以下几点：
1. 确保仓库是公开的（或有 GitHub Pro）
2. 检查 GitHub Actions 是否启用
3. 查看 Actions 日志中的错误信息
4. 确认 `vite.config.ts` 中的 base 路径配置正确

**Q: 如何自定义域名？**

A: 
1. **创建 CNAME 文件**
   在 `public` 目录下创建 `CNAME` 文件：
   ```
   blog.example.com
   ```

2. **配置 GitHub Secrets**
   在仓库设置 → Secrets and variables → Actions 中添加：
   ```
   CUSTOM_DOMAIN = true
   ```

3. **DNS 配置**
   在域名提供商处设置 CNAME 记录：
   ```
   Type: CNAME
   Name: blog (或 @，如果是根域名)
   Value: username.github.io
   ```

4. **重新部署**
   推送代码触发重新部署，或手动触发 GitHub Actions

**注意**：如果遇到样式丢失问题，确保已正确设置 `CUSTOM_DOMAIN` secret。

### 内容管理

**Q: 如何添加新的文章分类？**

A: 在文章的 frontmatter 中添加 `category` 字段：
```markdown
---
title: "文章标题"
date: "2024-01-01"
category: "新分类"
tags: ["标签1", "标签2"]
---
```

**Q: 支持哪些 Markdown 语法？**

A: 支持标准 Markdown 语法，以及：
- 代码高亮
- 数学公式（KaTeX）
- 表格
- 任务列表
- 脚注
- 自定义容器

### 自定义配置

**Q: 如何修改主题颜色？**

A: 编辑 `src/styles/globals.css` 中的 CSS 变量：
```css
:root {
  --primary-color: #your-color;
  --secondary-color: #your-color;
}
```

**Q: 如何添加自定义页面？**

A: 
1. 在 `src/pages` 目录下创建新组件
2. 在 `src/App.tsx` 中添加路由
3. 在导航菜单中添加链接

## ⚡ 性能优化

### 构建优化

- **代码分割**: 使用 React.lazy() 进行路由级别的代码分割
- **图片优化**: 使用 WebP 格式，添加 loading="lazy"
- **Bundle 分析**: 运行 `npm run build` 查看 bundle 大小

### 运行时优化

- **虚拟滚动**: 长列表使用虚拟滚动
- **缓存策略**: 利用浏览器缓存和 Service Worker
- **预加载**: 关键资源预加载

### SEO 优化

- **Meta 标签**: 每个页面设置合适的 title 和 description
- **结构化数据**: 添加 JSON-LD 结构化数据
- **Sitemap**: 自动生成 sitemap.xml

## 🔧 故障排除

### 常见错误

**构建失败**
```bash
# 清理缓存重新安装
rm -rf node_modules package-lock.json
npm install

# 检查 Node.js 版本
node --version  # 建议 >= 16
```

**样式问题**
```bash
# 重新生成 Tailwind CSS
npm run build:css
```

**类型错误**
```bash
# 运行类型检查
npm run type-check
```

### 调试技巧

1. **开发工具**: 使用 React Developer Tools
2. **控制台**: 检查浏览器控制台错误
3. **网络**: 查看网络请求是否正常
4. **性能**: 使用 Lighthouse 分析性能

## 📄 许可证

本项目采用 [MIT 许可证](./LICENSE)。

## 🙏 致谢

感谢以下开源项目的支持：

- [React](https://reactjs.org/) - 用户界面库
- [Vite](https://vitejs.dev/) - 构建工具
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [TypeScript](https://www.typescriptlang.org/) - 类型安全
- [Marked](https://marked.js.org/) - Markdown 解析器

## 📞 联系方式

- **作者**: Binbim
- **邮箱**: binbim_promax@163.com
- **GitHub**: [@BB0813](https://github.com/BB0813)
- **Twitter**: [@Binbim_ProMax](https://x.com/Binbim_ProMax)
- **博客**: [Binbim Blog](https://bb0813.github.io/Binbim-Blog/)

---

<div align="center">

**如果这个项目对你有帮助，请给它一个 ⭐️**

Made with ❤️ by [Binbim](https://github.com/BB0813)

</div>