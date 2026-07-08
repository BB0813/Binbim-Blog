import { motion } from 'motion/react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Github, Share2 } from 'lucide-react';

export default function Post() {
  const { slug } = useParams();

  // 模拟内容数据 (实际应用中可以 fetch markdown 并解析)
  const post = {
    title: '三年孤旅：从 0 到 33 枚 Merged PRs，我的 GitHub 演进全史',
    date: 'July 08, 2026',
    author: 'Binbim',
    content: `
      <h2>01. 序言：邮政绿与代码绿的重逢</h2>
      <p>2026 年 7 月 8 日，柳州的夏雨初晴。当我拆开那封中国邮政 EMS 录取通知书专递时，我的另一只手下意识地刷新了 GitHub 主页...</p>
      
      <h2>02. 2023：启蒙时刻</h2>
      <p>三年前的今天，我的 GitHub 主页还是一片荒芜。那时候的我，对“开源”的理解仅仅停留在“下载免费的代码”...</p>
      
      <h2>03. 2024：扩张之路</h2>
      <p>这一年，我换了新的“性能怪兽”——七彩虹将星 X15。我开始疯狂开发 AstrBot 相关的插件，处理复杂的异步 IO 阻塞...</p>

      <h2>04. 2025：深耕之年</h2>
      <p>在 PR #3541 中，我修复了 aeon-toolkit 的底层 Bug。合并的那一刻，我意识到，我已经不再是那个中职院校里的普通学生...</p>

      <h2>05. 网络工程的执念</h2>
      <p>为什么一个写前端的要去拉“网线”？因为代码是建筑，而网络是地基。我要去理解比特流的源头...</p>

      <div class="stats-card mt-12 p-8 border border-zinc-800 rounded-lg bg-zinc-950/50">
        <h3 class="font-mono text-accent text-sm mb-6 uppercase tracking-widest">Digital Footprint</h3>
        <div class="flex flex-col gap-6">
          <img src="https://github-readme-stats.vercel.app/api?username=BB0813&show_icons=true&theme=vue-dark&hide_border=true&bg_color=00000000" alt="GitHub Stats" class="w-full" />
          <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=BB0813&layout=compact&theme=vue-dark&hide_border=true&bg_color=00000000" alt="Langs" class="w-full" />
        </div>
      </div>
    `
  };

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-3xl mx-auto px-6 py-20"
    >
      <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-16 font-mono text-xs tracking-widest uppercase">
        <ArrowLeft size={14} /> Back to Dashboard
      </Link>

      <header className="mb-20">
        <div className="flex items-center gap-4 mb-6 font-mono text-xs text-accent uppercase tracking-widest">
          <span>{post.date}</span>
          <span className="w-1 h-1 bg-zinc-800 rounded-full"></span>
          <span>By {post.author}</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter leading-[1.1] mb-12">
          {post.title}
        </h1>
        <div className="h-1 w-24 bg-accent"></div>
      </header>

      <article className="prose prose-invert prose-zinc max-w-none 
        prose-h2:text-3xl prose-h2:tracking-tighter prose-h2:font-bold prose-h2:mt-16 prose-h2:mb-8
        prose-p:text-zinc-400 prose-p:text-lg prose-p:leading-relaxed prose-p:mb-8
        prose-strong:text-white prose-a:text-accent prose-code:text-accent
      ">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>

      <footer className="mt-32 pt-12 border-t border-zinc-900 flex justify-between items-center text-zinc-500">
        <div className="flex gap-6">
           <a href="https://github.com/BB0813" target="_blank" className="hover:text-white transition-colors">
            <Github size={20} />
          </a>
          <button className="hover:text-white transition-colors">
            <Share2 size={20} />
          </button>
        </div>
        <span className="font-mono text-xs uppercase tracking-widest italic">Stay hungry, stay foolish.</span>
      </footer>
    </motion.main>
  );
}
