<template>
  <div class="posts-container">
    <!-- 搜索和筛选区域 -->
    <div class="search-filter-section">
      <div class="search-box">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="搜索文章标题或内容..."
          class="search-input"
        />
        <span class="search-icon">🔍</span>
      </div>
      
      <div class="filter-controls">
        <div class="tag-filter">
          <span class="filter-label">标签筛选:</span>
          <div class="tag-list">
            <button 
              v-for="tag in allTags" 
              :key="tag"
              :class="['tag-button', { active: selectedTags.includes(tag) }]"
              @click="toggleTag(tag)"
            >
              {{ tag }}
            </button>
          </div>
        </div>
        
        <div class="sort-controls">
          <span class="filter-label">排序:</span>
          <select v-model="sortBy" class="sort-select">
            <option value="date-desc">最新发布</option>
            <option value="date-asc">最早发布</option>
            <option value="title">标题排序</option>
            <option value="readTime">阅读时间</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 文章统计 -->
    <div class="posts-stats">
      <span class="stats-text">共找到 {{ filteredPosts.length }} 篇文章</span>
      <button v-if="selectedTags.length > 0" @click="clearFilters" class="clear-filters">
        清除筛选 ✕
      </button>
    </div>
    
    <!-- 文章列表 -->
    <div class="posts-grid">
      <article 
        v-for="(post, index) in filteredPosts" 
        :key="index" 
        class="post-card"
      >
        <div class="post-header">
          <router-link :to="post.path" class="post-title">
            {{ post.title }}
          </router-link>
          <div class="post-meta">
            <span v-if="post.frontmatter.date" class="post-date">
              📅 {{ formatDate(post.frontmatter.date) }}
            </span>
            <span v-if="post.frontmatter.readTime" class="read-time">
              ⏱️ {{ post.frontmatter.readTime }} 分钟阅读
            </span>
            <span v-if="post.frontmatter.category" class="post-category">
              📂 {{ post.frontmatter.category }}
            </span>
          </div>
        </div>
        
        <p v-if="post.frontmatter.description" class="post-description">
          {{ post.frontmatter.description }}
        </p>
        
        <div class="post-tags" v-if="post.frontmatter.tags && post.frontmatter.tags.length">
          <span 
            v-for="(tag, tagIndex) in post.frontmatter.tags" 
            :key="tagIndex" 
            class="post-tag"
            @click="selectTag(tag)"
          >
            🏷️ {{ tag }}
          </span>
        </div>
        
        <div class="post-footer">
          <router-link :to="post.path" class="read-more">
            阅读全文 →
          </router-link>
          <div class="post-stats">
            <span class="view-count">👁️ {{ getViewCount(post.path) }}</span>
          </div>
        </div>
      </article>
    </div>
    
    <!-- 无结果提示 -->
    <div v-if="filteredPosts.length === 0" class="no-results">
      <div class="no-results-icon">📝</div>
      <h3>没有找到相关文章</h3>
      <p>尝试调整搜索关键词或筛选条件</p>
      <button @click="clearFilters" class="reset-button">重置筛选</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PostsList',
  data() {
    return {
      searchQuery: '',
      selectedTags: [],
      sortBy: 'date-desc'
    }
  },
  computed: {
    posts() {
      return this.$site.pages
        .filter(page => page.path.startsWith('/posts/') && page.path !== '/posts/' && !page.path.endsWith('README.md'))
        .map(page => ({
          title: page.title || page.path.split('/').pop().replace('.html', ''),
          path: page.path,
          frontmatter: page.frontmatter
        }))
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
    
    filteredPosts() {
      let filtered = this.posts
      
      // 搜索过滤
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(post => 
          post.title.toLowerCase().includes(query) ||
          (post.frontmatter.description && post.frontmatter.description.toLowerCase().includes(query)) ||
          (post.frontmatter.tags && post.frontmatter.tags.some(tag => tag.toLowerCase().includes(query)))
        )
      }
      
      // 标签过滤
      if (this.selectedTags.length > 0) {
        filtered = filtered.filter(post => 
          post.frontmatter.tags && 
          this.selectedTags.every(tag => post.frontmatter.tags.includes(tag))
        )
      }
      
      // 排序
      return this.sortPosts(filtered)
    }
  },
  
  methods: {
    formatDate(date) {
      if (!date) return ''
      const d = new Date(date)
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    },
    
    toggleTag(tag) {
      const index = this.selectedTags.indexOf(tag)
      if (index > -1) {
        this.selectedTags.splice(index, 1)
      } else {
        this.selectedTags.push(tag)
      }
    },
    
    selectTag(tag) {
      if (!this.selectedTags.includes(tag)) {
        this.selectedTags.push(tag)
      }
    },
    
    clearFilters() {
      this.searchQuery = ''
      this.selectedTags = []
      this.sortBy = 'date-desc'
    },
    
    sortPosts(posts) {
      const sorted = [...posts]
      
      switch (this.sortBy) {
        case 'date-desc':
          return sorted.sort((a, b) => {
            const dateA = a.frontmatter.date ? new Date(a.frontmatter.date) : new Date(0)
            const dateB = b.frontmatter.date ? new Date(b.frontmatter.date) : new Date(0)
            return dateB - dateA
          })
        case 'date-asc':
          return sorted.sort((a, b) => {
            const dateA = a.frontmatter.date ? new Date(a.frontmatter.date) : new Date(0)
            const dateB = b.frontmatter.date ? new Date(b.frontmatter.date) : new Date(0)
            return dateA - dateB
          })
        case 'title':
          return sorted.sort((a, b) => a.title.localeCompare(b.title))
        case 'readTime':
          return sorted.sort((a, b) => {
            const timeA = a.frontmatter.readTime || 0
            const timeB = b.frontmatter.readTime || 0
            return timeA - timeB
          })
        default:
          return sorted
      }
    },
    
    getViewCount(path) {
      // 从localStorage获取阅读量
      const stats = JSON.parse(localStorage.getItem('blog-stats') || '{}')
      return stats[path] || 0
    }
  }
}
</script>

