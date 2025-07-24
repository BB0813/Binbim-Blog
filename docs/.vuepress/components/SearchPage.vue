<template>
  <div class="search-container">
    <div class="search-header">
      <h1>🔍 文章搜索</h1>
      <p>快速找到您需要的内容</p>
    </div>

    <!-- 搜索框 -->
    <div class="search-box-container">
      <div class="search-input-wrapper">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="输入关键词搜索文章..."
          class="search-input"
          @input="handleSearch"
          @keyup.enter="performSearch"
        />
        <button @click="performSearch" class="search-button">
          🔍 搜索
        </button>
      </div>
      
      <!-- 高级搜索选项 -->
      <div class="search-options">
        <button 
          @click="showAdvanced = !showAdvanced" 
          class="advanced-toggle"
        >
          {{ showAdvanced ? '隐藏' : '显示' }}高级选项 
          <span :class="['arrow', { 'rotated': showAdvanced }]">▼</span>
        </button>
      </div>
      
      <div v-if="showAdvanced" class="advanced-search">
        <div class="filter-row">
          <div class="filter-group">
            <label>分类筛选:</label>
            <select v-model="selectedCategory" @change="handleSearch">
              <option value="">所有分类</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>标签筛选:</label>
            <select v-model="selectedTag" @change="handleSearch">
              <option value="">所有标签</option>
              <option v-for="tag in allTags" :key="tag" :value="tag">
                {{ tag }}
              </option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>排序方式:</label>
            <select v-model="sortBy" @change="handleSearch">
              <option value="relevance">相关性</option>
              <option value="date-desc">最新发布</option>
              <option value="date-asc">最早发布</option>
              <option value="title">标题排序</option>
            </select>
          </div>
        </div>
        
        <div class="filter-row">
          <div class="filter-group">
            <label>日期范围:</label>
            <input 
              v-model="dateFrom" 
              type="date" 
              @change="handleSearch"
              class="date-input"
            />
            <span class="date-separator">至</span>
            <input 
              v-model="dateTo" 
              type="date" 
              @change="handleSearch"
              class="date-input"
            />
          </div>
          
          <button @click="clearFilters" class="clear-filters">
            清除筛选 ✕
          </button>
        </div>
      </div>
    </div>

    <!-- 搜索统计 -->
    <div v-if="hasSearched" class="search-stats">
      <div class="stats-info">
        <span class="result-count">
          找到 <strong>{{ filteredResults.length }}</strong> 篇相关文章
        </span>
        <span v-if="searchQuery" class="search-term">
          关键词: "{{ searchQuery }}"
        </span>
      </div>
      
      <div v-if="searchQuery" class="search-suggestions">
        <span class="suggestion-label">相关搜索:</span>
        <span 
          v-for="suggestion in searchSuggestions" 
          :key="suggestion"
          class="suggestion-tag"
          @click="searchQuery = suggestion; handleSearch()"
        >
          {{ suggestion }}
        </span>
      </div>
    </div>

    <!-- 搜索结果 -->
    <div v-if="hasSearched" class="search-results">
      <div v-if="filteredResults.length === 0" class="no-results">
        <div class="no-results-icon">📭</div>
        <h3>未找到相关文章</h3>
        <p>尝试使用不同的关键词或调整筛选条件</p>
        <div class="search-tips">
          <h4>搜索建议:</h4>
          <ul>
            <li>检查关键词拼写是否正确</li>
            <li>尝试使用更通用的关键词</li>
            <li>减少筛选条件</li>
            <li>使用标签或分类浏览</li>
          </ul>
        </div>
      </div>
      
      <div v-else class="results-grid">
        <article 
          v-for="(result, index) in paginatedResults" 
          :key="result.path"
          class="result-card"
          :class="{ 'featured': result.score > 0.8 }"
        >
          <div class="result-header">
            <router-link :to="result.path" class="result-title">
              <span v-html="highlightText(result.title)"></span>
            </router-link>
            <div class="result-score" v-if="searchQuery">
              匹配度: {{ Math.round(result.score * 100) }}%
            </div>
          </div>
          
          <div class="result-meta">
            <span class="result-date">
              📅 {{ formatDate(result.frontmatter.date) }}
            </span>
            <span v-if="result.frontmatter.category" class="result-category">
              📂 {{ result.frontmatter.category }}
            </span>
            <span v-if="result.frontmatter.readTime" class="result-read-time">
              ⏱️ {{ result.frontmatter.readTime }}
            </span>
          </div>
          
          <div v-if="result.frontmatter.description" class="result-description">
            <span v-html="highlightText(result.frontmatter.description)"></span>
          </div>
          
          <div v-if="result.excerpt" class="result-excerpt">
            <span v-html="highlightText(result.excerpt)"></span>
          </div>
          
          <div class="result-tags">
            <span 
              v-for="tag in result.frontmatter.tags" 
              :key="tag"
              class="result-tag"
              @click="selectedTag = tag; handleSearch()"
            >
              🏷️ {{ tag }}
            </span>
          </div>
          
          <div class="result-actions">
            <router-link :to="result.path" class="read-more">
              阅读全文 →
            </router-link>
          </div>
        </article>
      </div>
      
      <!-- 分页 -->
      <div v-if="totalPages > 1" class="pagination">
        <button 
          @click="currentPage = Math.max(1, currentPage - 1)"
          :disabled="currentPage === 1"
          class="page-btn"
        >
          ← 上一页
        </button>
        
        <span class="page-info">
          第 {{ currentPage }} 页，共 {{ totalPages }} 页
        </span>
        
        <button 
          @click="currentPage = Math.min(totalPages, currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="page-btn"
        >
          下一页 →
        </button>
      </div>
    </div>

    <!-- 热门搜索 -->
    <div v-if="!hasSearched" class="popular-searches">
      <h2>🔥 热门搜索</h2>
      <div class="popular-tags">
        <span 
          v-for="tag in popularSearches" 
          :key="tag"
          class="popular-tag"
          @click="searchQuery = tag; handleSearch()"
        >
          {{ tag }}
        </span>
      </div>
    </div>

    <!-- 最近文章 -->
    <div v-if="!hasSearched" class="recent-posts">
      <h2>📝 最新文章</h2>
      <div class="recent-grid">
        <article 
          v-for="post in recentPosts" 
          :key="post.path"
          class="recent-card"
        >
          <router-link :to="post.path" class="recent-title">
            {{ post.title }}
          </router-link>
          <div class="recent-meta">
            <span class="recent-date">
              📅 {{ formatDate(post.frontmatter.date) }}
            </span>
          </div>
          <p v-if="post.frontmatter.description" class="recent-description">
            {{ post.frontmatter.description }}
          </p>
        </article>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchPage',
  data() {
    return {
      searchQuery: '',
      selectedCategory: '',
      selectedTag: '',
      sortBy: 'relevance',
      dateFrom: '',
      dateTo: '',
      showAdvanced: false,
      hasSearched: false,
      searchResults: [],
      currentPage: 1,
      pageSize: 10,
      debounceTimer: null
    }
  },
  
  computed: {
    posts() {
      return this.$site.pages
        .filter(page => page.path.startsWith('/posts/') && page.path !== '/posts/' && !page.path.endsWith('README.md'))
        .map(page => ({
          title: page.title || page.path.split('/').pop().replace('.html', ''),
          path: page.path,
          frontmatter: page.frontmatter,
          content: page.content || '',
          excerpt: this.generateExcerpt(page.content || '')
        }))
    },
    
    categories() {
      const cats = new Set()
      this.posts.forEach(post => {
        if (post.frontmatter.category) {
          cats.add(post.frontmatter.category)
        }
      })
      return Array.from(cats).sort()
    },
    
    allTags() {
      const tags = new Set()
      this.posts.forEach(post => {
        if (post.frontmatter.tags) {
          post.frontmatter.tags.forEach(tag => tags.add(tag))
        }
      })
      return Array.from(tags).sort()
    },
    
    filteredResults() {
      let results = this.searchResults
      
      // 分类筛选
      if (this.selectedCategory) {
        results = results.filter(post => post.frontmatter.category === this.selectedCategory)
      }
      
      // 标签筛选
      if (this.selectedTag) {
        results = results.filter(post => 
          post.frontmatter.tags && post.frontmatter.tags.includes(this.selectedTag)
        )
      }
      
      // 日期筛选
      if (this.dateFrom) {
        results = results.filter(post => 
          new Date(post.frontmatter.date) >= new Date(this.dateFrom)
        )
      }
      
      if (this.dateTo) {
        results = results.filter(post => 
          new Date(post.frontmatter.date) <= new Date(this.dateTo)
        )
      }
      
      // 排序
      return this.sortResults(results)
    },
    
    paginatedResults() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return this.filteredResults.slice(start, end)
    },
    
    totalPages() {
      return Math.ceil(this.filteredResults.length / this.pageSize)
    },
    
    searchSuggestions() {
      if (!this.searchQuery) return []
      
      const suggestions = new Set()
      this.allTags.forEach(tag => {
        if (tag.toLowerCase().includes(this.searchQuery.toLowerCase()) && tag !== this.searchQuery) {
          suggestions.add(tag)
        }
      })
      
      return Array.from(suggestions).slice(0, 5)
    },
    
    popularSearches() {
      return this.allTags.slice(0, 10)
    },
    
    recentPosts() {
      return this.posts
        .sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date))
        .slice(0, 6)
    }
  },
  
  methods: {
    handleSearch() {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = setTimeout(() => {
        this.performSearch()
      }, 300)
    },
    
    performSearch() {
      this.hasSearched = true
      this.currentPage = 1
      
      if (!this.searchQuery.trim()) {
        this.searchResults = this.posts
      } else {
        this.searchResults = this.searchPosts(this.searchQuery)
      }
    },
    
    searchPosts(query) {
      const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0)
      
      return this.posts.map(post => {
        let score = 0
        const titleLower = post.title.toLowerCase()
        const contentLower = post.content.toLowerCase()
        const descriptionLower = (post.frontmatter.description || '').toLowerCase()
        const tagsLower = (post.frontmatter.tags || []).join(' ').toLowerCase()
        
        searchTerms.forEach(term => {
          // 标题匹配权重最高
          if (titleLower.includes(term)) {
            score += titleLower === term ? 1.0 : 0.8
          }
          
          // 描述匹配
          if (descriptionLower.includes(term)) {
            score += 0.6
          }
          
          // 标签匹配
          if (tagsLower.includes(term)) {
            score += 0.5
          }
          
          // 内容匹配
          if (contentLower.includes(term)) {
            score += 0.3
          }
        })
        
        return { ...post, score }
      })
      .filter(post => post.score > 0)
      .sort((a, b) => b.score - a.score)
    },
    
    sortResults(results) {
      switch (this.sortBy) {
        case 'date-desc':
          return results.sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date))
        case 'date-asc':
          return results.sort((a, b) => new Date(a.frontmatter.date) - new Date(b.frontmatter.date))
        case 'title':
          return results.sort((a, b) => a.title.localeCompare(b.title))
        case 'relevance':
        default:
          return results
      }
    },
    
    highlightText(text) {
      if (!this.searchQuery || !text) return text
      
      const searchTerms = this.searchQuery.split(' ').filter(term => term.length > 0)
      let highlightedText = text
      
      searchTerms.forEach(term => {
        const regex = new RegExp(`(${term})`, 'gi')
        highlightedText = highlightedText.replace(regex, '<mark>$1</mark>')
      })
      
      return highlightedText
    },
    
    generateExcerpt(content) {
      const plainText = content.replace(/<[^>]*>/g, '').replace(/[#*`]/g, '')
      return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText
    },
    
    clearFilters() {
      this.selectedCategory = ''
      this.selectedTag = ''
      this.dateFrom = ''
      this.dateTo = ''
      this.sortBy = 'relevance'
      this.handleSearch()
    },
    
    formatDate(date) {
      if (!date) return ''
      const d = new Date(date)
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    }
  },
  
  mounted() {
    // 从URL参数获取搜索查询
    const urlParams = new URLSearchParams(window.location.search)
    const query = urlParams.get('q')
    if (query) {
      this.searchQuery = query
      this.performSearch()
    }
  }
}
</script>

