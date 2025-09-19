# GitHub Pages 空白页面问题修复说明

## 问题描述

GitHub Pages 部署成功但显示空白页面，这是由于 Vite + React 项目在 GitHub Pages 上的路径配置问题导致的。

## 修复内容

### 1. 修复 GitHub Actions 配置

在 `.github/workflows/deploy.yml` 中添加了正确的环境变量：

```yaml
- name: Build project
  run: |
    npm run build
  env:
    NODE_ENV: production
    VITE_BASE_URL: ${{ github.event.repository.name }}
```

### 2. 修复 Vite 配置

在 `vite.config.ts` 中修复了 base 路径逻辑：

```typescript
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  const repoName = process.env.VITE_BASE_URL;
  const base = isProduction && repoName ? `/${repoName}/` : '/';
  // ...
});
```

### 3. 修复 React Router 配置

在 `src/App.tsx` 中为 BrowserRouter 添加了 basename 属性：

```typescript
export default function App() {
  // 获取基础路径，用于GitHub Pages部署
  const basename = import.meta.env.PROD && import.meta.env.VITE_BASE_URL 
    ? `/${import.meta.env.VITE_BASE_URL}` 
    : '';

  return (
    <Router basename={basename}>
      {/* ... */}
    </Router>
  );
}
```

## 修复原理

1. **路径问题**：GitHub Pages 项目页面的 URL 格式为 `https://username.github.io/repository-name/`，需要正确设置基础路径
2. **环境变量**：通过 `VITE_BASE_URL` 环境变量动态获取仓库名称
3. **Router 配置**：React Router 需要知道应用的基础路径才能正确处理路由

## 验证方法

1. 推送代码到 GitHub，触发 Actions 构建
2. 等待部署完成
3. 访问 GitHub Pages URL：`https://your-username.github.io/repository-name/`
4. 检查页面是否正常显示内容
5. 测试路由导航是否正常工作

## 常见问题

### 如果仍然显示空白页面

1. 检查浏览器开发者工具的 Console 和 Network 标签
2. 确认 JavaScript 和 CSS 文件是否正确加载
3. 检查 GitHub Pages 设置中的源分支是否正确

### 如果路由不工作

1. 确认使用的是 `BrowserRouter` 而不是 `HashRouter`
2. 检查 `basename` 属性是否正确设置
3. 考虑添加 404.html 文件处理直接访问子路由的情况

## 注意事项

- 本地开发时 `basename` 为空字符串，不影响开发体验
- 生产环境会自动应用正确的基础路径
- 如果使用自定义域名，可能需要调整配置

## 下次部署

现在配置已经修复，后续的 GitHub Actions 部署应该能正常工作。每次推送到 main 分支都会自动触发构建和部署。