<style lang="stylus" scoped>
.posts-container
  max-width 1000px
  margin 0 auto
  padding 2rem 1.5rem

.search-filter-section
  background #fff
  border-radius 12px
  padding 1.5rem
  margin-bottom 2rem
  box-shadow 0 4px 12px rgba(0, 0, 0, 0.05)
  
  .search-box
    position relative
    margin-bottom 1.5rem
    
    .search-input
      width 100%
      padding 0.8rem 3rem 0.8rem 1rem
      border 2px solid #e1e8ed
      border-radius 25px
      font-size 1rem
      transition all 0.3s ease
      
      &:focus
        outline none
        border-color #3eaf7c
        box-shadow 0 0 0 3px rgba(62, 175, 124, 0.1)
    
    .search-icon
      position absolute
      right 1rem
      top 50%
      transform translateY(-50%)
      font-size 1.2rem
      color #8e8e8e

.filter-controls
  display flex
  flex-wrap wrap
  gap 1.5rem
  align-items flex-start
  
  .filter-label
    font-weight 600
    color #2c3e50
    margin-bottom 0.5rem
    display block
  
  .tag-filter
    flex 1
    min-width 300px
    
    .tag-list
      display flex
      flex-wrap wrap
      gap 0.5rem
      
      .tag-button
        padding 0.4rem 0.8rem
        border none
        border-radius 15px
        background #f3f5f7
        color #476582
        cursor pointer
        transition all 0.2s ease
        font-size 0.9rem
        
        &:hover
          background #e1e8ed
          transform translateY(-1px)
        
        &.active
          background #3eaf7c
          color #fff
  
  .sort-controls
    .sort-select
      padding 0.5rem 1rem
      border 2px solid #e1e8ed
      border-radius 8px
      background #fff
      cursor pointer
      
      &:focus
        outline none
        border-color #3eaf7c

.posts-stats
  display flex
  justify-content space-between
  align-items center
  margin-bottom 1.5rem
  
  .stats-text
    color #6a8bad
    font-size 0.9rem
  
  .clear-filters
    padding 0.4rem 0.8rem
    background #ff6b6b
    color #fff
    border none
    border-radius 15px
    cursor pointer
    font-size 0.8rem
    transition all 0.2s ease
    
    &:hover
      background darken(#ff6b6b, 10%)

.posts-grid
  display grid
  gap 1.5rem
  
  .post-card
    background #fff
    border-radius 12px
    padding 1.5rem
    box-shadow 0 4px 12px rgba(0, 0, 0, 0.05)
    transition all 0.3s ease
    border 1px solid #f0f0f0
    
    &:hover
      transform translateY(-3px)
      box-shadow 0 8px 20px rgba(0, 0, 0, 0.1)
    
    .post-header
      margin-bottom 1rem
      
      .post-title
        display block
        font-size 1.4rem
        font-weight 600
        color #2c3e50
        text-decoration none
        margin-bottom 0.5rem
        line-height 1.3
        
        &:hover
          color #3eaf7c
      
      .post-meta
        display flex
        flex-wrap wrap
        gap 1rem
        font-size 0.85rem
        color #8e8e8e
        
        .post-date, .read-time, .post-category
          display flex
          align-items center
          gap 0.3rem
    
    .post-description
      color #476582
      line-height 1.6
      margin-bottom 1rem
      font-size 0.95rem
    
    .post-tags
      display flex
      flex-wrap wrap
      gap 0.5rem
      margin-bottom 1rem
      
      .post-tag
        padding 0.3rem 0.6rem
        background linear-gradient(135deg, #f3f5f7, #e1e8ed)
        color #476582
        border-radius 12px
        font-size 0.8rem
        cursor pointer
        transition all 0.2s ease
        
        &:hover
          background linear-gradient(135deg, #3eaf7c, #2d8f5f)
          color #fff
          transform scale(1.05)
    
    .post-footer
      display flex
      justify-content space-between
      align-items center
      
      .read-more
        color #3eaf7c
        font-weight 500
        text-decoration none
        transition all 0.2s ease
        
        &:hover
          transform translateX(5px)
      
      .post-stats
        .view-count
          font-size 0.8rem
          color #8e8e8e

.no-results
  text-align center
  padding 3rem 1rem
  
  .no-results-icon
    font-size 4rem
    margin-bottom 1rem
  
  h3
    color #2c3e50
    margin-bottom 0.5rem
  
  p
    color #6a8bad
    margin-bottom 1.5rem
  
  .reset-button
    padding 0.8rem 1.5rem
    background #3eaf7c
    color #fff
    border none
    border-radius 25px
    cursor pointer
    font-weight 500
    transition all 0.2s ease
    
    &:hover
      background darken(#3eaf7c, 10%)
      transform translateY(-2px)

// 响应式设计
@media (max-width: 768px)
  .posts-container
    padding 1rem
  
  .filter-controls
    flex-direction column
    gap 1rem
    
    .tag-filter
      min-width auto
  
  .posts-stats
    flex-direction column
    gap 0.5rem
    align-items flex-start
  
  .post-card
    .post-footer
      flex-direction column
      gap 0.5rem
      align-items flex-start
</style>