<style lang="stylus" scoped>
.search-container
  max-width 1000px
  margin 0 auto
  padding 2rem 1.5rem

.search-header
  text-align center
  margin-bottom 2rem
  
  h1
    font-size 2.5rem
    color #2c3e50
    margin-bottom 0.5rem
  
  p
    color #6a8bad
    font-size 1.2rem

.search-box-container
  background #fff
  padding 2rem
  border-radius 12px
  box-shadow 0 4px 12px rgba(0, 0, 0, 0.05)
  margin-bottom 2rem
  
  .search-input-wrapper
    display flex
    gap 1rem
    margin-bottom 1rem
    
    .search-input
      flex 1
      padding 1rem 1.5rem
      border 2px solid #e0e6ed
      border-radius 25px
      font-size 1.1rem
      outline none
      transition all 0.3s ease
      
      &:focus
        border-color #3eaf7c
        box-shadow 0 0 0 3px rgba(62, 175, 124, 0.1)
    
    .search-button
      padding 1rem 2rem
      background #3eaf7c
      color #fff
      border none
      border-radius 25px
      font-size 1.1rem
      cursor pointer
      transition all 0.3s ease
      
      &:hover
        background darken(#3eaf7c, 10%)
  
  .search-options
    text-align center
    
    .advanced-toggle
      background none
      border none
      color #6a8bad
      cursor pointer
      font-size 1rem
      transition all 0.3s ease
      
      &:hover
        color #3eaf7c
      
      .arrow
        display inline-block
        transition transform 0.3s ease
        margin-left 0.5rem
        
        &.rotated
          transform rotate(180deg)
  
  .advanced-search
    margin-top 1.5rem
    padding-top 1.5rem
    border-top 1px solid #e0e6ed
    
    .filter-row
      display flex
      gap 1rem
      margin-bottom 1rem
      align-items flex-end
      flex-wrap wrap
      
      .filter-group
        display flex
        flex-direction column
        gap 0.5rem
        min-width 150px
        
        label
          font-weight 600
          color #2c3e50
          font-size 0.9rem
        
        select, .date-input
          padding 0.5rem
          border 1px solid #e0e6ed
          border-radius 6px
          font-size 0.9rem
          
          &:focus
            outline none
            border-color #3eaf7c
      
      .date-separator
        margin 0 0.5rem
        color #6a8bad
        align-self center
      
      .clear-filters
        padding 0.5rem 1rem
        background #ff6b6b
        color #fff
        border none
        border-radius 6px
        cursor pointer
        font-size 0.9rem
        
        &:hover
          background darken(#ff6b6b, 10%)

.search-stats
  background #f8f9fa
  padding 1.5rem
  border-radius 8px
  margin-bottom 2rem
  
  .stats-info
    display flex
    justify-content space-between
    align-items center
    margin-bottom 1rem
    
    .result-count
      font-size 1.1rem
      color #2c3e50
    
    .search-term
      color #6a8bad
      font-style italic
  
  .search-suggestions
    display flex
    align-items center
    gap 0.5rem
    flex-wrap wrap
    
    .suggestion-label
      color #6a8bad
      font-size 0.9rem
    
    .suggestion-tag
      padding 0.3rem 0.6rem
      background #3eaf7c
      color #fff
      border-radius 12px
      font-size 0.8rem
      cursor pointer
      transition all 0.2s ease
      
      &:hover
        background darken(#3eaf7c, 10%)

.search-results
  .no-results
    text-align center
    padding 3rem 2rem
    
    .no-results-icon
      font-size 4rem
      margin-bottom 1rem
    
    h3
      color #2c3e50
      margin-bottom 1rem
    
    p
      color #6a8bad
      margin-bottom 2rem
    
    .search-tips
      background #f8f9fa
      padding 1.5rem
      border-radius 8px
      text-align left
      max-width 400px
      margin 0 auto
      
      h4
        color #2c3e50
        margin-bottom 1rem
      
      ul
        color #6a8bad
        line-height 1.6
  
  .results-grid
    display grid
    gap 1.5rem
    
    .result-card
      background #fff
      padding 1.5rem
      border-radius 12px
      box-shadow 0 4px 12px rgba(0, 0, 0, 0.05)
      transition all 0.3s ease
      border-left 4px solid transparent
      
      &:hover
        transform translateY(-3px)
        box-shadow 0 8px 20px rgba(0, 0, 0, 0.1)
      
      &.featured
        border-left-color #3eaf7c
        background linear-gradient(135deg, #fff 0%, #f8fff9 100%)
      
      .result-header
        display flex
        justify-content space-between
        align-items flex-start
        margin-bottom 1rem
        
        .result-title
          font-size 1.3rem
          font-weight 600
          color #2c3e50
          text-decoration none
          flex 1
          
          &:hover
            color #3eaf7c
        
        .result-score
          background #3eaf7c
          color #fff
          padding 0.3rem 0.6rem
          border-radius 12px
          font-size 0.8rem
          font-weight 600
      
      .result-meta
        display flex
        gap 1rem
        margin-bottom 1rem
        font-size 0.9rem
        color #8e8e8e
        flex-wrap wrap
      
      .result-description, .result-excerpt
        color #476582
        line-height 1.6
        margin-bottom 1rem
      
      .result-tags
        display flex
        flex-wrap wrap
        gap 0.5rem
        margin-bottom 1rem
        
        .result-tag
          padding 0.3rem 0.6rem
          background #f3f5f7
          color #476582
          border-radius 12px
          font-size 0.8rem
          cursor pointer
          transition all 0.2s ease
          
          &:hover
            background #3eaf7c
            color #fff
      
      .result-actions
        text-align right
        
        .read-more
          color #3eaf7c
          text-decoration none
          font-weight 600
          
          &:hover
            color darken(#3eaf7c, 10%)

.pagination
  display flex
  justify-content center
  align-items center
  gap 1rem
  margin-top 2rem
  
  .page-btn
    padding 0.5rem 1rem
    background #3eaf7c
    color #fff
    border none
    border-radius 6px
    cursor pointer
    transition all 0.2s ease
    
    &:hover:not(:disabled)
      background darken(#3eaf7c, 10%)
    
    &:disabled
      background #ccc
      cursor not-allowed
  
  .page-info
    color #6a8bad
    font-size 0.9rem

.popular-searches, .recent-posts
  margin-bottom 3rem
  
  h2
    font-size 1.8rem
    color #2c3e50
    margin-bottom 1.5rem
    text-align center
  
  .popular-tags
    display flex
    flex-wrap wrap
    gap 0.5rem
    justify-content center
    
    .popular-tag
      padding 0.5rem 1rem
      background #3eaf7c
      color #fff
      border-radius 20px
      cursor pointer
      transition all 0.3s ease
      
      &:hover
        background darken(#3eaf7c, 10%)
        transform scale(1.05)
  
  .recent-grid
    display grid
    grid-template-columns repeat(auto-fit, minmax(300px, 1fr))
    gap 1rem
    
    .recent-card
      background #fff
      padding 1.5rem
      border-radius 12px
      box-shadow 0 4px 12px rgba(0, 0, 0, 0.05)
      transition all 0.3s ease
      
      &:hover
        transform translateY(-3px)
        box-shadow 0 8px 20px rgba(0, 0, 0, 0.1)
      
      .recent-title
        display block
        font-size 1.2rem
        font-weight 600
        color #2c3e50
        text-decoration none
        margin-bottom 0.5rem
        
        &:hover
          color #3eaf7c
      
      .recent-meta
        color #8e8e8e
        font-size 0.9rem
        margin-bottom 1rem
      
      .recent-description
        color #476582
        line-height 1.6

// 高亮样式
:deep(mark)
  background #fff3cd
  color #856404
  padding 0.1rem 0.2rem
  border-radius 3px
  font-weight 600

// 响应式设计
@media (max-width: 768px)
  .search-container
    padding 1rem
  
  .search-box-container
    padding 1rem
    
    .search-input-wrapper
      flex-direction column
      
      .search-button
        align-self stretch
  
  .advanced-search
    .filter-row
      flex-direction column
      
      .filter-group
        min-width auto
  
  .result-header
    flex-direction column
    gap 0.5rem
  
  .result-meta
    flex-direction column
    gap 0.5rem
  
  .recent-grid
    grid-template-columns 1fr
</style>