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
    <main className="max-w-4xl mx-auto px-6 sm:px-8 py-16 md:py-32">
      {/* 头部区域 */}
      <header className="mb-20 md:mb-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-3 mb-10 text-accent font-mono text-sm tracking-widest font-semibold">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
            </span>
            准备迎接大学新征程
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tighter mb-12 leading-[0.9] text-white">
            Binbim<span className="text-accent">.</span>
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-zinc-400 max-w-3xl leading-relaxed mb-12 font-medium">
            准计算机网络工程专业学生。全栈开发探索者，专注于 Python 自动化与现代 Web 架构。
          </p>
          
          <div className="flex flex-wrap gap-x-10 gap-y-6 text-zinc-300 font-mono text-base md:text-lg tracking-tight border-l-2 border-zinc-900 pl-8 py-2">
            <div className="flex items-center gap-3">
              <MapPin size={20} className="text-accent" /> 广西 · 贵港（现居柳州）
            </div>
            <div className="flex gap-10">
              <a href="https://github.com/BB0813" target="_blank" className="flex items-center gap-2 hover:text-accent transition-all">
                <Github size={20} /> GITHUB <ArrowUpRight size={16} />
              </a>
              <a href="https://x.com/Binbim_ProMax" target="_blank" className="flex items-center gap-2 hover:text-accent transition-all">
                <Twitter size={20} /> TWITTER <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
        </motion.div>
      </header>

      {/* 列表区域 */}
      <section>
        <motion.h2 
          className="text-xs md:text-sm font-mono text-zinc-600 mb-12 md:mb-16 tracking-[0.4em] uppercase border-b border-zinc-900 pb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          精选文章 / SELECTED_WRITING
        </motion.h2>

        <div className="space-y-24 md:space-y-32">
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
                  <span className="text-accent font-mono text-xs tracking-widest uppercase px-4 py-1.5 border border-accent/30 rounded-lg bg-accent/5 font-semibold">{post.category}</span>
                  <span className="text-zinc-500 font-mono text-xs md:text-sm">{post.date}</span>
                </div>
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 group-hover:text-accent transition-colors duration-500 tracking-tighter leading-tight text-white">
                  {post.title}
                </h3>
                <p className="text-zinc-500 text-lg sm:text-xl md:text-2xl leading-relaxed max-w-4xl mb-10 line-clamp-3 font-medium">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-3 text-zinc-200 font-mono text-base md:text-lg tracking-widest group-hover:text-accent transition-all">
                  阅读全文 / READ_FULL_STORY <ArrowUpRight size={22} />
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </section>

      {/* 页脚 */}
      <footer className="mt-48 pt-20 border-t border-zinc-900 text-zinc-500 font-mono text-sm md:text-base uppercase tracking-wider flex flex-col md:flex-row justify-between gap-12 pb-20">
        <div className="flex flex-col gap-4">
          <div className="text-zinc-300 font-bold text-lg md:text-xl">© 2026 BINBIM<span className="text-accent">.</span></div>
          <div className="text-zinc-700 text-xs tracking-[0.3em]">RECONSTRUCTED_FOR_PERFORMANCE</div>
        </div>
        <div className="sm:text-right flex flex-col gap-3 text-zinc-400">
          <div className="font-semibold text-zinc-500 text-sm">籍贯：广西贵港 / 求学：广西柳州</div>
          <div className="text-zinc-800 text-xs md:text-sm tracking-widest">COORD: 24°19′N 109°24′E</div>
        </div>
      </footer>
    </main>
  );
}
