<template>
  <div class="home-layout">
    <!-- 英雄区域 -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">欢迎来到 Binbim 的博客</h1>
        <p class="hero-subtitle">分享技术、记录生活、探索世界</p>
        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-number">{{ totalPosts }}</span>
            <span class="stat-label">篇文章</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ totalTags }}</span>
            <span class="stat-label">个标签</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ totalViews }}</span>
            <span class="stat-label">次阅读</span>
          </div>
        </div>
        <div class="hero-actions">
          <router-link to="/posts/" class="btn btn-primary">📚 开始阅读</router-link>
          <router-link to="/search/" class="btn btn-secondary">🔍 搜索文章</router-link>
          <router-link to="/tags/" class="btn btn-secondary">🏷️ 浏览标签</router-link>
        </div>
      </div>
      <div class="hero-image">
        <div class="hero-visual">
          <div class="floating-card">
            <div class="card-icon">📝</div>
            <div class="card-text">持续创作</div>
          </div>
          <div class="floating-card">
            <div class="card-icon">💡</div>
            <div class="card-text">分享知识</div>
          </div>
          <div class="floating-card">
            <div class="card-icon">🚀</div>
            <div class="card-text">技术探索</div>
          </div>
        </div>
      </div>
    </section>
    <!-- 快速导航 -->
    <section class="quick-nav">
      <div class="container">
        <h2 class="section-title">快速导航</h2>
        <div class="nav-grid">
          <router-link to="/posts/" class="nav-card">
            <div class="nav-icon">📚</div>
            <h3>文章列表</h3>
            <p>浏览所有文章，发现精彩内容</p>
            <div class="nav-badge">{{ totalPosts }} 篇</div>
          </router-link>
          <router-link to="/tags/" class="nav-card">
            <div class="nav-icon">🏷️</div>
            <h3>标签分类</h3>
            <p>按标签和分类查找相关文章</p>
            <div class="nav-badge">{{ totalTags }} 个</div>
          </router-link>
          <router-link to="/search/" class="nav-card">
            <div class="nav-icon">🔍</div>
            <h3>搜索功能</h3>
            <p>快速搜索您感兴趣的内容</p>
            <div class="nav-badge">智能搜索</div>
          </router-link>
          <router-link to="/stats/" class="nav-card">
            <div class="nav-icon">📊</div>
            <h3>数据统计</h3>
            <p>查看博客数据和写作统计</p>
            <div class="nav-badge">实时数据</div>
          </router-link>
        </div>
      </div>
    </section>

    <!-- 特色介绍 -->
    <section class="features">
      <div class="container">
        <h2 class="section-title">博客特色</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">📝</div>
            <h3>技术分享</h3>
            <p>分享前端开发、编程技巧和最新技术趋势</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">💡</div>
            <h3>思考记录</h3>
            <p>记录学习过程中的思考和感悟</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🌟</div>
            <h3>生活感悟</h3>
            <p>分享生活中的点点滴滴和人生感悟</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔍</div>
            <h3>智能搜索</h3>
            <p>强大的搜索功能，快速找到所需内容</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3>数据统计</h3>
            <p>详细的阅读统计和博客数据分析</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📱</div>
            <h3>响应式设计</h3>
            <p>完美适配各种设备，随时随地阅读</p>
          </div>
        </div>
      </div>
    </section>
    
    <section class="latest-posts">
      <div class="container">
        <h2 class="section-title">最新文章</h2>
        <div class="posts-grid" v-if="recentPosts.length > 0">
          <article 
            v-for="post in recentPosts" 
            :key="post.path"
            class="post-card"
          >
            <div class="post-meta">
              <time class="post-date">{{ formatDate(post.frontmatter.date) }}</time>
              <div class="post-tags" v-if="post.frontmatter.tags">
                <span 
                  v-for="tag in post.frontmatter.tags.slice(0, 2)" 
                  :key="tag"
                  class="post-tag"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
            <h3 class="post-title">
              <router-link :to="post.path">{{ post.title }}</router-link>
            </h3>
            <p class="post-excerpt" v-if="post.frontmatter.description">
              {{ post.frontmatter.description }}
            </p>
            <div class="post-footer">
              <span class="read-time">{{ calculateReadTime(post.content) }}</span>
              <router-link :to="post.path" class="read-more">阅读全文 →</router-link>
            </div>
          </article>
        </div>
        <div class="no-posts" v-else>
          <div class="no-posts-icon">📝</div>
          <p>暂无文章，开始你的写作之旅吧！</p>
        </div>
        <div class="view-all" v-if="recentPosts.length > 0">
          <router-link to="/posts/" class="view-all-btn">查看全部文章</router-link>
        </div>
      </div>
    </section>
    
    <div class="footer">
      <p>© {{ new Date().getFullYear() }} Binbim Blog. 基于 <a href="https://vuepress.vuejs.org/" target="_blank">VuePress</a> 构建</p>
      <div class="social-links">
        <a href="mailto:binbim_promax@163.com" title="邮箱">📧</a>
        <a href="https://qm.qq.com/q/x8P9eycxUI" target="_blank" title="QQ交流群">💬</a>
        <a href="https://github.com/BB0813" target="_blank" title="GitHub">🐙</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeLayout',
  computed: {
    posts() {
      return this.$site.pages
        .filter(page => page.path.startsWith('/posts/') && page.path !== '/posts/' && !page.path.endsWith('README.md'))
    },
    
    totalPosts() {
      return this.posts.length
    },
    
    totalTags() {
      const tags = new Set()
      this.posts.forEach(page => {
        if (page.frontmatter.tags) {
          page.frontmatter.tags.forEach(tag => tags.add(tag))
        }
      })
      return tags.size
    },
    
    totalViews() {
      // 获取真实阅读量数据
      return this.posts.reduce((total, post) => {
        const views = localStorage.getItem(`post_views_${post.path}`) || 0
        return total + parseInt(views)
      }, 0).toLocaleString()
    },
    
    recentPosts() {
      return this.posts
        .sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date))
        .slice(0, 6)
    }
  },
  
  methods: {
    formatDate(date) {
      if (!date) return ''
      const d = new Date(date)
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    },
    
    calculateReadTime(content) {
      if (!content) return '1 分钟'
      const words = content.replace(/<[^>]*>/g, '').length
      const minutes = Math.ceil(words / 300)
      return `${minutes} 分钟`
    }
  }
}
</script>

