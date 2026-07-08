import { motion } from 'motion/react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Github, Share2, Calendar, User, MapPin } from 'lucide-react';

export default function Post() {
  const { slug } = useParams();

  // 全量还原：万字长征技术自白
  const post = {
    title: '三年孤旅：从 0 到 33 枚 Merged PRs，我的 GitHub 演进全史',
    date: '2026.07.08',
    author: 'Binbim',
    category: 'DEEP DIVE',
    content: `
      <p class="lead text-2xl text-zinc-300 font-medium tracking-tight mb-12">
        这不仅是一篇博客，更是一份关于三年来数万次敲击键盘、数百个不眠之夜的数字化档案。当 EMS 录取通知书到手时，我回头望向那个三年前初涉 GitHub 的少年，满眼都是成长的痕迹。
      </p>

      <h2 id="01">01. 序言：邮政绿与代码绿的重逢</h2>
      <p>2026 年 7 月 8 日，柳州的夏雨初晴。我正坐在宿舍里，处理着几个关于网络协议的实验数据。</p>
      <p>就在刚才，我拆开了那封中国邮政 EMS 录取通知书专递。<strong>广西柳州城市职业学院，计算机网络工程专业。</strong> 作为一名在柳州已经度过了三年职高时光、即将开启又一个三年大专征程的<strong>广西贵港人</strong>，当我抚摸着通知书上烫金的文字时，我的另一只手下意识地刷新了 GitHub 主页。那个绿色的贡献矩阵（Contribution Graph）在屏幕上闪烁，334 个绿色的方格像是一串密电码，记录了我过去三年来每一个深夜的挣扎与突破。</p>
      <p>如果说录取通知书是我现实世界的通行证，那么这三年的 GitHub 提交记录，就是我灵魂深处的编年史。</p>

      <h2 id="02">02. 2023：启蒙时刻——那一抹“入门蓝”</h2>
      <p>三年前的今天，我的 GitHub 主页还是一片荒芜。那时候的我，对“开源”的理解仅仅停留在“去别人的仓库下载免费的代码”。</p>
      <h3>2.1 恩师引路：Web 世界的第一道光</h3>
      <p>幸运的是，在那个懵懂的起点，我遇到了一位带我真正“入行”的恩师。他教我不只是如何写 HTML 标签，更多的是教我如何选购服务器配置、如何处理复杂的运维逻辑、如何让一个静态页面在 Linux 环境下优雅地跑起来。</p>
      <p>在他的引导下，我学会了：不仅仅是 Coding，我开始理解 CDN、反向代理（Nginx）以及域名解析的底层魅力。这种对硬件资源的敏感度，为我后来选择“网络工程”埋下了最深的伏笔。</p>
      <h3>2.2 硬件的“青铜时代”：那台 4 核 8G 的旧华硕</h3>
      <p>那时候，我的“武器库”还非常寒酸。高一那一整年，我守着一台好几年前的旧华硕笔记本。4 核 CPU、8G 内存，每当我打开 VS Code 和几个 Chrome 标签页，风扇的轰鸣声就像是在抗议。但就在那样一台甚至运行稍微复杂的 Python 脚本都会卡顿的机器上，我完成了最初的 Git 启蒙。</p>

      <h2 id="03">03. 2024：扩张之路——硬件迭代与助理生涯</h2>
      <p>进入 2024 年，我的 GitHub 贡献矩阵开始出现明显的深绿色块。这一年，我的生活节奏发生了剧烈的变化，技术栈也迎来了爆发。</p>
      <h3>3.1 武器升级：七彩虹将星 X15 的“火力全开”</h3>
      <p>高二那年，我终于迎来了我的“性能怪兽”——<strong>七彩虹将星 X15 XS 22</strong>。原装的 i7-12700H 给了我处理大规模数据的底气。为了追求极致的多任务处理，我亲手将内存升级到了 <strong>32GB</strong>，并加装了一块 <strong>2TB 的七彩虹“橘猫”硬盘</strong>。</p>
      <h3>3.2 校团委助理的“错位时空”</h3>
      <p>这一年，我身上多了一个特殊的身份：<strong>校团委助理</strong>。在学校团委的全职助理工作中，我每天要处理海量的行政表格、组织活动。但我是在<strong>“偷时间”</strong>。在两场会议的间隙，我会打开备忘录草拟一个函数逻辑；在值班的安静午后，我会掏出平板阅读技术文档。这种高度的时间管理能力，让我在繁忙的行政工作中，依然保持了 GitHub 贡献图的持续“点亮”。</p>

      <h2 id="04">04. 2025：深耕之年——在 33 枚 Merged PRs 里的成长</h2>
      <p>2025 年是我技术思维彻底转型的一年。我开始不再满足于自己写小工具，而是尝试向全球顶尖的开源项目发起挑战。</p>
      <h3>4.1 只有“大型项目”才能带来的快感</h3>
      <p>很多人问我，为什么不去做一些小的、容易合并的 PR 来刷数据？我的回答是：<strong>平庸的合并毫无意义。</strong> 我是一个极致的结果导向者。对我而言，只有像 <strong>aeon-toolkit</strong> 这样具有国际影响力的、代码逻辑严密到近乎苛刻的大型项目，当我的代码被其维护者认可并 Merge 的那一刻，那种战胜自我的快感才足以覆盖所有的疲惫。</p>
      <h3>4.2 Sklearn 合约的捍卫战</h3>
      <p>在 PR #3541 中，我修复了 RandomChannelSelector 的底层 Bug。这个任务要求我深入理解 <strong>Scikit-learn 的克隆合约 (Clone Contract)</strong>。虽然在提交过程中没有遇到那种恶言相向的严厉 Review，但那种无形的、基于专业素养的博弈更加考验人。你需要用完美的测试用例、严密的逻辑推导去证明：为什么你的方案才是 Right Fix。</p>

      <h2 id="05">05. 网络基因：从路由器到小型 NAS</h2>
      <p>为什么在拥有了写出高性能前端架构和复杂 Python 逻辑的能力后，我依然选择了<strong>计算机网络工程</strong>作为大学专业？</p>
      <p>小时候跟着家里的长辈一起研究如何配置拨号上网、如何调整路由器的信道、如何通过物理布线优化网络。那种对网络拓扑的直觉，仿佛流淌在血脉里。在收到通知书之前，我已经在家中亲手组建了一套属于自己的 <strong>小型 NAS 系统</strong>。而在即将开启的大学生活中，我有一个非常“极客”的执念：<strong>我一定要在宿舍里组建一套属于自己的 NAS 和微型私有云集群。</strong></p>

      <h2 id="06">06. 我的开发者准则：Tab、规范与强迫症</h2>
      <p>作为一个在 GitHub 摸爬滚打三年的开发者，我有一套近乎偏执的自我要求。我是一个坚定的 <strong>Tab 派</strong>。在我看来，Tab 赋予了每个开发者根据自己喜好调整显示宽度的权利。同时，我对规范的追求近乎病态：feat:、fix:、chore:……每一个 Commit Message 都必须清晰地描述变动的动因。这种对规范的坚持，让我在参与开源协作时，能迅速赢得维护者的信任。</p>

      <h2 id="07">07. 战绩看板：数据从不说谎</h2>
      <div class="stats-container not-prose my-12 p-8 border border-zinc-900 rounded-2xl bg-zinc-950/40">
        <h4 class="font-mono text-accent text-xs mb-8 uppercase tracking-[0.3em]">System.Telemetry_Output</h4>
        <div class="space-y-12">
          <div class="overflow-hidden rounded-lg border border-zinc-900/50 p-2 min-h-[195px] flex items-center justify-center bg-zinc-900/10">
            <img src="https://github-readme-stats.vercel.app/api?username=BB0813&show_icons=true&theme=tokyonight&hide_border=true&bg_color=00000000" alt="GitHub Stats" class="w-full h-auto" />
          </div>
          <div class="overflow-hidden rounded-lg border border-zinc-900/50 p-2 min-h-[165px] flex items-center justify-center bg-zinc-900/10">
            <img src="https://github-readme-stats.vercel.app/api/top-langs?username=BB0813&layout=compact&theme=tokyonight&hide_border=true&bg_color=00000000" alt="Langs" class="w-full h-auto" />
          </div>
          <div class="overflow-hidden rounded-lg border border-zinc-900/50 p-2 min-h-[195px] flex items-center justify-center bg-zinc-900/10">
            <img src="https://github-readme-streak-stats.herokuapp.com/?user=BB0813&theme=tokyonight&hide_border=true&background=00000000" alt="Streak" class="w-full h-auto" />
          </div>
        </div>
      </div>

      <h2 id="08">08. 结语：长征刚刚开始</h2>
      <p>录取通知书正静静地摆在我的显示器旁边。它的颜色和 EMS 包裹一样，是一种充满生机的、深邃的绿。回望这三年，从那台 4 核 8G 的旧华硕，到现在的 32G 顶配将星；从连 HTML 标签都要查文档的萌新，到能在国际开源项目里捍卫 Sklearn 合约的贡献者。</p>
      <p><strong>录取通知书不是终点，而是更高频段的起跑线。</strong>感谢中国邮政，送来了通往未来的车票。感谢 GitHub，给了我这个贵港少年通往世界的窗户。你好，大学。你好，网络工程。我是 Binbim (BB0813)。长征刚刚开始，而我永远在线。</p>
    `
  };

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[#050505] min-h-screen"
    >
      {/* 顶部进度条 */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-accent z-50 origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />

      <div className="max-w-4xl mx-auto px-6 py-20">
        <Link to="/" className="group inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-20 font-mono text-[10px] tracking-[0.3em] uppercase">
          <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </Link>

        <header className="mb-24">
          <div className="flex flex-wrap items-center gap-6 mb-10 font-mono text-[10px] text-zinc-500 uppercase tracking-[0.2em]">
            <div className="flex items-center gap-2"><Calendar size={12} className="text-accent" /> {post.date}</div>
            <div className="flex items-center gap-2"><User size={12} className="text-accent" /> {post.author}</div>
            <div className="flex items-center gap-2"><MapPin size={12} className="text-accent" /> GUIGANG, CN (STUDYING IN LIUZHOU)</div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.95] text-white mb-12">
            {post.title}
          </h1>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 border border-accent/30 rounded-full text-accent font-mono text-[10px] tracking-widest uppercase">
              {post.category}
            </span>
            <div className="h-[1px] flex-1 bg-zinc-900"></div>
          </div>
        </header>

        <article className="prose prose-invert prose-zinc max-w-none 
          prose-h2:text-4xl prose-h2:tracking-tighter prose-h2:font-bold prose-h2:mt-24 prose-h2:mb-10 prose-h2:text-white
          prose-h3:text-2xl prose-h3:tracking-tight prose-h3:font-semibold prose-h3:mt-12 prose-h3:mb-6 prose-h3:text-zinc-200
          prose-p:text-zinc-400 prose-p:text-xl prose-p:leading-[1.7] prose-p:mb-10
          prose-strong:text-white prose-strong:font-semibold
          prose-blockquote:border-l-accent prose-blockquote:bg-zinc-950/50 prose-blockquote:py-2 prose-blockquote:px-8 prose-blockquote:rounded-r-lg
          prose-code:text-accent prose-code:bg-accent/5 prose-code:px-1 prose-code:rounded
        ">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>

        <footer className="mt-40 pt-16 border-t border-zinc-900">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 text-zinc-500">
            <div className="space-y-4">
              <h4 className="font-mono text-xs text-white uppercase tracking-widest">Connect with the Author</h4>
              <div className="flex gap-6">
                <a href="https://github.com/BB0813" target="_blank" className="hover:text-accent transition-colors flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest">
                  <Github size={18} /> GitHub
                </a>
                <button className="hover:text-accent transition-colors flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest">
                  <Share2 size={18} /> Share
                </button>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] mb-2 italic text-zinc-600">EndOfFile.Status: Success</div>
              <div className="text-zinc-800 font-mono text-[9px]">HASH: 2a4b17f4_3cfd46e5_9e38ddbe</div>
            </div>
          </div>
        </footer>
      </div>
    </motion.main>
  );
}
