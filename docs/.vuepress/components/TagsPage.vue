<template>
  <div class="tags-container">
    <!-- 返回按钮 -->
    <div class="back-navigation">
      <router-link to="/posts/" class="back-button">
        <span class="back-icon">←</span>
        <span class="back-text">返回文章列表</span>
      </router-link>
    </div>
    
    <div class="tags-header">
      <h1>📚 标签分类</h1>
      <p>通过标签快速找到感兴趣的文章内容</p>
    </div>

    <!-- 标签统计 -->
    <div class="tags-stats">
      <div class="stat-item">
        <span class="stat-number">{{ allTags.length }}</span>
        <span class="stat-label">个标签</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">{{ totalPosts }}</span>
        <span class="stat-label">篇文章</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">{{ categories.length }}</span>
        <span class="stat-label">个分类</span>
      </div>
    </div>

    <!-- 分类导航 -->
    <div class="categories-section">
      <h2>📂 文章分类</h2>
      <div class="categories-grid">
        <div 
          v-for="category in categories" 
          :key="category.name"
          class="category-card"
          @click="selectCategory(category.name)"
        >
          <div class="category-icon">📁</div>
          <h3>{{ category.name }}</h3>
          <span class="category-count">{{ category.count }} 篇文章</span>
        </div>
      </div>
    </div>

    <!-- 标签云 -->
    <div class="tag-cloud-section">
      <h2>🏷️ 标签云</h2>
      <div class="tag-cloud">
        <span 
          v-for="tag in tagCloud" 
          :key="tag.name"
          :class="['tag-item', `size-${tag.size}`]"
          :style="{ color: tag.color }"
          @click="selectTag(tag.name)"
          :title="`${tag.name} (${tag.count} 篇文章)`"
        >
          {{ tag.name }}
        </span>
      </div>
    </div>

    <!-- 热门标签 -->
    <div class="popular-tags-section">
      <h2>🔥 热门标签</h2>
      <div class="popular-tags">
        <div 
          v-for="tag in popularTags" 
          :key="tag.name"
          class="popular-tag-card"
          @click="selectTag(tag.name)"
        >
          <div class="tag-info">
            <span class="tag-name">{{ tag.name }}</span>
            <span class="tag-count">{{ tag.count }} 篇文章</span>
          </div>
          <div class="tag-progress">
            <div 
              class="progress-bar" 
              :style="{ width: (tag.count / maxTagCount * 100) + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 筛选结果 -->
    <div v-if="selectedTag || selectedCategory" class="filtered-results">
      <div class="filter-header">
        <h2>
          {{ selectedTag ? `标签: ${selectedTag}` : `分类: ${selectedCategory}` }}
          <span class="result-count">({{ filteredPosts.length }} 篇文章)</span>
        </h2>
        <button @click="clearSelection" class="clear-button">清除筛选 ✕</button>
      </div>
      
      <div class="posts-grid">
        <article 
          v-for="post in filteredPosts" 
          :key="post.path"
          class="post-card"
        >
          <router-link :to="post.path" class="post-title">
            {{ post.title }}
          </router-link>
          <div class="post-meta">
            <span class="post-date">📅 {{ formatDate(post.frontmatter.date) }}</span>
            <span v-if="post.frontmatter.category" class="post-category">
              📂 {{ post.frontmatter.category }}
            </span>
          </div>
          <p v-if="post.frontmatter.description" class="post-description">
            {{ post.frontmatter.description }}
          </p>
          <div class="post-tags">
            <span 
              v-for="tag in post.frontmatter.tags" 
              :key="tag"
              class="post-tag"
              @click="selectTag(tag)"
            >
              🏷️ {{ tag }}
            </span>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TagsPage',
  data() {
    return {
      selectedTag: null,
      selectedCategory: null,
      tagColors: [
        '#3eaf7c', '#ff6b6b', '#4ecdc4', '#45b7d1', 
        '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7',
        '#a29bfe', '#fd79a8', '#00b894', '#00cec9'
      ]
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
    
    totalPosts() {
      return this.posts.length
    },
    
    allTags() {
      const tagMap = new Map()
      this.posts.forEach(post => {
        if (post.frontmatter.tags) {
          post.frontmatter.tags.forEach(tag => {
            tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
          })
        }
      })
      return Array.from(tagMap.entries()).map(([name, count]) => ({ name, count }))
    },
    
    categories() {
      const categoryMap = new Map()
      this.posts.forEach(post => {
        const category = post.frontmatter.category || '未分类'
        categoryMap.set(category, (categoryMap.get(category) || 0) + 1)
      })
      return Array.from(categoryMap.entries()).map(([name, count]) => ({ name, count }))
    },
    
    tagCloud() {
      return this.allTags.map((tag, index) => {
        const maxCount = Math.max(...this.allTags.map(t => t.count))
        const minCount = Math.min(...this.allTags.map(t => t.count))
        const ratio = (tag.count - minCount) / (maxCount - minCount) || 0
        
        let size = 'small'
        if (ratio > 0.7) size = 'large'
        else if (ratio > 0.4) size = 'medium'
        
        return {
          ...tag,
          size,
          color: this.tagColors[index % this.tagColors.length]
        }
      }).sort(() => Math.random() - 0.5) // 随机排序
    },
    
    popularTags() {
      return this.allTags
        .sort((a, b) => b.count - a.count)
        .slice(0, 8)
    },
    
    maxTagCount() {
      return Math.max(...this.allTags.map(t => t.count))
    },
    
    filteredPosts() {
      if (this.selectedTag) {
        return this.posts.filter(post => 
          post.frontmatter.tags && post.frontmatter.tags.includes(this.selectedTag)
        )
      }
      if (this.selectedCategory) {
        return this.posts.filter(post => 
          (post.frontmatter.category || '未分类') === this.selectedCategory
        )
      }
      return []
    }
  },
  
  methods: {
    selectTag(tag) {
      this.selectedTag = tag
      this.selectedCategory = null
      this.$nextTick(() => {
        const element = document.querySelector('.filtered-results')
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      })
    },
    
    selectCategory(category) {
      this.selectedCategory = category
      this.selectedTag = null
      this.$nextTick(() => {
        const element = document.querySelector('.filtered-results')
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      })
    },
    
    clearSelection() {
      this.selectedTag = null
      this.selectedCategory = null
    },
    
    formatDate(date) {
      if (!date) return ''
      const d = new Date(date)
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    }
  }
}
</script>