<style lang="stylus" scoped>
.home-layout {
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.hero {
  display: flex;
  align-items: center;
  min-height: 90vh;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="%23ffffff" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    opacity: 0.3;
  }
  
  .hero-content {
    flex: 1;
    max-width: 600px;
    z-index: 1;
    
    .hero-title {
      font-size: 3.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
      line-height: 1.2;
      background: linear-gradient(45deg, #fff, #f0f8ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .hero-subtitle {
      font-size: 1.5rem;
      margin-bottom: 2rem;
      opacity: 0.9;
      line-height: 1.6;
    }
    
    .hero-stats {
      display: flex;
      gap: 2rem;
      margin-bottom: 2rem;
      
      .stat-item {
        text-align: center;
        
        .stat-number {
          display: block;
          font-size: 2rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 0.25rem;
        }
        
        .stat-label {
          font-size: 0.9rem;
          opacity: 0.8;
        }
      }
    }
    
    .hero-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      
      .btn {
        padding: 1rem 2rem;
        border-radius: 50px;
        text-decoration: none;
        font-weight: 600;
        transition: all 0.3s ease;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        
        &.btn-primary {
          background: white;
          color: #667eea;
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
          }
        }
        
        &.btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(10px);
          
          &:hover {
            background: rgba(255, 255, 255, 0.2);
            border-color: rgba(255, 255, 255, 0.5);
          }
        }
      }
    }
  }
  
  .hero-image {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
    
    .hero-visual {
      position: relative;
      width: 400px;
      height: 400px;
      
      .floating-card {
        position: absolute;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 20px;
        padding: 1.5rem;
        text-align: center;
        animation: float 6s ease-in-out infinite;
        
        .card-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }
        
        .card-text {
          font-size: 0.9rem;
          font-weight: 600;
        }
        
        &:nth-child(1) {
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }
        
        &:nth-child(2) {
          top: 50%;
          right: 10%;
          animation-delay: 2s;
        }
        
        &:nth-child(3) {
          bottom: 20%;
          left: 30%;
          animation-delay: 4s;
        }
      }
    }
  }
}

.quick-nav {
  padding: 4rem 0;
  background: #fff;
  
  .section-title {
    text-align: center;
    font-size: 2.5rem;
    color: #2c3e50;
    margin-bottom: 3rem;
  }
  
  .nav-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    
    .nav-card {
      background: white;
      padding: 2rem;
      border-radius: 15px;
      text-align: center;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
      text-decoration: none;
      color: inherit;
      position: relative;
      border: 2px solid transparent;
      
      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
        border-color: #3eaf7c;
      }
      
      .nav-icon {
        font-size: 2.5rem;
        margin-bottom: 1rem;
      }
      
      h3 {
        color: #2c3e50;
        margin-bottom: 0.5rem;
        font-size: 1.3rem;
      }
      
      p {
        color: #6c757d;
        line-height: 1.6;
        margin-bottom: 1rem;
        font-size: 0.9rem;
      }
      
      .nav-badge {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: #3eaf7c;
        color: white;
        padding: 0.3rem 0.6rem;
        border-radius: 12px;
        font-size: 0.7rem;
        font-weight: 600;
      }
    }
  }
}

