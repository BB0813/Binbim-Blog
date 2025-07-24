<template>
  <div class="article-manager">
    <div class="tabs">
      <button 
        :class="['tab-button', { active: activeTab === 'list' }]" 
        @click="activeTab = 'list'"
      >
        文章列表
      </button>
      <button 
        :class="['tab-button', { active: activeTab === 'add' }]" 
        @click="activeTab = 'add'"
      >
        添加文章
      </button>
      <button 
        :class="['tab-button', { active: activeTab === 'export' }]" 
        @click="activeTab = 'export'"
      >
        导出文章
      </button>
      <button 
        :class="['tab-button', { active: activeTab === 'settings' }]" 
        @click="activeTab = 'settings'"
      >
        设置
      </button>
    </div>

    <!-- 文章列表 -->
    <div v-if="activeTab === 'list'" class="tab-content">
      <h3>现有文章</h3>
      <div v-if="articles.length === 0" class="empty-state">
        暂无文章，请添加新文章。
      </div>
      <div v-else class="article-list">
        <div v-for="(article, index) in articles" :key="index" class="article-item">
          <div class="article-info">
            <h4>{{ article.title }}</h4>
            <p>{{ article.description || '无描述' }}</p>
            <div class="article-meta">
              <span>文件名: {{ article.filename }}</span>
            </div>
          </div>
          <div class="article-actions">
            <button @click="editArticle(index)" class="edit-btn">编辑</button>
            <button @click="confirmDeleteArticle(index)" class="delete-btn">删除</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加/编辑文章 -->
    <div v-if="activeTab === 'add'" class="tab-content">
      <h3>{{ isEditing ? '编辑文章' : '添加新文章' }}</h3>
      <div class="form-group">
        <label for="title">标题</label>
        <input 
          type="text" 
          id="title" 
          v-model="currentArticle.title" 
          placeholder="文章标题"
        >
      </div>
      <div class="form-group">
        <label for="filename">文件名</label>
        <input 
          type="text" 
          id="filename" 
          v-model="currentArticle.filename" 
          placeholder="例如: my-post (不需要.md后缀)"
          :disabled="isEditing"
        >
      </div>
      <div class="form-group">
        <label for="description">描述</label>
        <input 
          type="text" 
          id="description" 
          v-model="currentArticle.description" 
          placeholder="文章简短描述"
        >
      </div>
      <div class="form-group">
        <label for="content">内容</label>
        <textarea 
          id="content" 
          v-model="currentArticle.content" 
          placeholder="使用Markdown格式编写文章内容"
          rows="10"
        ></textarea>
      </div>
      
      <!-- Markdown预览 -->
      <ArticlePreview :content="currentArticle.content" />
      <div class="form-actions">
        <button @click="resetForm" class="cancel-btn">取消</button>
        <button @click="saveArticle" class="save-btn">保存</button>
      </div>
    </div>
    
    <!-- 导出文章 -->
    <div v-if="activeTab === 'export'" class="tab-content">
      <ArticleExporter />
    </div>
    
    <!-- 设置 -->
    <div v-if="activeTab === 'settings'" class="tab-content">
      <h3>数据管理</h3>
      <div class="settings-section">
        <h4>数据备份</h4>
        <p>将所有文章数据导出为JSON文件，便于备份和迁移。</p>
        <div class="settings-actions">
          <button @click="exportData" class="primary-btn">导出数据</button>
        </div>
      </div>
      
      <div class="settings-section">
        <h4>数据恢复</h4>
        <p>从JSON文件恢复文章数据。</p>
        <div class="file-upload">
          <input type="file" id="data-file" @change="handleFileUpload" accept=".json">
          <label for="data-file" class="file-label">选择JSON文件</label>
        </div>
        <div class="settings-actions" v-if="selectedFile">
          <span class="file-name">已选择: {{ selectedFile.name }}</span>
          <button @click="importData" class="primary-btn">导入数据</button>
        </div>
      </div>
      
      <div class="settings-section">
        <h4>自动保存设置</h4>
        <div class="settings-option">
          <div class="checkbox-group">
            <input type="checkbox" id="auto-save" v-model="autoSave">
            <label for="auto-save">启用自动保存</label>
          </div>
          <p class="setting-description">启用后，编辑文章时会自动保存草稿</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ArticleExporter from './ArticleExporter.vue'
import ArticlePreview from './ArticlePreview.vue'

/**
 * 文章管理组件
 * 用于添加、编辑和管理博客文章
 */
