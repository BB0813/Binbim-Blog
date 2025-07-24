<template>
  <div class="stats-container">
    <div class="stats-header">
      <h1>📊 博客统计</h1>
      <p>数据驱动的博客洞察</p>
    </div>

    <!-- 总览统计卡片 -->
    <div class="overview-stats">
      <div class="stat-card">
        <div class="stat-icon">📝</div>
        <div class="stat-content">
          <div class="stat-number">{{ totalPosts }}</div>
          <div class="stat-label">总文章数</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">🏷️</div>
        <div class="stat-content">
          <div class="stat-number">{{ totalTags }}</div>
          <div class="stat-label">标签数量</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">📂</div>
        <div class="stat-content">
          <div class="stat-number">{{ totalCategories }}</div>
          <div class="stat-label">分类数量</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">📖</div>
        <div class="stat-content">
          <div class="stat-number">{{ totalWords }}</div>
          <div class="stat-label">总字数</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">⏱️</div>
        <div class="stat-content">
          <div class="stat-number">{{ totalReadTime }}</div>
          <div class="stat-label">总阅读时间</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">👀</div>
        <div class="stat-content">
          <div class="stat-number">{{ totalViews }}</div>
          <div class="stat-label">总阅读量</div>
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="charts-section">
      <!-- 发布趋势图 -->
      <div class="chart-card">
        <h3>📈 发布趋势</h3>
        <div class="chart-container">
          <div class="trend-chart">
            <div 
              v-for="(month, index) in publishTrend" 
              :key="index"
              class="trend-bar"
              :style="{ height: (month.count / maxMonthlyPosts * 100) + '%' }"
              :title="`${month.month}: ${month.count} 篇文章`"
            >
              <div class="bar-value">{{ month.count }}</div>
            </div>
          </div>
          <div class="trend-labels">
            <span v-for="(month, index) in publishTrend" :key="index" class="trend-label">
              {{ month.month }}
            </span>
          </div>
        </div>
      </div>
      
      <!-- 分类分布饼图 -->
      <div class="chart-card">
        <h3>📊 分类分布</h3>
        <div class="pie-chart">
          <div class="pie-container">
            <svg viewBox="0 0 200 200" class="pie-svg">
              <circle 
                v-for="(segment, index) in pieSegments" 
                :key="index"
                :cx="100" 
                :cy="100" 
                :r="80"
                fill="none"
                :stroke="segment.color"
                :stroke-width="20"
                :stroke-dasharray="`${segment.length} ${314 - segment.length}`"
                :stroke-dashoffset="segment.offset"
                :title="`${segment.category}: ${segment.count} 篇 (${segment.percentage}%)`"
                class="pie-segment"
              />
            </svg>
            <div class="pie-center">
              <div class="pie-total">{{ totalPosts }}</div>
              <div class="pie-label">总文章</div>
            </div>
          </div>
          <div class="pie-legend">
            <div 
              v-for="(category, index) in categoryStats" 
              :key="index"
              class="legend-item"
            >
              <div class="legend-color" :style="{ backgroundColor: pieColors[index % pieColors.length] }"></div>
              <span class="legend-text">{{ category.name }} ({{ category.count }})</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 热门内容 -->
    <div class="popular-content">
      <!-- 热门文章 -->
      <div class="popular-card">
        <h3>🔥 热门文章</h3>
        <div class="popular-list">
          <div 
            v-for="(post, index) in popularPosts" 
            :key="post.path"
            class="popular-item"
          >
            <div class="popular-rank">{{ index + 1 }}</div>
            <div class="popular-content-info">
              <router-link :to="post.path" class="popular-title">
                {{ post.title }}
              </router-link>
              <div class="popular-meta">
                <span class="popular-views">👀 {{ post.views || 0 }} 次阅读</span>
                <span class="popular-date">📅 {{ formatDate(post.frontmatter.date) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 热门标签 -->
      <div class="popular-card">
        <h3>🏷️ 热门标签</h3>
        <div class="tag-stats">
          <div 
            v-for="(tag, index) in popularTags" 
            :key="tag.name"
            class="tag-stat-item"
          >
            <div class="tag-info">
              <span class="tag-name">{{ tag.name }}</span>
              <span class="tag-count">{{ tag.count }} 篇</span>
            </div>
            <div class="tag-bar">
              <div 
                class="tag-progress"
                :style="{ width: (tag.count / maxTagCount * 100) + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 写作统计 -->
    <div class="writing-stats">
      <div class="writing-card">
        <h3>✍️ 写作统计</h3>
        <div class="writing-metrics">
          <div class="metric-item">
            <div class="metric-label">平均文章长度</div>
            <div class="metric-value">{{ averageWordCount }} 字</div>
          </div>
          <div class="metric-item">
            <div class="metric-label">平均阅读时间</div>
            <div class="metric-value">{{ averageReadTime }}</div>
          </div>
          <div class="metric-item">
            <div class="metric-label">最长文章</div>
            <div class="metric-value">{{ longestPost.words }} 字</div>
            <div class="metric-subtitle">{{ longestPost.title }}</div>
          </div>
          <div class="metric-item">
            <div class="metric-label">最新文章</div>
            <div class="metric-value">{{ formatDate(latestPost.date) }}</div>
            <div class="metric-subtitle">{{ latestPost.title }}</div>
          </div>
        </div>
      </div>
      
      <div class="writing-card">
        <h3>📅 发布频率</h3>
        <div class="frequency-stats">
          <div class="frequency-item">
            <div class="frequency-label">本月发布</div>
            <div class="frequency-value">{{ thisMonthPosts }} 篇</div>
          </div>
          <div class="frequency-item">
            <div class="frequency-label">上月发布</div>
            <div class="frequency-value">{{ lastMonthPosts }} 篇</div>
          </div>
          <div class="frequency-item">
            <div class="frequency-label">月均发布</div>
            <div class="frequency-value">{{ averageMonthlyPosts }} 篇</div>
          </div>
          <div class="frequency-item">
            <div class="frequency-label">最活跃月份</div>
            <div class="frequency-value">{{ mostActiveMonth.month }}</div>
            <div class="frequency-subtitle">{{ mostActiveMonth.count }} 篇</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 成长轨迹 -->
    <div class="growth-timeline">
      <h3>🌱 博客成长轨迹</h3>
      <div class="timeline">
        <div 
          v-for="(milestone, index) in milestones" 
          :key="index"
          class="timeline-item"
        >
          <div class="timeline-marker">{{ milestone.icon }}</div>
          <div class="timeline-content">
            <div class="timeline-title">{{ milestone.title }}</div>
            <div class="timeline-date">{{ milestone.date }}</div>
            <div class="timeline-description">{{ milestone.description }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatsPage',
  data() {
    return {
      pieColors: [
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
          frontmatter: page.frontmatter,
          content: page.content || '',
          words: this.countWords(page.content || ''),
          views: this.getPostViews(page.path)
        }))
        .sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date))
    },
    
    totalPosts() {
      return this.posts.length
    },
    
    totalTags() {
      const tags = new Set()
      this.posts.forEach(post => {
        if (post.frontmatter.tags) {
          post.frontmatter.tags.forEach(tag => tags.add(tag))
        }
      })
      return tags.size
    },
    
    totalCategories() {
      const categories = new Set()
      this.posts.forEach(post => {
        if (post.frontmatter.category) {
          categories.add(post.frontmatter.category)
        }
      })
      return categories.size
    },
    
    totalWords() {
      return this.posts.reduce((total, post) => total + post.words, 0).toLocaleString()
    },
    
    totalReadTime() {
      const totalMinutes = this.posts.reduce((total, post) => {
        const readTime = post.frontmatter.readTime || this.calculateReadTime(post.words)
        return total + parseInt(readTime)
      }, 0)
      
      if (totalMinutes < 60) return `${totalMinutes} 分钟`
      const hours = Math.floor(totalMinutes / 60)
      const minutes = totalMinutes % 60
      return `${hours} 小时 ${minutes} 分钟`
    },
    
    totalViews() {
      return this.posts.reduce((total, post) => total + (post.views || 0), 0).toLocaleString()
    },
    
    publishTrend() {
      const monthlyData = new Map()
      const now = new Date()
      
      // 生成最近12个月的数据
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        monthlyData.set(key, { month: key, count: 0 })
      }
      
      // 统计每月发布数量
      this.posts.forEach(post => {
        if (post.frontmatter.date) {
          const date = new Date(post.frontmatter.date)
          const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
          if (monthlyData.has(key)) {
            monthlyData.get(key).count++
          }
        }
      })
      
      return Array.from(monthlyData.values())
    },
    
    maxMonthlyPosts() {
      return Math.max(...this.publishTrend.map(month => month.count), 1)
    },
    
    categoryStats() {
      const categoryMap = new Map()
      this.posts.forEach(post => {
        const category = post.frontmatter.category || '未分类'
        categoryMap.set(category, (categoryMap.get(category) || 0) + 1)
      })
      
      return Array.from(categoryMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
    },
    
    pieSegments() {
      const total = this.totalPosts
      let currentOffset = 0
      
      return this.categoryStats.map((category, index) => {
        const percentage = (category.count / total) * 100
        const length = (category.count / total) * 314 // 2π * 50 (半径)
        const segment = {
          category: category.name,
          count: category.count,
          percentage: percentage.toFixed(1),
          length,
          offset: -currentOffset,
          color: this.pieColors[index % this.pieColors.length]
        }
        currentOffset += length
        return segment
      })
    },
    
    popularPosts() {
      return this.posts
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 5)
    },
    
    popularTags() {
      const tagMap = new Map()
      this.posts.forEach(post => {
        if (post.frontmatter.tags) {
          post.frontmatter.tags.forEach(tag => {
            tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
          })
        }
      })
      
      return Array.from(tagMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8)
    },
    
    maxTagCount() {
      return Math.max(...this.popularTags.map(tag => tag.count), 1)
    },
    
    averageWordCount() {
      if (this.posts.length === 0) return 0
      const total = this.posts.reduce((sum, post) => sum + post.words, 0)
      return Math.round(total / this.posts.length).toLocaleString()
    },
    
    averageReadTime() {
      if (this.posts.length === 0) return '0 分钟'
      const totalMinutes = this.posts.reduce((total, post) => {
        const readTime = post.frontmatter.readTime || this.calculateReadTime(post.words)
        return total + parseInt(readTime)
      }, 0)
      const avg = Math.round(totalMinutes / this.posts.length)
      return `${avg} 分钟`
    },
    
    longestPost() {
      if (this.posts.length === 0) return { words: 0, title: '' }
      const longest = this.posts.reduce((max, post) => 
        post.words > max.words ? post : max
      )
      return { words: longest.words.toLocaleString(), title: longest.title }
    },
    
    latestPost() {
      if (this.posts.length === 0) return { date: '', title: '' }
      return {
        date: this.posts[0].frontmatter.date,
        title: this.posts[0].title
      }
    },
    
    thisMonthPosts() {
      const now = new Date()
      const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
      return this.posts.filter(post => {
        if (!post.frontmatter.date) return false
        const postDate = new Date(post.frontmatter.date)
        const postMonth = `${postDate.getFullYear()}-${String(postDate.getMonth() + 1).padStart(2, '0')}`
        return postMonth === thisMonth
      }).length
    },
    
    lastMonthPosts() {
      const now = new Date()
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const lastMonthKey = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`
      return this.posts.filter(post => {
        if (!post.frontmatter.date) return false
        const postDate = new Date(post.frontmatter.date)
        const postMonth = `${postDate.getFullYear()}-${String(postDate.getMonth() + 1).padStart(2, '0')}`
        return postMonth === lastMonthKey
      }).length
    },
    
    averageMonthlyPosts() {
      if (this.publishTrend.length === 0) return 0
      const total = this.publishTrend.reduce((sum, month) => sum + month.count, 0)
      return Math.round(total / this.publishTrend.length)
    },
    
    mostActiveMonth() {
      if (this.publishTrend.length === 0) return { month: '', count: 0 }
      return this.publishTrend.reduce((max, month) => 
        month.count > max.count ? month : max
      )
    },
    
    milestones() {
      const milestones = []
      
      if (this.posts.length > 0) {
        milestones.push({
          icon: '🎉',
          title: '博客启动',
          date: this.formatDate(this.posts[this.posts.length - 1].frontmatter.date),
          description: '发布了第一篇文章，开始了写作之旅'
        })
      }
      
      if (this.posts.length >= 10) {
        milestones.push({
          icon: '📝',
          title: '文章达到 10 篇',
          date: this.formatDate(this.posts[this.posts.length - 10].frontmatter.date),
          description: '持续创作，积累了丰富的内容'
        })
      }
      
      if (this.totalTags >= 20) {
        milestones.push({
          icon: '🏷️',
          title: '标签体系完善',
          date: '最近',
          description: `建立了 ${this.totalTags} 个标签的分类体系`
        })
      }
      
      if (this.posts.length >= 50) {
        milestones.push({
          icon: '🚀',
          title: '内容里程碑',
          date: '最近',
          description: `已发布 ${this.posts.length} 篇文章，成为活跃博主`
        })
      }
      
      return milestones.reverse()
    }
  },
  
  methods: {
    countWords(content) {
      if (!content) return 0
      // 移除HTML标签和Markdown语法
      const plainText = content
        .replace(/<[^>]*>/g, '')
        .replace(/[#*`\[\]()]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
      
      // 中文字符计数
      const chineseChars = (plainText.match(/[\u4e00-\u9fa5]/g) || []).length
      // 英文单词计数
      const englishWords = plainText.replace(/[\u4e00-\u9fa5]/g, '').split(/\s+/).filter(word => word.length > 0).length
      
      return chineseChars + englishWords
    },
    
    calculateReadTime(words) {
      // 假设中文阅读速度为每分钟300字，英文为每分钟200词
      const minutes = Math.ceil(words / 250)
      return `${minutes} 分钟`
    },
    
    getPostViews(path) {
      // 获取真实阅读量数据
      const views = localStorage.getItem(`post_views_${path}`) || 0
      return parseInt(views)
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
.stats-container
  max-width 1200px
  margin 0 auto
  padding 2rem 1.5rem

.stats-header
  text-align center
  margin-bottom 3rem
  
  h1
    font-size 2.5rem
    color #2c3e50
    margin-bottom 0.5rem
  
  p
    color #6a8bad
    font-size 1.2rem

.overview-stats
  display grid
  grid-template-columns repeat(auto-fit, minmax(200px, 1fr))
  gap 1.5rem
  margin-bottom 3rem
  
  .stat-card
    background #fff
    padding 2rem
    border-radius 12px
    box-shadow 0 4px 12px rgba(0, 0, 0, 0.05)
    display flex
    align-items center
    gap 1rem
    transition all 0.3s ease
    
    &:hover
      transform translateY(-3px)
      box-shadow 0 8px 20px rgba(0, 0, 0, 0.1)
    
    .stat-icon
      font-size 2.5rem
      opacity 0.8
    
    .stat-content
      flex 1
      
      .stat-number
        font-size 2rem
        font-weight 700
        color #3eaf7c
        margin-bottom 0.25rem
      
      .stat-label
        color #6a8bad
        font-size 0.9rem

.charts-section
  display grid
  grid-template-columns 1fr 1fr
  gap 2rem
  margin-bottom 3rem
  
  .chart-card
    background #fff
    padding 2rem
    border-radius 12px
    box-shadow 0 4px 12px rgba(0, 0, 0, 0.05)
    
    h3
      color #2c3e50
      margin-bottom 1.5rem
      text-align center
    
    .chart-container
      .trend-chart
        display flex
        align-items flex-end
        justify-content space-between
        height 200px
        padding 1rem 0
        border-bottom 2px solid #e0e6ed
        
        .trend-bar
          flex 1
          background linear-gradient(to top, #3eaf7c, #2d8f5f)
          margin 0 2px
          border-radius 4px 4px 0 0
          min-height 20px
          position relative
          cursor pointer
          transition all 0.3s ease
          
          &:hover
            background linear-gradient(to top, #45b7d1, #3498db)
          
          .bar-value
            position absolute
            top -25px
            left 50%
            transform translateX(-50%)
            font-size 0.8rem
            color #2c3e50
            font-weight 600
      
      .trend-labels
        display flex
        justify-content space-between
        margin-top 0.5rem
        
        .trend-label
          font-size 0.7rem
          color #6a8bad
          transform rotate(-45deg)
          transform-origin center
    
    .pie-chart
      display flex
      flex-direction column
      align-items center
      
      .pie-container
        position relative
        width 200px
        height 200px
        margin-bottom 1rem
        
        .pie-svg
          width 100%
          height 100%
          transform rotate(-90deg)
          
          .pie-segment
            transition all 0.3s ease
            cursor pointer
            
            &:hover
              stroke-width 25
        
        .pie-center
          position absolute
          top 50%
          left 50%
          transform translate(-50%, -50%)
          text-align center
          
          .pie-total
            font-size 2rem
            font-weight 700
            color #2c3e50
          
          .pie-label
            font-size 0.9rem
            color #6a8bad
      
      .pie-legend
        display flex
        flex-direction column
        gap 0.5rem
        
        .legend-item
          display flex
          align-items center
          gap 0.5rem
          
          .legend-color
            width 12px
            height 12px
            border-radius 50%
          
          .legend-text
            font-size 0.9rem
            color #2c3e50

.popular-content
  display grid
  grid-template-columns 1fr 1fr
  gap 2rem
  margin-bottom 3rem
  
  .popular-card
    background #fff
    padding 2rem
    border-radius 12px
    box-shadow 0 4px 12px rgba(0, 0, 0, 0.05)
    
    h3
      color #2c3e50
      margin-bottom 1.5rem
      text-align center
    
    .popular-list
      display flex
      flex-direction column
      gap 1rem
      
      .popular-item
        display flex
        align-items center
        gap 1rem
        padding 1rem
        background #f8f9fa
        border-radius 8px
        transition all 0.3s ease
        
        &:hover
          background #e9ecef
        
        .popular-rank
          width 30px
          height 30px
          background #3eaf7c
          color #fff
          border-radius 50%
          display flex
          align-items center
          justify-content center
          font-weight 600
          font-size 0.9rem
        
        .popular-content-info
          flex 1
          
          .popular-title
            display block
            color #2c3e50
            text-decoration none
            font-weight 600
            margin-bottom 0.25rem
            
            &:hover
              color #3eaf7c
          
          .popular-meta
            display flex
            gap 1rem
            font-size 0.8rem
            color #6a8bad
    
    .tag-stats
      display flex
      flex-direction column
      gap 1rem
      
      .tag-stat-item
        .tag-info
          display flex
          justify-content space-between
          margin-bottom 0.5rem
          
          .tag-name
            font-weight 600
            color #2c3e50
          
          .tag-count
            color #6a8bad
            font-size 0.9rem
        
        .tag-bar
          background #e0e6ed
          border-radius 10px
          height 8px
          overflow hidden
          
          .tag-progress
            height 100%
            background linear-gradient(90deg, #3eaf7c, #2d8f5f)
            border-radius 10px
            transition width 0.3s ease

.writing-stats
  display grid
  grid-template-columns 1fr 1fr
  gap 2rem
  margin-bottom 3rem
  
  .writing-card
    background #fff
    padding 2rem
    border-radius 12px
    box-shadow 0 4px 12px rgba(0, 0, 0, 0.05)
    
    h3
      color #2c3e50
      margin-bottom 1.5rem
      text-align center
    
    .writing-metrics, .frequency-stats
      display grid
      grid-template-columns 1fr 1fr
      gap 1rem
      
      .metric-item, .frequency-item
        text-align center
        padding 1rem
        background #f8f9fa
        border-radius 8px
        
        .metric-label, .frequency-label
          font-size 0.9rem
          color #6a8bad
          margin-bottom 0.5rem
        
        .metric-value, .frequency-value
          font-size 1.5rem
          font-weight 700
          color #3eaf7c
          margin-bottom 0.25rem
        
        .metric-subtitle, .frequency-subtitle
          font-size 0.8rem
          color #8e8e8e
          overflow hidden
          text-overflow ellipsis
          white-space nowrap

.growth-timeline
  background #fff
  padding 2rem
  border-radius 12px
  box-shadow 0 4px 12px rgba(0, 0, 0, 0.05)
  
  h3
    color #2c3e50
    margin-bottom 2rem
    text-align center
  
  .timeline
    position relative
    
    &::before
      content ''
      position absolute
      left 30px
      top 0
      bottom 0
      width 2px
      background #e0e6ed
    
    .timeline-item
      display flex
      align-items flex-start
      gap 1rem
      margin-bottom 2rem
      position relative
      
      .timeline-marker
        width 60px
        height 60px
        background #fff
        border 3px solid #3eaf7c
        border-radius 50%
        display flex
        align-items center
        justify-content center
        font-size 1.5rem
        z-index 1
      
      .timeline-content
        flex 1
        background #f8f9fa
        padding 1.5rem
        border-radius 8px
        
        .timeline-title
          font-size 1.2rem
          font-weight 600
          color #2c3e50
          margin-bottom 0.5rem
        
        .timeline-date
          color #3eaf7c
          font-weight 600
          margin-bottom 0.5rem
        
        .timeline-description
          color #6a8bad
          line-height 1.6

// 响应式设计
@media (max-width: 768px)
  .stats-container
    padding 1rem
  
  .overview-stats
    grid-template-columns 1fr
  
  .charts-section
    grid-template-columns 1fr
  
  .popular-content
    grid-template-columns 1fr
  
  .writing-stats
    grid-template-columns 1fr
  
  .writing-metrics, .frequency-stats
    grid-template-columns 1fr
  
  .timeline-item
    .timeline-marker
      width 40px
      height 40px
      font-size 1rem
</style>