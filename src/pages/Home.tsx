import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Github, Twitter, MapPin, ArrowUpRight } from 'lucide-react';

const posts = [
  {
    slug: 'anniversary',
    title: '三年孤旅：从 0 到 33 枚 Merged PRs，我的 GitHub 演进全史',
    date: '2026.07.08',
    excerpt: '从 EMS 录取通知书到 33 枚 Merged PRs，记录我三年来从脚本小子到开源贡献者的完整蜕变。',
    category: 'DEEP DIVE'
  }
];

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-24 md:py-32">
      {/* Header Section */}
      <header className="mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-3 mb-6 text-accent font-mono text-sm tracking-widest">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            AVAILABLE FOR NEW CHALLENGES
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-none">
            Binbim<span className="text-accent">.</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed mb-8">
            Incoming Network Engineering student. Full-stack developer specializing in Python automation and modern Web architectures. 
            Focused on bridging the gap between high-level code and low-level protocols.
          </p>
          
          <div className="flex flex-wrap gap-6 text-zinc-500 font-mono text-xs uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <MapPin size={14} /> GUIGANG, CHINA (STUDYING IN LIUZHOU)
            </div>
            <a href="https://github.com/BB0813" target="_blank" className="flex items-center gap-1 hover:text-accent transition-colors">
              <Github size={14} /> GITHUB <ArrowUpRight size={12} />
            </a>
            <a href="https://x.com/Binbim_ProMax" target="_blank" className="flex items-center gap-1 hover:text-accent transition-colors">
              <Twitter size={14} /> TWITTER <ArrowUpRight size={12} />
            </a>
          </div>
        </motion.div>
      </header>

      {/* Featured Post */}
      <section>
        <motion.h2 
          className="text-xs font-mono text-zinc-600 mb-12 tracking-[0.3em] uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Featured Writing
        </motion.h2>

        <div className="space-y-12">
          {posts.map((post, i) => (
            <motion.article 
              key={post.slug}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="group border-t border-zinc-900 pt-12 pb-4"
            >
              <Link to={`/post/${post.slug}`} className="block">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-accent font-mono text-xs tracking-widest uppercase">{post.category}</span>
                  <span className="text-zinc-600 font-mono text-xs">{post.date}</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-semibold mb-6 group-hover:text-accent transition-colors duration-500 tracking-tight">
                  {post.title}
                </h3>
                <p className="text-zinc-500 text-lg leading-relaxed max-w-3xl mb-8">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-2 text-zinc-100 font-mono text-sm">
                  READ FULL STORY <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-32 pt-12 border-t border-zinc-900 text-zinc-600 font-mono text-[10px] uppercase tracking-widest flex justify-between">
        <div>© 2026 BINBIM. DESIGNED FOR PERFORMANCE.</div>
        <div className="hidden md:block">BORN IN GUIGANG / STUDYING IN LIUZHOU CITY / 24°19′N 109°24′E</div>
      </footer>
    </main>
  );
}