export default {
  components: {
    ArticleExporter,
    ArticlePreview
  },
  data() {
    return {
      activeTab: 'list',
      articles: [],
      currentArticle: {
        title: '',
        filename: '',
        description: '',
        content: ''
      },
      isEditing: false,
      editIndex: -1,
      autoSave: true,
      autoSaveInterval: null,
      lastSavedDraft: null,
      selectedFile: null
    }
  },
  mounted() {
    // 从localStorage加载文章数据
    this.loadArticles()
    
    // 加载自动保存设置
    this.loadAutoSaveSettings()
    
    // 恢复草稿（如果有）
    this.restoreDraft()
    
    // 设置自动保存
    this.setupAutoSave()
  },
  
  beforeDestroy() {
    // 清除自动保存定时器
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval)
    }
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
     * 加载自动保存设置
     */
    loadAutoSaveSettings() {
      if (typeof window === 'undefined') return
      const savedSetting = localStorage.getItem('blog-auto-save')
      if (savedSetting !== null) {
        this.autoSave = JSON.parse(savedSetting)
      }
    },
    
    /**
     * 设置自动保存
     */
    setupAutoSave() {
      // 清除现有定时器
      if (this.autoSaveInterval) {
        clearInterval(this.autoSaveInterval)
      }
      
      // 如果启用了自动保存，设置定时器
      if (this.autoSave) {
        this.autoSaveInterval = setInterval(() => {
          if (this.activeTab === 'add' && 
              (this.currentArticle.title || this.currentArticle.content)) {
            this.saveDraft()
          }
        }, 30000) // 每30秒自动保存一次
      }
    },
    
    /**
     * 保存草稿
     */
    saveDraft() {
      if (typeof window === 'undefined') return
      const draft = JSON.stringify(this.currentArticle)
      localStorage.setItem('blog-article-draft', draft)
      this.lastSavedDraft = new Date().toLocaleTimeString()
    },
    
    /**
     * 恢复草稿
     */
    restoreDraft() {
      if (typeof window === 'undefined') return
      const savedDraft = localStorage.getItem('blog-article-draft')
      if (savedDraft && !this.isEditing) {
        try {
          const draft = JSON.parse(savedDraft)
          if (draft.title || draft.content) {
            if (confirm('发现未保存的草稿，是否恢复？')) {
              this.currentArticle = draft
              this.activeTab = 'add'
            } else {
              localStorage.removeItem('blog-article-draft')
            }
          }
        } catch (e) {
          console.error('恢复草稿失败:', e)
          localStorage.removeItem('blog-article-draft')
        }
      }
    },
    
    /**
     * 保存文章数据到localStorage
     */
    saveArticlesToStorage() {
      if (typeof window === 'undefined') return
      localStorage.setItem('blog-articles', JSON.stringify(this.articles))
    },
    
    /**
     * 重置表单数据
     */
    resetForm() {
      this.currentArticle = {
        title: '',
        filename: '',
        description: '',
        content: ''
      }
      this.isEditing = false
      this.editIndex = -1
      this.activeTab = 'list'
    },
    
    /**
     * 编辑文章
     * @param {Number} index - 要编辑的文章索引
     */
    editArticle(index) {
      const article = this.articles[index]
      this.currentArticle = { ...article }
      this.isEditing = true
      this.editIndex = index
      this.activeTab = 'add'
    },
    
    /**
     * 保存文章
     */
    saveArticle() {
      // 表单验证
      if (!this.currentArticle.title || !this.currentArticle.filename) {
        alert('标题和文件名不能为空')
        return
      }
      
      // 文件名验证
      const filenameRegex = /^[a-zA-Z0-9_-]+$/
      if (!filenameRegex.test(this.currentArticle.filename)) {
        alert('文件名只能包含字母、数字、连字符和下划线')
        return
      }
      
      // 准备文章数据
      const articleData = {
        title: this.currentArticle.title,
        filename: this.currentArticle.filename,
        description: this.currentArticle.description,
        content: this.currentArticle.content,
        date: new Date().toISOString(),
        lastModified: new Date().toISOString()
      }
      
      if (this.isEditing) {
        // 更新现有文章
        this.articles[this.editIndex] = articleData
      } else {
        // 添加新文章
        this.articles.push(articleData)
      }
      
      // 保存到localStorage
      this.saveArticlesToStorage()
      
      // 重置表单
      this.resetForm()
      
      // 清除草稿
      if (typeof window !== 'undefined') {
        localStorage.removeItem('blog-article-draft')
      }
      
      // 显示成功消息
      alert(this.isEditing ? '文章已更新' : '文章已添加')
    },
    
    /**
     * 导出数据为JSON文件
     */
    exportData() {
      if (this.articles.length === 0) {
        alert('没有可导出的文章数据')
        return
      }
      
      // 准备导出数据
      const exportData = {
        articles: this.articles,
        exportDate: new Date().toISOString(),
        version: '1.0'
      }
      
      // 创建下载链接
      const dataStr = JSON.stringify(exportData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      
      // 创建下载链接并触发下载
      const link = document.createElement('a')
      link.href = url
      link.download = `blog-articles-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // 释放URL对象
      setTimeout(() => URL.revokeObjectURL(url), 100)
    },
    
    /**
     * 处理文件上传
     */
    handleFileUpload(event) {
      this.selectedFile = event.target.files[0]
    },
    
    /**
     * 从JSON文件导入数据
     */
    importData() {
      if (!this.selectedFile) {
        alert('请选择要导入的JSON文件')
        return
      }
      
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result)
          
          // 验证导入的数据格式
          if (!importedData.articles || !Array.isArray(importedData.articles)) {
            throw new Error('无效的数据格式')
          }
          
          // 确认导入
          if (confirm(`确定要导入${importedData.articles.length}篇文章吗？这将覆盖现有数据。`)) {
            this.articles = importedData.articles
            this.saveArticlesToStorage()
            alert('数据导入成功')
            this.selectedFile = null
            document.getElementById('data-file').value = ''
          }
        } catch (error) {
          alert(`导入失败: ${error.message}`)
        }
      }
      
      reader.readAsText(this.selectedFile)
    },
    
    /**
     * 确认删除文章
     * @param {Number} index - 要删除的文章索引
     */
    confirmDeleteArticle(index) {
      if (confirm('确定要删除这篇文章吗？此操作不可恢复。')) {
        this.deleteArticle(index)
      }
    },
    
    /**
     * 删除文章
     * @param {Number} index - 要删除的文章索引
     */
    deleteArticle(index) {
      this.articles.splice(index, 1)
      this.saveArticlesToStorage()
      alert('文章已删除')
    }
  },
  
  /**
   * 监听自动保存设置变化
   */
  watch: {
    autoSave(newValue) {
      // 保存设置到localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('blog-auto-save', JSON.stringify(newValue))
      }
      // 更新自动保存设置
      this.setupAutoSave()
    }
  }
}
</script>

<style scoped>
.article-manager {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.tabs {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #eaecef;
}

.tab-button {
  padding: 10px 20px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #2c3e50;
}

.tab-button.active {
  color: #3eaf7c;
  border-bottom: 2px solid #3eaf7c;
}

.tab-content {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input, textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

textarea {
  resize: vertical;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.save-btn {
  background-color: #3eaf7c;
  color: white;
}

.cancel-btn {
  background-color: #f3f3f3;
  color: #666;
}

.edit-btn {
  background-color: #4a9cf5;
  color: white;
  padding: 5px 10px;
  font-size: 14px;
  margin-right: 5px;
}

.delete-btn {
  background-color: #f56c6c;
  color: white;
  padding: 5px 10px;
  font-size: 14px;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.article-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border: 1px solid #eaecef;
  border-radius: 4px;
}

.article-info {
  flex: 1;
}

.article-info h4 {
  margin: 0 0 5px 0;
}

.article-info p {
  margin: 0 0 10px 0;
  color: #666;
}

.article-meta {
  font-size: 14px;
  color: #999;
}

.empty-state {
  text-align: center;
  padding: 30px;
  color: #999;
}

/* 设置页面样式 */
.settings-section {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eaecef;
}

.settings-section h4 {
  margin-top: 0;
  margin-bottom: 10px;
}

.settings-actions {
  margin-top: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.primary-btn {
  background-color: #3eaf7c;
  color: white;
}

.file-upload {
  margin-top: 15px;
}

.file-upload input[type="file"] {
  display: none;
}

.file-label {
  display: inline-block;
  padding: 8px 16px;
  background-color: #f3f3f3;
  color: #2c3e50;
  border-radius: 4px;
  cursor: pointer;
}

.file-label:hover {
  background-color: #e6e6e6;
}

.file-name {
  font-size: 14px;
  color: #666;
}

.settings-option {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
}

.checkbox-group {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.checkbox-group input[type="checkbox"] {
  margin-right: 8px;
}

.setting-description {
  font-size: 14px;
  color: #666;
  margin-top: 5px;
  margin-left: 24px;
}
</style>