<template>
  <div class="post-layout">
    <!-- 使用默认的页面布局 -->
    <Layout>
      <template #page-bottom>
        <div v-if="shouldShowComments" class="comments-section theme-default-content">
          <hr style="margin: 2rem 0; border: none; border-top: 1px solid #eaecef;">
          <h3 style="margin-bottom: 1rem;">💬 评论</h3>
          <GiscusComments
            :repo="giscusConfig.repo"
            :repo-id="giscusConfig.repoId"
            :category="giscusConfig.category"
            :category-id="giscusConfig.categoryId"
            :mapping="giscusConfig.mapping"
            :theme="giscusConfig.theme"
            :lang="giscusConfig.lang"
          />
        </div>
      </template>
    </Layout>
  </div>
</template>

<script>
import Layout from '@vuepress/theme-default/layouts/Layout.vue'
import GiscusComments from '../components/GiscusComments.vue'

export default {
  name: 'PostLayout',
  components: {
    Layout,
    GiscusComments
  },
  computed: {
    shouldShowComments() {
      // 只在文章页面显示评论
      const path = this.$route.path
      // 排除posts目录首页和README文件
      return path.includes('/posts/') && path !== '/posts/' && !path.endsWith('README.html')
    },
    giscusConfig() {
      // 从站点配置中获取Giscus配置
      return this.$site.themeConfig.giscus || {
        repo: 'BB0813/Binbim-Blog', // 请替换为您的仓库
        repoId: '', // 需要配置
        category: 'Announcements',
        categoryId: '', // 需要配置
        mapping: 'pathname',
        theme: 'preferred_color_scheme',
        lang: 'zh-CN'
      }
    }
  }
}
</script>

<style scoped>
/* 完全模拟 VuePress 默认主题的 wrapper 样式 */
.comments-section {
  /* 基础样式 - 与 $wrapper 完全一致 */
  max-width: 740px;
  margin: 0 auto;
  padding: 2rem 2.5rem;
  box-sizing: border-box;
}

/* 中等屏幕适配 - 与 VuePress 默认主题一致 */
@media (max-width: 959px) {
  .comments-section {
    padding: 2rem;
  }
}

/* 移动端适配 - 与 VuePress 默认主题一致 */
@media (max-width: 419px) {
  .comments-section {
    padding: 1.5rem;
  }
}

/* 确保评论内容不会溢出 */
.comments-section >>> * {
  max-width: 100%;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

/* 移动端特殊优化 - 处理极小屏幕 */
@media (max-width: 320px) {
  .comments-section {
    padding: 1rem;
  }
}
</style>