import { motion } from 'motion/react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Github, Share2, Calendar, User, MapPin } from 'lucide-react';

export default function Post() {
  const { slug } = useParams();

  const post = {
    title: '三年孤旅：从 0 到 33 枚 Merged PRs，我的 GitHub 演进全史',
    date: '2026年07月08日',
    author: 'Binbim',
    category: '深度复盘',
    content: `
      <p class="lead text-xl md:text-2xl text-zinc-200 font-bold tracking-tight mb-12 md:mb-16 leading-relaxed">
        这不仅是一篇博客，更是一份关于三年来数万次敲击键盘、数百个不眠之夜的数字化档案。
      </p>

      <h2 id="01">01. 序言：邮政绿与代码绿的重逢</h2>
      <p>2026 年 7 月 8 日，柳州的夏雨初晴。我正坐在宿舍里，处理着几个关于网络协议的实验数据。</p>
      <p>就在刚才，我拆开了那封中国邮政 EMS 录取通知书专递。<strong>广西柳州城市职业学院，计算机网络工程专业。</strong> 作为一名在柳州已经度过了三年职高时光、即将开启又一个三年大专征程的<strong>广西贵港人</strong>，当我抚摸着通知书上烫金的文字时，我的另一只手下意识地刷新了 GitHub 主页。</p>

      <h2 id="02">02. 2023：启蒙时刻——那一抹“入门蓝”</h2>
      <p>三年前的今天，我的 GitHub 主页还是一片荒芜。那时候的我，对“开源”的理解仅仅停留在“去别人的仓库下载免费的代码”。</p>
      <h3>2.1 恩师引路：Web 世界的第一道光</h3>
      <p>幸运的是，在那个懵懂的起点，我遇到了一位带我真正“入行”的恩师。他教我不只是如何写 HTML 标签，更多的是教我如何选购服务器配置、如何处理复杂的运维逻辑。</p>

      <h2 id="03">03. 2024：扩张之路——硬件迭代与助理生涯</h2>
      <p>进入 2024 年，我的 GitHub 贡献矩阵开始出现明显的深绿色块。这一年，我的生活节奏发生了剧烈的变化，技术栈也迎来了爆发。</p>
      <h3>3.1 武器升级：七彩虹将星 X15 的“火力全开”</h3>
      <p>高二那年，我终于迎来了我的“性能怪兽”——<strong>七彩虹将星 X15 XS 22</strong>。原装的 i7-12700H 给了我处理大规模数据的底气。为了追求极致的多任务处理，我亲手将内存升级到了 <strong>32GB</strong>，并加装了一块 <strong>2TB 的七彩虹“橘猫”硬盘</strong>。</p>

      <h2 id="04">04. 2025：深耕之年——在 33 枚 Merged PRs 里的成长</h2>
      <p>2025 年是我技术思维彻底转型的一年。我开始不再满足于自己写小工具，而是尝试向全球顶尖的开源项目发起挑战。</p>
      <h3>4.1 只有“大型项目”才能带来的快感</h3>
      <p>对我而言，只有像 <strong>aeon-toolkit</strong> 这样具有国际影响力的、代码逻辑严密到近乎苛刻的大型项目，当我的代码被其维护者认可并 Merge 的那一刻，那种战胜自我的快感才足以覆盖所有的疲惫。</p>
      <h3>4.2 Sklearn 合约的捍卫战</h3>
      <p>在 PR #3541 中，我修复了 RandomChannelSelector 的底层 Bug。这个任务要求我深入理解 <strong>Scikit-learn 的克隆合约 (Clone Contract)</strong>。</p>

      <h2 id="05">05. 网络基因：从路由器到小型 NAS</h2>
      <p>为什么在拥有了写出高性能前端架构和复杂 Python 逻辑的能力后，我依然选择了<strong>计算机网络工程</strong>作为大学专业？</p>
      <p>小时候跟着家里的长辈一起研究如何配置拨号上网。在收到通知书之前，我已经在家中亲手组建了一套属于自己的 <strong>小型 NAS 系统</strong>。而在即将开启的大学生活中，我有一个非常“极客”的执念：<strong>我一定要在宿舍里组建一套属于自己的 NAS 和微型私有云集群。</strong></p>

      <h2 id="06">06. 我的开发者准则：Tab、规范与强迫症</h2>
      <p>作为一个在 GitHub 摸爬滚打三年的开发者，我有一套近乎偏执的自我要求。我是一个坚定的 <strong>Tab 派</strong>。feat:、fix:、chore:……每一个 Commit Message 都必须清晰地描述变动的动因。</p>

      <h2 id="07">07. 战绩看板：数据从不说谎</h2>
      <div class="stats-container not-prose my-16 space-y-12">
        <h4 class="font-mono text-accent text-sm mb-10 uppercase tracking-[0.4em] font-bold">系统遥感数据 (Telemetry_Output)</h4>
        
        <div class="flex flex-col lg:flex-row gap-8 justify-center">
          <div class="w-full lg:w-1/2 overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950/60 p-4 shadow-xl">
            <img src="https://github-readme-stats-eight-theta.vercel.app/api?username=BB0813&theme=tokyonight&show_icons=true&hide_border=true&show=reviews&hide_title=false&number_format=long&rank_icon=github" alt="GitHub Stats" class="w-full h-auto" />
          </div>
          <div class="w-full lg:w-1/2 overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950/60 p-4 shadow-xl">
            <img src="https://streak-stats.demolab.com?user=BB0813&theme=tokyonight&hide_border=true" alt="Streak Stats" class="w-full h-auto" />
          </div>
        </div>

        <div class="w-full overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950/60 p-4 md:p-6 shadow-xl text-center">
          <img src="https://github-readme-activity-graph.vercel.app/graph?username=BB0813&theme=tokyo-night&hide_border=true&area=true&custom_title=开源贡献活动图" alt="Contribution Graph" class="w-full h-auto mx-auto" />
        </div>

        <div class="flex justify-center">
          <div class="w-full max-w-[500px] overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950/60 p-4 shadow-xl text-center">
            <img src="https://github-readme-stats-eight-theta.vercel.app/api/top-langs/?username=BB0813&theme=tokyonight&hide_border=true&layout=compact&langs_count=8" alt="Top Langs" class="w-full h-auto mx-auto" />
          </div>
        </div>
      </div>

      <h2 id="08">08. 结语：长征刚刚开始</h2>
      <p>录取通知书正静静地摆在我的显示器旁边。它的颜色和 EMS 包裹一样，是一种充满生机的、深邃的绿。回望这三年，从那台 4 核 8G 的旧华硕，到现在的 32G 顶配将星。</p>
      <p><strong>录取通知书不是终点，而是更高频段的起跑线。</strong>感谢中国邮政，送来了通往未来的车票。感谢 GitHub，给了我这个贵港少年通往世界的窗户。你好，大学。你好，网络工程。我是 Binbim (BB0813)。长征刚刚开始，而我永远在线。</p>
    `
  };

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[#050505] min-h-screen"
    >
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1.5 bg-accent z-50 origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />

      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-12 md:py-24">
        <Link to="/" className="group inline-flex items-center gap-3 text-zinc-500 hover:text-white transition-all mb-16 md:mb-24 font-mono text-xs md:text-sm tracking-widest uppercase font-bold border-b border-zinc-900 pb-2">
          <ArrowLeft size={16} className="group-hover:-translate-x-1.5 transition-transform text-accent" /> 返回首页 / HOME
        </Link>

        <header className="mb-20 md:mb-28">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 mb-10 font-mono text-xs md:text-sm text-zinc-500 uppercase tracking-tight font-medium">
            <div className="flex items-center gap-2.5"><Calendar size={18} className="text-accent" /> {post.date}</div>
            <div className="flex items-center gap-2.5"><User size={18} className="text-accent" /> {post.author}</div>
            <div className="flex items-center gap-2.5"><MapPin size={18} className="text-accent" /> 广西贵港 (柳州求学中)</div>
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
                <a href="https://github.com/BB0813" target="_blank" className="hover:text-accent transition-all flex items-center gap-2.5 font-bold">
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
