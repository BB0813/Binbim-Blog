import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Github, Twitter, MapPin, ArrowUpRight } from 'lucide-react';

const posts = [
  {
    slug: 'anniversary',
    title: '三年孤旅：从 0 到 33 枚 Merged PRs，我的 GitHub 演进全史',
    date: '2026.07.08',
    excerpt: '从 EMS 录取通知书到 33 枚 Merged PRs，记录我三年来从脚本小子到开源贡献者的完整蜕变。',
    category: '深度复盘'
  }
];

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto px-5 sm:px-8 py-16 md:py-32">
      {/* 头部区域 */}
      <header className="mb-16 md:mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-3 mb-8 text-accent font-mono text-xs md:text-sm tracking-[0.2em] font-medium">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent"></span>
            </span>
            准备迎接大学新征程
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tighter mb-10 leading-[0.85]">
            Binbim<span className="text-accent">.</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-zinc-400 max-w-2xl leading-relaxed mb-12">
            准计算机网络工程专业学生。全栈开发探索者，专注于 Python 自动化与现代 Web 架构。
          </p>
          
          <div className="flex flex-wrap gap-x-8 gap-y-5 text-zinc-500 font-mono text-xs md:text-sm uppercase tracking-widest">
            <div className="flex items-center gap-2.5">
              <MapPin size={16} className="text-zinc-700" /> 广西 · 贵港（现居柳州）
            </div>
            <div className="flex gap-8">
              <a href="https://github.com/BB0813" target="_blank" className="flex items-center gap-2 hover:text-accent transition-colors">
                <Github size={16} /> GITHUB <ArrowUpRight size={14} />
              </a>
              <a href="https://x.com/Binbim_ProMax" target="_blank" className="flex items-center gap-2 hover:text-accent transition-colors">
                <Twitter size={16} /> TWITTER <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </motion.div>
      </header>

      {/* 列表区域 */}
      <section>
        <motion.h2 
          className="text-xs md:text-sm font-mono text-zinc-600 mb-10 md:mb-16 tracking-[0.3em] uppercase border-b border-zinc-900 pb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          精选文章 / SELECTED_WRITING
        </motion.h2>

        <div className="space-y-16 md:space-y-28">
          {posts.map((post, i) => (
            <motion.article 
              key={post.slug}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="group relative"
            >
              <Link to={`/post/${post.slug}`} className="block">
                <div className="flex justify-between items-center mb-8">
                  <span className="text-accent font-mono text-xs tracking-widest uppercase px-3 py-1 border border-accent/20 rounded-md bg-accent/5">{post.category}</span>
                  <span className="text-zinc-600 font-mono text-xs md:text-sm">{post.date}</span>
                </div>
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 group-hover:text-accent transition-colors duration-500 tracking-tighter leading-tight">
                  {post.title}
                </h3>
                <p className="text-zinc-500 text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl mb-10 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-2.5 text-zinc-300 font-mono text-sm tracking-widest group-hover:text-accent transition-colors">
                  阅读全文 <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </section>

      {/* 页脚 */}
      <footer className="mt-40 pt-16 border-t border-zinc-900 text-zinc-600 font-mono text-xs md:text-sm uppercase tracking-[0.15em] flex flex-col sm:row justify-between gap-10">
        <div className="flex flex-col gap-3">
          <div className="text-zinc-400 font-medium">© 2026 BINBIM. DESIGNED FOR EXTREME PERFORMANCE.</div>
          <div className="text-zinc-800 text-[11px] md:text-xs">BUILT WITH REACT + MOTION + TAILWIND</div>
        </div>
        <div className="text-zinc-500 sm:text-right flex flex-col gap-2">
          <div>籍贯：广西贵港 / 求学：广西柳州</div>
          <div className="text-zinc-800 text-[11px] md:text-xs">COORD: 24°19′N 109°24′E</div>
        </div>
      </footer>
    </main>
  );
}
