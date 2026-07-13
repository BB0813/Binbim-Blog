import { motion } from 'motion/react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Github, Share2, Calendar, User, MapPin } from 'lucide-react';
import { getPostBySlug } from '@/data/posts';

export default function Post() {
  const { slug } = useParams();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) {
    return (
      <main className="bg-[#050505] min-h-screen">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 py-12 md:py-24">
          <Link
            to="/"
            className="group inline-flex items-center gap-3 text-zinc-500 hover:text-white transition-all mb-16 font-mono text-xs md:text-sm tracking-widest uppercase font-bold border-b border-zinc-900 pb-2"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1.5 transition-transform text-accent" />{' '}
            返回首页 / HOME
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-6">文章未找到</h1>
          <p className="text-zinc-500 text-lg">slug「{slug}」不存在，或尚未发布。</p>
        </div>
      </main>
    );
  }

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#050505] min-h-screen">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-accent z-50 origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      />

      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-12 md:py-24">
        <Link
          to="/"
          className="group inline-flex items-center gap-3 text-zinc-500 hover:text-white transition-all mb-16 md:mb-24 font-mono text-xs md:text-sm tracking-widest uppercase font-bold border-b border-zinc-900 pb-2"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1.5 transition-transform text-accent" /> 返回首页 /
          HOME
        </Link>

        <header className="mb-20 md:mb-28">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 mb-10 font-mono text-xs md:text-sm text-zinc-500 uppercase tracking-tight font-medium">
            <div className="flex items-center gap-2.5">
              <Calendar size={18} className="text-accent" /> {post.dateFull}
            </div>
            <div className="flex items-center gap-2.5">
              <User size={18} className="text-accent" /> {post.author}
            </div>
            <div className="flex items-center gap-2.5">
              <MapPin size={18} className="text-accent" /> {post.location}
            </div>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter leading-[1.0] text-white mb-16">
            {post.title}
          </h1>

          <div className="flex items-center gap-6">
            <span className="px-4 py-1.5 border border-accent/30 rounded-xl text-accent font-mono text-xs md:text-sm tracking-widest uppercase bg-accent/5 font-bold">
              {post.category}
            </span>
            <div className="h-[1px] flex-1 bg-zinc-900"></div>
          </div>
        </header>

        <article className="prose-custom max-w-none">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>

        <footer className="mt-32 md:mt-48 pt-16 md:pt-20 border-t border-zinc-900">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 text-zinc-500 font-mono text-xs md:text-sm uppercase tracking-wider">
            <div className="space-y-8 w-full md:w-auto">
              <h4 className="text-white font-black border-b border-accent w-fit pb-1">联系作者 / CONTACT</h4>
              <div className="flex gap-8">
                <a
                  href="https://github.com/BB0813"
                  target="_blank"
                  className="hover:text-accent transition-all flex items-center gap-2.5 font-bold"
                >
                  <Github size={20} /> GitHub
                </a>
                <button className="hover:text-accent transition-all flex items-center gap-2.5 font-bold">
                  <Share2 size={20} /> 分享文章
                </button>
              </div>
            </div>
            <div className="text-left md:text-right w-full md:w-auto border-t md:border-t-0 border-zinc-900/50 pt-10 md:pt-0">
              <div className="mb-2 italic text-zinc-600 font-bold">文档状态：发布成功 / SUCCESS</div>
              <div className="text-zinc-800 text-[10px] md:text-xs">数字指纹：2A4B17F4_GUIGANG_STUDENT</div>
            </div>
          </div>
        </footer>
      </div>
    </motion.main>
  );
}
