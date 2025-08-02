<template>
  <div class="post-layout">
    <!-- 使用默认的页面布局 -->
    <Layout>
      <template #page-bottom>
        <!-- 在页面底部添加评论组件 -->
        <div class="comments-section" v-if="shouldShowComments">
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
      return path.includes('/posts/') && path !== '/posts/' && !path.includes('README')
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
.comments-section {
  max-width: 740px;
  margin: 0 auto;
  padding: 0 2.5rem;
}

@media (max-width: 959px) {
  .comments-section {
    padding: 0 2rem;
  }
}

@media (max-width: 419px) {
  .comments-section {
    padding: 0 1.5rem;
  }
}
</style>