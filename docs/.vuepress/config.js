module.exports = {
  title: 'Binbim Blog',
  description: '分享技术、记录生活、探索世界的个人博客',
  base: '/Binbim-Blog/',
  // 修复中文标题锚点问题
  markdown: {
    anchor: {
      permalink: false,
      permalinkBefore: false,
      permalinkSymbol: '#'
    },
    toc: {
      includeLevel: [1, 2, 3]
    }
  },
  head: [
    ['link', { rel: 'icon', href: '/logo.svg' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
    ['meta', { name: 'keywords', content: '博客,技术分享,前端开发,编程' }],
    ['meta', { name: 'author', content: 'Binbim' }]
  ],
  themeConfig: {
    nav: [
      { text: '🏠 首页', link: '/' },
      { text: '📚 文章', link: '/posts/' },
      { text: '🏷️ 标签', link: '/tags/' },
      { text: '🔍 搜索', link: '/search/' },
      { text: '📊 统计', link: '/stats/' }
    ],
    // Giscus评论系统配置
    giscus: {
      repo: 'BB0813/Binbim-Blog',
      repoId: 'R_kgDOOk8u1w',
      category: 'Announcements',
      categoryId: 'DIC_kwDOOk8u184CtsVb',
      mapping: 'pathname',
      strict: '0',
      reactionsEnabled: '1',
      emitMetadata: '0',
      inputPosition: 'bottom',
      theme: 'preferred_color_scheme',
      lang: 'zh-CN',
      loading: 'lazy'
    },
    sidebar: {
      '/posts/': [
        {
          title: '最新文章',
          collapsable: false,
          children: [
            '',
            '01',
            'first-post'
          ]
        }
      ]
    },
    // 自定义404页面
    notFound: ['页面未找到', '这里什么都没有', '我们怎么到这里了？'],
    backToHome: '返回首页',
    // 最后更新时间
    lastUpdated: '最后更新',
    // 编辑链接
    editLinks: false,
    // 平滑滚动
    smoothScroll: true
  },
  plugins: [
    ['@vuepress/rss', {
      base_url: '/',
      site_url: 'https://yourusername.github.io/Binbim-Blog',
      filter: frontmatter => frontmatter.date,
      count: 20
    }]
  ],
  // 配置别名，确保路由正确
  alias: {
    '/posts/first-post.html': '/posts/first-post.md'
  }
}