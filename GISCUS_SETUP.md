# Giscus 评论系统配置指南

本博客已集成 Giscus 评论系统，基于 GitHub Discussions 提供评论功能。

## 🚀 快速配置

### 1. 启用 GitHub Discussions

1. 进入您的 GitHub 仓库 `BB0813/Binbim-Blog`
2. 点击 **Settings** 标签
3. 向下滚动到 **Features** 部分
4. 勾选 **Discussions** 复选框

### 2. 获取 Giscus 配置参数

1. 访问 [giscus.app](https://giscus.app/zh-CN)
2. 在 **仓库** 部分输入：`BB0813/Binbim-Blog`
3. 在 **页面 ↔️ discussion 映射关系** 选择：`pathname`
4. 在 **Discussion 分类** 选择：`Announcements`
5. 复制生成的配置参数

### 3. 更新配置文件

在 `docs/.vuepress/config.js` 文件中更新 giscus 配置：

```javascript
giscus: {
  repo: 'BB0813/Binbim-Blog',
  repoId: 'R_kgDOOk8u1w', // 从 giscus.app 获取
  category: 'Announcements',
  categoryId: 'DIC_kwDOOk8u184CtsVb', // 从 giscus.app 获取
  mapping: 'pathname',
  strict: '0',
  reactionsEnabled: '1',
  emitMetadata: '0',
  inputPosition: 'bottom',
  theme: 'preferred_color_scheme',
  lang: 'zh-CN',
  loading: 'lazy'
}
```

## ✨ 功能特点

- ✅ **完全免费**：基于 GitHub Discussions，无需额外费用
- ✅ **数据安全**：评论数据存储在您的 GitHub 仓库中
- ✅ **主题适配**：自动适配浅色/深色主题
- ✅ **多语言支持**：支持中文界面
- ✅ **表情反应**：支持 GitHub 风格的表情反应
- ✅ **回复功能**：支持嵌套回复
- ✅ **Markdown**：支持 Markdown 格式评论

## 🎯 使用说明

### 对于访客

1. 需要 GitHub 账号才能发表评论
2. 首次评论需要授权 giscus 应用
3. 支持 Markdown 语法编写评论
4. 可以对评论进行表情反应

### 对于博主

1. 可以在 GitHub Discussions 中管理所有评论
2. 可以置顶、锁定或删除讨论
3. 评论会自动同步到对应的文章页面
4. 支持邮件通知新评论

## 🔧 自定义配置

### 主题配置

可以在配置中修改主题：

- `light` - 浅色主题
- `dark` - 深色主题
- `preferred_color_scheme` - 跟随系统主题（推荐）
- `transparent_dark` - 透明深色主题

### 语言配置

支持多种语言：

- `zh-CN` - 简体中文
- `en` - 英语
- `ja` - 日语
- 等等...

### 映射方式

- `pathname` - 使用页面路径（推荐）
- `url` - 使用完整 URL
- `title` - 使用页面标题
- `og:title` - 使用 Open Graph 标题

## 🚨 注意事项

1. **仓库必须是公开的**：Giscus 只支持公开仓库
2. **需要安装 giscus 应用**：在 [GitHub Apps](https://github.com/apps/giscus) 安装
3. **Discussions 必须启用**：确保仓库启用了 Discussions 功能
4. **配置参数必须正确**：repoId 和 categoryId 必须准确

## 🔍 故障排除

### 评论不显示

1. 检查仓库是否为公开
2. 确认 Discussions 已启用
3. 验证 giscus 应用已安装
4. 检查配置参数是否正确

### 无法发表评论

1. 确认已登录 GitHub
2. 检查是否授权了 giscus 应用
3. 确认仓库权限设置正确

## 📚 更多资源

- [Giscus 官方文档](https://giscus.app/zh-CN)
- [GitHub Discussions 文档](https://docs.github.com/en/discussions)
- [VuePress 官方文档](https://vuepress.vuejs.org/)

---

配置完成后，重新部署博客即可看到评论功能！🎉