.features {
  padding: 6rem 0;
  background: #f8f9fa;
  
  .section-title {
    text-align: center;
    font-size: 2.5rem;
    color: #2c3e50;
    margin-bottom: 3rem;
  }
  
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    
    .feature-card {
      background: white;
      padding: 2rem;
      border-radius: 15px;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
      
      &:hover {
        transform: translateY(-10px);
      }
      
      .feature-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
      }
      
      h3 {
        color: #2c3e50;
        margin-bottom: 1rem;
      }
      
      p {
        color: #6c757d;
        line-height: 1.6;
      }
    }
  }
}

.latest-posts {
  padding: 6rem 0;
  background: #f8f9fa;
  
  .section-title {
    text-align: center;
    font-size: 2.5rem;
    color: #2c3e50;
    margin-bottom: 3rem;
  }
  
  .posts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
  }
  
  .post-card {
    background: white;
    border-radius: 15px;
    padding: 2rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    border: 1px solid #e9ecef;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
    }
    
    .post-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      
      .post-date {
        color: #6c757d;
        font-size: 0.9rem;
        font-weight: 500;
      }
      
      .post-tags {
        display: flex;
        gap: 0.5rem;
        
        .post-tag {
          background: #e3f2fd;
          color: #1976d2;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
        }
      }
    }
    
    .post-title {
      margin: 0 0 1rem 0;
      
      a {
        color: #2c3e50;
        text-decoration: none;
        font-size: 1.3rem;
        font-weight: 600;
        line-height: 1.4;
        transition: color 0.3s ease;
        
        &:hover {
          color: #3eaf7c;
        }
      }
    }
    
    .post-excerpt {
      color: #6c757d;
      line-height: 1.6;
      margin-bottom: 1.5rem;
      font-size: 0.95rem;
    }
    
    .post-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .read-time {
        color: #6c757d;
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        
        &::before {
          content: '⏱️';
          margin-right: 0.5rem;
        }
      }
      
      .read-more {
        color: #3eaf7c;
        text-decoration: none;
        font-weight: 600;
        font-size: 0.9rem;
        transition: all 0.3s ease;
        
        &:hover {
          color: #2d8659;
          transform: translateX(3px);
        }
      }
    }
  }
  
  .no-posts {
    text-align: center;
    padding: 4rem 2rem;
    color: #6c757d;
    
    .no-posts-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }
    
    p {
      font-size: 1.1rem;
      margin: 0;
    }
  }
  
  .view-all {
    text-align: center;
    
    .view-all-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: #3eaf7c;
      color: white;
      padding: 1rem 2rem;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s ease;
      
      &:hover {
        background: #2d8659;
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(62, 175, 124, 0.3);
      }
      
      &::after {
        content: '→';
      }
    }
  }
}

.footer
  text-align center
  padding-top 2rem
  color #4e6e8e
  
  p
    margin-bottom 1rem
  
  a
    color #3eaf7c
    text-decoration none
    
    &:hover
      text-decoration underline
  
  .social-links
    display flex
    justify-content center
    gap 1.5rem
    
    a
      font-size 1.5rem
      transition transform 0.3s ease
      
      &:hover
        transform scale(1.2)

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@media (max-width: 768px) {
  .hero {
    flex-direction: column;
    text-align: center;
    padding: 2rem 1rem;
    min-height: 70vh;
    
    .hero-content {
      .hero-title {
        font-size: 2.5rem;
      }
      
      .hero-subtitle {
        font-size: 1.2rem;
      }
      
      .hero-stats {
        justify-content: center;
        gap: 1rem;
        
        .stat-item {
          .stat-number {
            font-size: 1.5rem;
          }
        }
      }
      
      .hero-actions {
        justify-content: center;
        
        .btn {
          padding: 0.8rem 1.5rem;
          font-size: 0.9rem;
        }
      }
    }
    
    .hero-image {
      margin-top: 2rem;
      
      .hero-visual {
        width: 300px;
        height: 300px;
        
        .floating-card {
          padding: 1rem;
          
          .card-icon {
            font-size: 1.5rem;
          }
          
          .card-text {
            font-size: 0.8rem;
          }
        }
      }
    }
  }
  
  .quick-nav {
    padding: 3rem 1rem;
    
    .nav-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
  }
  
  .features {
    padding: 3rem 1rem;
    
    .features-grid {
      grid-template-columns: 1fr;
    }
  }
  
  .latest-posts {
    padding: 3rem 1rem;
    
    .posts-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    
    .post-card {
      padding: 1.5rem;
      
      .post-meta {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }
      
      .post-title a {
        font-size: 1.2rem;
      }
      
      .post-footer {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }
    }
  }
}
</style>