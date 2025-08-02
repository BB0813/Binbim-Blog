<template>
  <div class="giscus-comments">
    <div ref="giscusContainer" class="giscus-container"></div>
  </div>
</template>

<script>
export default {
  name: 'GiscusComments',
  props: {
    repo: {
      type: String,
      default: 'BB0813/Binbim-Blog'
    },
    repoId: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      default: 'Announcements'
    },
    categoryId: {
      type: String,
      default: ''
    },
    mapping: {
      type: String,
      default: 'pathname'
    },
    strict: {
      type: String,
      default: '0'
    },
    reactionsEnabled: {
      type: String,
      default: '1'
    },
    emitMetadata: {
      type: String,
      default: '0'
    },
    inputPosition: {
      type: String,
      default: 'bottom'
    },
    theme: {
      type: String,
      default: 'preferred_color_scheme'
    },
    lang: {
      type: String,
      default: 'zh-CN'
    },
    loading: {
      type: String,
      default: 'lazy'
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.loadGiscus()
    })
  },
  methods: {
    loadGiscus() {
      // 检查必要的配置
      if (!this.repo) {
        console.warn('Giscus: repo 配置缺失')
        return
      }
      
      // 如果repoId或categoryId为空，显示配置提示
      if (!this.repoId || !this.categoryId) {
        this.$refs.giscusContainer.innerHTML = `
          <div style="padding: 20px; border: 1px solid #e1e4e8; border-radius: 6px; background-color: #f6f8fa; text-align: center;">
            <h4>📝 评论系统配置提示</h4>
            <p>请按照 <a href="/Binbim-Blog/GISCUS_SETUP.html" target="_blank">配置指南</a> 完成 Giscus 设置</p>
            <p>需要配置 <code>repoId</code> 和 <code>categoryId</code> 参数</p>
          </div>
        `
        return
      }

      // 清除现有内容
      this.$refs.giscusContainer.innerHTML = ''
      
      // 移除已存在的giscus脚本
      const existingScript = document.querySelector('script[src="https://giscus.app/client.js"]')
      if (existingScript) {
        existingScript.remove()
      }

      // 创建新的script标签
      const script = document.createElement('script')
      script.src = 'https://giscus.app/client.js'
      script.setAttribute('data-repo', this.repo)
      script.setAttribute('data-repo-id', this.repoId)
      script.setAttribute('data-category', this.category)
      script.setAttribute('data-category-id', this.categoryId)
      script.setAttribute('data-mapping', this.mapping)
      script.setAttribute('data-strict', this.strict)
      script.setAttribute('data-reactions-enabled', this.reactionsEnabled)
      script.setAttribute('data-emit-metadata', this.emitMetadata)
      script.setAttribute('data-input-position', this.inputPosition)
      script.setAttribute('data-theme', this.theme)
      script.setAttribute('data-lang', this.lang)
      script.setAttribute('data-loading', this.loading)
      script.crossOrigin = 'anonymous'
      script.async = true

      // 将script添加到容器中
      this.$refs.giscusContainer.appendChild(script)
    }
  },
  watch: {
    // 监听路由变化，重新加载评论
    '$route': {
      handler() {
        this.$nextTick(() => {
          this.loadGiscus()
        })
      },
      immediate: false
    }
  }
}
</script>

<style scoped>
.giscus-comments {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #eaecef;
}

@media (max-width: 768px) {
  .giscus-comments {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
  }
}
</style>