<style lang="stylus" scoped>
.tags-container
  max-width 1000px
  margin 0 auto
  padding 2rem 1.5rem
  
.back-navigation
  margin-bottom 2rem
  
  .back-button
    display inline-flex
    align-items center
    gap 0.5rem
    padding 0.8rem 1.5rem
    background linear-gradient(135deg, #667eea, #764ba2)
    color white
    text-decoration none
    border-radius 25px
    font-weight 600
    transition all 0.3s ease
    box-shadow 0 4px 12px rgba(102, 126, 234, 0.3)
    
    &:hover
      background linear-gradient(135deg, #5a6fd8, #6a4190)
      transform translateY(-2px)
      box-shadow 0 8px 20px rgba(102, 126, 234, 0.4)
      color white
    
    .back-icon
      font-size 1.2rem
      transition transform 0.3s ease
    
    .back-text
      font-size 0.95rem
    
    &:hover .back-icon
      transform translateX(-3px)

.tags-header
  text-align center
  margin-bottom 3rem
  
  h1
    font-size 2.8rem
    background linear-gradient(135deg, #2c3e50, #667eea)
    -webkit-background-clip text
    -webkit-text-fill-color transparent
    background-clip text
    margin-bottom 0.5rem
    font-weight 800
  
  p
    color #6a8bad
    font-size 1.2rem

.tags-stats
  display flex
  justify-content center
  gap 2rem
  margin-bottom 3rem
  
  .stat-item
    text-align center
    padding 2rem
    background linear-gradient(145deg, #ffffff, #f8f9fa)
    border-radius 16px
    box-shadow 0 8px 24px rgba(0, 0, 0, 0.08)
    min-width 140px
    border 1px solid rgba(102, 126, 234, 0.1)
    transition all 0.3s ease
    position relative
    overflow hidden
    
    &::before
      content ''
      position absolute
      top 0
      left 0
      right 0
      height 3px
      background linear-gradient(135deg, #667eea, #764ba2)
      transform scaleX(0)
      transition transform 0.3s ease
    
    &:hover
      transform translateY(-5px)
      box-shadow 0 16px 40px rgba(102, 126, 234, 0.15)
      
      &::before
        transform scaleX(1)
    
    .stat-number
      display block
      font-size 2.2rem
      font-weight 800
      background linear-gradient(135deg, #667eea, #764ba2)
      -webkit-background-clip text
      -webkit-text-fill-color transparent
      background-clip text
      margin-bottom 0.5rem
    
    .stat-label
      color #6a8bad
      font-size 0.9rem

.categories-section
  margin-bottom 3rem
  
  h2
    font-size 1.8rem
    color #2c3e50
    margin-bottom 1.5rem
    text-align center
  
  .categories-grid
    display grid
    grid-template-columns repeat(auto-fit, minmax(200px, 1fr))
    gap 1rem
    
    .category-card
      background linear-gradient(145deg, #ffffff, #f8f9fa)
      padding 2rem
      border-radius 16px
      box-shadow 0 8px 24px rgba(0, 0, 0, 0.08)
      text-align center
      cursor pointer
      transition all 0.4s cubic-bezier(0.4, 0, 0.2, 1)
      border 1px solid rgba(102, 126, 234, 0.1)
      position relative
      overflow hidden
      
      &::before
        content ''
        position absolute
        top 0
        left 0
        right 0
        height 4px
        background linear-gradient(135deg, #667eea, #764ba2)
        transform scaleX(0)
        transition transform 0.3s ease
      
      &:hover
        transform translateY(-8px) scale(1.03)
        box-shadow 0 20px 48px rgba(102, 126, 234, 0.15)
        border-color rgba(102, 126, 234, 0.2)
        
        &::before
          transform scaleX(1)
      
      .category-icon
        font-size 2rem
        margin-bottom 0.5rem
      
      h3
        color #2c3e50
        margin-bottom 0.5rem
        font-size 1.2rem
      
      .category-count
        color #6a8bad
        font-size 0.9rem

.tag-cloud-section
  margin-bottom 3rem
  
  h2
    font-size 1.8rem
    color #2c3e50
    margin-bottom 1.5rem
    text-align center
  
  .tag-cloud
    background linear-gradient(145deg, #ffffff, #f8f9fa)
    padding 2.5rem
    border-radius 20px
    box-shadow 0 12px 32px rgba(0, 0, 0, 0.08)
    text-align center
    line-height 2.5
    border 1px solid rgba(102, 126, 234, 0.1)
    position relative
    overflow hidden
    
    &::before
      content ''
      position absolute
      top 0
      left 0
      right 0
      height 4px
      background linear-gradient(135deg, #667eea, #764ba2)
    
    .tag-item
      display inline-block
      margin 0.4rem
      padding 0.6rem 1.2rem
      background linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))
      border-radius 25px
      cursor pointer
      transition all 0.4s cubic-bezier(0.4, 0, 0.2, 1)
      font-weight 600
      border 2px solid currentColor
      box-shadow 0 4px 12px rgba(0, 0, 0, 0.05)
      
      &:hover
        transform scale(1.15) translateY(-2px)
        background linear-gradient(135deg, currentColor, currentColor)
        color #fff !important
        box-shadow 0 8px 20px rgba(0, 0, 0, 0.15)
      
      &.size-small
        font-size 0.9rem
      
      &.size-medium
        font-size 1.1rem
      
      &.size-large
        font-size 1.3rem
        font-weight 600

.popular-tags-section
  margin-bottom 3rem
  
  h2
    font-size 1.8rem
    color #2c3e50
    margin-bottom 1.5rem
    text-align center
  
  .popular-tags
    display grid
    grid-template-columns repeat(auto-fit, minmax(250px, 1fr))
    gap 1rem
    
    .popular-tag-card
      background linear-gradient(145deg, #ffffff, #f8f9fa)
      padding 1.5rem
      border-radius 16px
      box-shadow 0 8px 24px rgba(0, 0, 0, 0.08)
      cursor pointer
      transition all 0.4s cubic-bezier(0.4, 0, 0.2, 1)
      border 1px solid rgba(102, 126, 234, 0.1)
      position relative
      overflow hidden
      
      &::before
        content ''
        position absolute
        top 0
        left 0
        right 0
        height 3px
        background linear-gradient(135deg, #667eea, #764ba2)
        transform scaleX(0)
        transition transform 0.3s ease
      
      &:hover
        transform translateY(-6px) scale(1.02)
        box-shadow 0 16px 40px rgba(102, 126, 234, 0.15)
        border-color rgba(102, 126, 234, 0.2)
        
        &::before
          transform scaleX(1)
      
      .tag-info
        display flex
        justify-content space-between
        align-items center
        margin-bottom 0.5rem
        
        .tag-name
          font-weight 600
          color #2c3e50
        
        .tag-count
          color #6a8bad
          font-size 0.9rem
      
      .tag-progress
        background #f0f0f0
        border-radius 10px
        height 6px
        overflow hidden
        
        .progress-bar
          height 100%
          background linear-gradient(135deg, #667eea, #764ba2)
          border-radius 10px
          transition width 0.5s cubic-bezier(0.4, 0, 0.2, 1)
          box-shadow 0 2px 8px rgba(102, 126, 234, 0.3)

.filtered-results
  margin-top 3rem
  
  .filter-header
    display flex
    justify-content space-between
    align-items center
    margin-bottom 1.5rem
    
    h2
      color #2c3e50
      
      .result-count
        color #6a8bad
        font-weight normal
        font-size 1rem
    
    .clear-button
      padding 0.8rem 1.5rem
      background linear-gradient(135deg, #ff6b6b, #ee5a52)
      color #fff
      border none
      border-radius 25px
      cursor pointer
      transition all 0.3s ease
      font-weight 600
      box-shadow 0 4px 12px rgba(255, 107, 107, 0.3)
      
      &:hover
        background linear-gradient(135deg, #ee5a52, #dc4c64)
        transform translateY(-2px)
        box-shadow 0 8px 20px rgba(255, 107, 107, 0.4)
  
  .posts-grid
    display grid
    gap 1.5rem
    
    .post-card
      background linear-gradient(145deg, #ffffff, #f8f9fa)
      padding 2rem
      border-radius 16px
      box-shadow 0 8px 24px rgba(0, 0, 0, 0.08)
      transition all 0.4s cubic-bezier(0.4, 0, 0.2, 1)
      border 1px solid rgba(102, 126, 234, 0.1)
      position relative
      overflow hidden
      
      &::before
        content ''
        position absolute
        top 0
        left 0
        right 0
        height 3px
        background linear-gradient(135deg, #667eea, #764ba2)
        transform scaleX(0)
        transition transform 0.3s ease
      
      &:hover
        transform translateY(-6px) scale(1.02)
        box-shadow 0 16px 40px rgba(102, 126, 234, 0.15)
        border-color rgba(102, 126, 234, 0.2)
        
        &::before
          transform scaleX(1)
      
      .post-title
        display block
        font-size 1.4rem
        font-weight 700
        color #2c3e50
        text-decoration none
        margin-bottom 0.8rem
        transition all 0.3s ease
        
        &:hover
          background linear-gradient(135deg, #667eea, #764ba2)
          -webkit-background-clip text
          -webkit-text-fill-color transparent
          background-clip text
      
      .post-meta
        display flex
        gap 1rem
        margin-bottom 1rem
        font-size 0.9rem
        color #8e8e8e
      
      .post-description
        color #476582
        line-height 1.6
        margin-bottom 1rem
      
      .post-tags
        display flex
        flex-wrap wrap
        gap 0.5rem
        
        .post-tag
          padding 0.4rem 0.8rem
          background linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))
          color #476582
          border-radius 15px
          font-size 0.8rem
          cursor pointer
          transition all 0.3s ease
          border 1px solid rgba(102, 126, 234, 0.2)
          font-weight 500
          
          &:hover
            background linear-gradient(135deg, #667eea, #764ba2)
            color #fff
            transform translateY(-1px)
            box-shadow 0 4px 12px rgba(102, 126, 234, 0.3)

// 响应式设计
@media (max-width: 768px)
  .tags-container
    padding 1rem
  
  .tags-stats
    flex-direction column
    gap 1rem
    
    .stat-item
      min-width auto
  
  .categories-grid
    grid-template-columns 1fr
  
  .popular-tags
    grid-template-columns 1fr
  
  .filter-header
    flex-direction column
    gap 1rem
    align-items flex-start
</style>