<template>
  <div class="article-exporter">
    <h3>导出文章</h3>
    <p class="description">将保存的文章导出为Markdown文件，以便添加到博客中。</p>
    
    <div v-if="articles.length === 0" class="empty-state">
      暂无文章可导出，请先添加文章。
    </div>
    
    <div v-else>
      <div v-for="(article, index) in articles" :key="index" class="export-item">
        <div class="article-info">
          <h4>{{ article.title }}</h4>
          <p>{{ article.description || '无描述' }}</p>
        </div>
        <div class="export-actions">
          <button @click="generateMarkdown(article)" class="export-btn">生成Markdown</button>
        </div>
      </div>
      
      <div v-if="generatedMarkdown" class="markdown-preview">
        <h4>生成的Markdown代码</h4>
        <p>复制下面的代码并保存为 <code>{{ currentFilename }}.md</code> 文件到 <code>docs/posts/</code> 目录中：</p>
        <div class="code-container">
          <pre><code>{{ generatedMarkdown }}</code></pre>
        </div>
        <button @click="copyToClipboard" class="copy-btn">复制代码</button>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 文章导出组件
 * 用于将文章导出为Markdown文件
 */
export default {
  data() {
    return {
      articles: [],
      generatedMarkdown: '',
      currentFilename: ''
    }
  },
  mounted() {
    // 从localStorage加载文章数据
    this.loadArticles()
  },
  methods: {
    /**
     * 从localStorage加载文章数据
     */
    loadArticles() {
      if (typeof window === 'undefined') return
      const savedArticles = localStorage.getItem('blog-articles')
      if (savedArticles) {
        try {
          this.articles = JSON.parse(savedArticles)
        } catch (e) {
          console.error('加载文章失败:', e)
          this.articles = []
        }
      }
    },
    
    /**
     * 生成Markdown文件内容
     * @param {Object} article - 文章对象
     */
    generateMarkdown(article) {
      const frontmatter = [
        '---',
        `title: ${article.title}`,
        `description: ${article.description || ''}`,
        `date: ${new Date().toISOString().split('T')[0]}`,
        '---',
        ''
      ].join('\n')
      
      this.generatedMarkdown = `${frontmatter}${article.content}`
      this.currentFilename = article.filename
    },
    
    /**
     * 复制生成的Markdown到剪贴板
     */
    copyToClipboard() {
      if (!this.generatedMarkdown) return
      
      // 创建临时textarea元素
      const textarea = document.createElement('textarea')
      textarea.value = this.generatedMarkdown
      document.body.appendChild(textarea)
      
      // 选择并复制文本
      textarea.select()
      document.execCommand('copy')
      
      // 移除临时元素
      document.body.removeChild(textarea)
      
      // 显示成功消息
      alert('Markdown代码已复制到剪贴板')
    }
  }
}
</script>

<style scoped>
.article-exporter {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #eaecef;
}

.description {
  margin-bottom: 20px;
  color: #666;
}

.export-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  margin-bottom: 10px;
  border: 1px solid #eaecef;
  border-radius: 4px;
}

.export-btn {
  background-color: #3eaf7c;
  color: white;
  padding: 5px 10px;
  font-size: 14px;
}

.markdown-preview {
  margin-top: 30px;
  padding: 20px;
  background-color: #f8f8f8;
  border-radius: 4px;
}

.code-container {
  background-color: #282c34;
  color: #abb2bf;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  margin: 15px 0;
}

pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.copy-btn {
  background-color: #4a9cf5;
  color: white;
}

.empty-state {
  text-align: center;
  padding: 30px;
  color: #999;
}
</style>