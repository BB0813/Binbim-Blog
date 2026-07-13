export interface Post {
  slug: string;
  title: string;
  date: string;
  dateFull: string;
  excerpt: string;
  category: string;
  author: string;
  location: string;
  content: string;
}

export const posts: Post[] = [
  {
    slug: 'anniversary',
    title: '三年孤旅：从 0 到 33 枚 Merged PRs，我的 GitHub 演进全史',
    date: '2026.07.08',
    dateFull: '2026年07月08日',
    excerpt:
      '从 EMS 录取通知书到 33 枚 Merged PRs，记录我三年来从脚本小子到开源贡献者的完整蜕变。',
    category: '深度复盘',
    author: 'Binbim',
    location: '广西贵港 (柳州求学中)',
    content: `
      <p class="lead text-xl md:text-2xl text-zinc-200 font-bold tracking-tight mb-12 md:mb-16 leading-relaxed">
        这不仅是一篇博客，更是一份关于三年来数万次敲击键盘、数百个不眠之夜的数字化档案。
      </p>

      <h2 id="01">01. 序言：邮政绿与代码绿的重逢</h2>
      <p>2026 年 7 月 8 日，柳州的夏雨初晴。我正坐在宿舍里，处理着几个关于网络协议的实验数据。</p>
      <p>就在刚才，我拆开了那封中国邮政 EMS 录取通知书专递。<strong>柳州城市职业学院，计算机网络工程专业。</strong> 作为一名在柳州已经度过了三年职高时光、即将开启又一个三年大专征程的<strong>广西贵港人</strong>，当我抚摸着通知书上烫金的文字时，我的另一只手下意识地刷新了 GitHub 主页。</p>

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
      <h3>4.2 两枚进 main 的 aeon PR</h3>
      <p><a href="https://github.com/aeon-toolkit/aeon/pull/3541">#3541</a>：把 <code>RandomChannelSelector</code> 对 <code>p</code> 的校验从 <code>__init__</code> 挪到 <code>_fit</code>，对齐 sklearn 克隆合约。</p>
      <p><a href="https://github.com/aeon-toolkit/aeon/pull/3638">#3638</a>：修 catch22 在 <code>use_pycatch22=True</code> 时 <code>outlier_norm</code> 用错特征下标，并补回归测试——numba 路径是对的，pycatch22 路径却一直算在原始序列上。</p>

      <h2 id="05">05. 网络基因：从路由器到小型 NAS</h2>
      <p>为什么在拥有了写出高性能前端架构和复杂 Python 逻辑的能力后，我依然把专业落在<strong>计算机网络工程</strong>？</p>
      <p>小时候跟着家里的长辈一起研究如何配置拨号上网。在收到通知书之前，我已经在家中用旧机器跑起了 <strong>FnOS 小型 NAS</strong>。而在即将开启的大学生活中，我有一个非常“极客”的执念：<strong>我一定要在宿舍里组建一套属于自己的 NAS 和微型私有云集群。</strong></p>

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
    `,
  },
  {
    slug: 'pr-clone-contract',
    title: 'Issue → Review → Merge：aeon #3541 与 #3638 全链路复盘',
    date: '2026.07.12',
    dateFull: '2026年07月12日',
    excerpt:
      '从 TonyBagnall 开的 Issue，到 BB0813 的 PR、CHANGES_REQUESTED、回复与 LGTM：两枚 Merged 贡献的完整对话与技术解剖。',
    category: '开源复盘',
    author: 'Binbim',
    location: '广西贵港 (柳州求学中)',
    content: `
      <p class="lead text-xl md:text-2xl text-zinc-200 font-bold tracking-tight mb-12 md:mb-16 leading-relaxed">
        开源贡献不是“我推了一段代码”。它是 Issue 里的问题定义、PR 里的方案与测试、Review 里的来回——以及你愿不愿意按维护者的标准改到可合并。
      </p>

      <h2 id="01">01. 这篇怎么读</h2>
      <p>仓库：<strong><a href="https://github.com/aeon-toolkit/aeon">aeon-toolkit/aeon</a></strong>。贡献者：<strong>BB0813</strong>。主审查与合并者：<strong>TonyBagnall</strong>。另有 code owner 被请求 review 的 <strong>MatthewMiddlehurst</strong>；#3632 上曾有 <strong>w3lld1</strong> 自助 assign。</p>
      <p>两条完整链路：</p>
      <p><strong>链路 A</strong>：Issue <a href="https://github.com/aeon-toolkit/aeon/issues/3490">#3490</a> →（中途 <a href="https://github.com/aeon-toolkit/aeon/pull/3525">#3525</a> 关闭）→ PR <a href="https://github.com/aeon-toolkit/aeon/pull/3541">#3541</a> → Merge（2026-06-22）→ all-contributors</p>
      <p><strong>链路 B</strong>：Issue <a href="https://github.com/aeon-toolkit/aeon/issues/3632">#3632</a> → PR <a href="https://github.com/aeon-toolkit/aeon/pull/3638">#3638</a> → Merge（2026-07-12）</p>
      <p>下文按 <strong>Issue 层 → PR 层 → Review/对话层 → 我学到的</strong> 展开，对话依据公开 GitHub 记录，不美化、不脑补私聊。</p>

      <h2 id="02">02. 链路 A · Issue #3490：问题是谁定义的</h2>
      <p><strong>开 Issue 的人不是我，是 TonyBagnall</strong>（2026-06-20）。标签：<code>bug</code>、<code>good first issue</code>、<code>channel selection</code>。Issue 区无讨论回复——规格已经写在正文里，等贡献者直接修。</p>
      <h3>2.1 Issue 原文在说什么</h3>
      <p>文件：<code>aeon/transformations/collection/channel_selection/_random.py</code>（约 46–49 行）。</p>
      <p><code>RandomChannelSelector</code> 在 <code>__init__</code> 里对 <code>p ∉ (0, 1]</code> 直接 <code>raise ValueError</code>。Tony 写明：构造函数应<strong>原样保存参数</strong>，校验推迟到 <code>_fit</code>，与同包 <code>ChannelScorer</code>、<code>ElbowClass*</code> 一致。</p>
      <p>在 <code>__init__</code> 校验的后果：非法 <code>p</code> 在<strong>构造期</strong>失败，而不是 fit 期——对 estimator 表面来说既 surprising，又 inconsistent。</p>
      <p>他给出的 Fix 规格极具体：<code>__init__</code> 只留 <code>self.p = p</code> / <code>self.random_state = random_state</code>；范围检查挪到 <code>_fit</code> 开头。</p>
      <p>复现步骤在 Issue 里写得很短：call init / Expected: validate in fit / Actual: init check。对 good first issue 来说，这是在<strong>降低理解成本</strong>，不是在偷懒。</p>
      <h3>2.2 这和 sklearn 克隆合约的关系</h3>
      <p>Issue 标题直接点名：<em>violates sklearn clone contract</em>。交叉验证、Pipeline、<code>clone()</code> 会反复“按同一组参数构造未拟合副本”。构造期校验或副作用，会让生态假设破产。#3490 不是“算法算错”，是<strong>生命周期放错层</strong>。</p>

      <h2 id="03">03. 链路 A · PR #3541：我交了什么</h2>
      <p>标题最终为：<code>[BUG] fix: move RandomChannelSelector p validation from __init__ to _fit</code>（曾先以无标签前缀开出，bot 提醒补 <code>[BUG]</code> 等约定后改正）。</p>
      <p>分支：<code>fix/random-channel-selector-v2</code>。规模：2 文件，约 +6/−5。Fixes #3490。</p>
      <p>PR 描述结构（我当时写的骨架）：</p>
      <p><strong>Problem</strong>：<code>__init__</code> 校验 <code>p</code>，违反 clone 合约，且与同包其它 selector 不一致。</p>
      <p><strong>Solution</strong>：范围检查挪到 <code>_fit</code>。</p>
      <p><strong>Changes</strong>：<code>_random.py</code> + <code>test_random.py</code>（期望 <code>ValueError</code> 出现在 <code>fit_transform</code> 时）。</p>
      <p>前序 <a href="https://github.com/aeon-toolkit/aeon/pull/3525">#3525</a> 同主题已关闭——最终以 v2 分支落地，说明第一枪不一定打中流程/细节，但问题还在，可以再来。</p>
      <h3>3.1 Bot 与流程噪音</h3>
      <p><code>aeon-actions-bot</code> 欢迎贡献、按改动打上 <code>transformations</code>、提示 Checks / pre-commit / Discord。这类评论不是审查，却是项目的<strong>协作语法</strong>：标题标签、CI 入口、本地 pre-commit。</p>

      <h2 id="04">04. 链路 A · Review 对话：CHANGES_REQUESTED → 我回复 → LGTM</h2>
      <h3>4.1 Tony · Request changes（核心教学时刻）</h3>
      <p>原文大意：作为新贡献者，他愿意把这个 issue 给我；代码大体 OK，但<strong>合并前必须改测试</strong>。</p>
      <p>我当时的测法是：</p>
      <p><code>with pytest.raises(ValueError, match="Proportion of channels..."): RandomChannelSelector(p=0).fit_transform(X)</code></p>
      <p>Tony 一针见血：若旧行为回归（异常仍在 <code>__init__</code> 抛出），这个 <code>pytest.raises</code> <strong>照样通过</strong>——上下文管理器分不清异常来自构造还是 fit。而本 bug 的规格恰恰是：<strong>校验必须发生在 fit，而不是 construction</strong>。</p>
      <p>他给出标准拆法：</p>
      <p><code>selector = RandomChannelSelector(p=0)</code>  # 构造必须成功</p>
      <p><code>with pytest.raises(...): selector.fit_transform(X)</code>  # 只在这里允许炸</p>
      <h3>4.2 我 · 公开回复</h3>
      <p>我在 PR 下写：</p>
      <p><em>“OK. I will modify the original code according to this requirement, and after the modification, I will submit the new code and initiate a new CI test.”</em></p>
      <p>Tony 给了 👍。语言不华丽，但态度是：<strong>认领修改、再跑 CI</strong>——开源协作里这比长篇辩解有用。</p>
      <h3>4.3 第二 commit 与 Approve</h3>
      <p>我追加 commit：<code>test: separate construction from fit in RandomChannelSelector test</code>，commit message 写明：若旧行为回来，合并写法会掩盖回归。</p>
      <p>Tony 第二次 review：<strong>“thanks, LGTM”</strong> → Approve → Merge（2026-06-22）。随后评论 <code>@all-contributors add @BB0813 for bug</code>，bot 开出 <a href="https://github.com/aeon-toolkit/aeon/pull/3554">#3554</a> 把我写进贡献者名单。</p>
      <h3>4.4 这一层的真正收获</h3>
      <p>修生产代码只完成一半；<strong>测例必须能区分“旧 bug / 新语义”</strong>。维护者改的不是口味，是防回归规格。新人 PR 被 request changes 不是羞辱，是被当成可教的对象。</p>

      <h2 id="05">05. 链路 B · Issue #3632：更危险的静默错误</h2>
      <p>同样由 <strong>TonyBagnall</strong> 开出（2026-07-11）。标签：<code>bug</code>、<code>transformations</code>。标题：<em>Catch22 outlier_norm is silently ignored when use_pycatch22=True</em>。</p>
      <h3>5.1 Issue 正文的诊断（维护者视角）</h3>
      <p>焦点在 <code>Catch22._transform_case_pycatch22</code>：<code>outlier_norm</code> 相关逻辑因 <strong>缺少 elif</strong> 变成死代码/被覆盖。</p>
      <p>Issue 里的伪代码结构是：先有一个 <code>if self.outlier_norm and feature in [3, 4]</code> 在 z-normalised 序列上算；紧接着却是另一个独立的 <code>if feature == 22:</code>……<code>else: features[feature](series)</code>。因为第二个是 <code>if</code> 不是 <code>elif</code>，执行会掉进后面的链，<code>else</code> 用<strong>原始 series</strong> 重算并覆盖结果。</p>
      <p>后果（Issue 写明）：</p>
      <p><code>use_pycatch22=True</code> 时 <code>outlier_norm=True</code> 对输出无影响；与正确处理的 numba 路径不一致；前面做的 z-norm 变成浪费；且会波及构造 <code>Catch22(outlier_norm=True, ...)</code> 的 <code>DrCIF*</code>、<code>CanonicalIntervalForest*</code> 等。</p>
      <p>Expected：应对 <code>DN_OutlierInclude</code> 特征在 z-norm 后计算，与 numba 一致。Issue 甚至写过“One-word change: if → elif”——把修复想象得很小。</p>
      <h3>5.2 Issue 上的其他人</h3>
      <p><strong>w3lld1</strong> 评论 <code>@aeon-actions-bot assign @w3lld1</code> 并成为 assignee。公开记录到此为止——最终合入 main 的修复 PR 是我开的 #3638。开源里“被 assign”与“谁先交出可合并补丁”不必是同一人；事实以 merged PR 为准。</p>

      <h2 id="06">06. 链路 B · PR #3638：我在 Issue 之上补了什么</h2>
      <p>标题：<code>[BUG] fix outlier_norm using wrong feature indices in pycatch22 path</code>。分支：<code>fix/catch22-pycatch22-outlier-norm</code>。Fixes #3632。约 +50/−3，2 文件。</p>
      <h3>6.1 PR 描述里的双修复（比 Issue 的“一字之改”更完整）</h3>
      <p><strong>（1）特征下标</strong>：在 <code>_transform_case_pycatch22</code> 中，<code>outlier_norm</code> 条件误用了 <code>[3, 4]</code>（PR 指出其对应 <code>CO_FirstMin_ac</code>、<code>CO_HistogramAMI_even_2_5</code>），应改为 <code>[13, 14]</code>（<code>DN_OutlierInclude_p_001_mdrmd</code>、<code>DN_OutlierInclude_n_001_mdrmd</code>）。numba 路径 <code>_transform_case</code> 一直用 13/14——双路径应对齐。</p>
      <p><strong>（2）控制流</strong>：<code>if feature == 22:</code> → <code>elif feature == 22:</code>，避免 <code>else</code> 覆盖 <code>outlier_norm</code> 结果（与 Issue 主因一致）。</p>
      <p>也就是说：Issue 强调 elif；我在对照 numba 路径后，认为还存在<strong>下标编号错误</strong>。Tony 在 review 里写 <strong>“Good spot on the misnumbering!”</strong>——维护者接受了这一层加深诊断。</p>
      <h3>6.2 测试策略</h3>
      <p>新增 <code>test_catch22_pycatch22_outlier_norm</code>：用 mock 验证 z-normalised 序列确实传入 <code>DN_OutlierInclude</code>；旧有 catch22 测例保持通过。这比“改完肉眼看一眼”更接近 #3541 学到的：<strong>锁住错误路径回不来</strong>。</p>

      <h2 id="07">07. 链路 B · Review 对话：软依赖 CI 与 skipif</h2>
      <h3>7.1 Tony · Request changes</h3>
      <p>肯定 misnumbering 的同时，指出 CI 的 <code>test-no-soft-deps</code> 失败：新回归测试<strong>无条件 import pycatch22</strong>。而本 PR 测的是 <code>use_pycatch22=True</code> 路径，在软依赖缺失时应 skip。</p>
      <p>他给出项目惯用写法：</p>
      <p><code>from aeon.utils.validation._dependencies import _check_soft_dependencies</code></p>
      <p><code>@pytest.mark.skipif(not _check_soft_dependencies("pycatch22", severity="none"), reason="...")</code></p>
      <p>再在测试函数内 <code>import pycatch22</code>。</p>
      <p>这是第二枚 PR 的关键课：<strong>可选依赖路径的测试，必须尊重 “no soft deps” 矩阵</strong>，否则你在修 bug 的同时制造 CI 红灯。</p>
      <h3>7.2 我 · 公开回复</h3>
      <p><em>“@TonyBagnall Thanks for the review! I've added the @pytest.mark.skipif decorator and fixed the black formatting. Please take a look.”</em></p>
      <p>点名维护者、说明改了什么（skipif + black）、请求再看——短、可扫描、可操作。</p>
      <h3>7.3 Approve 与 Merge</h3>
      <p>Tony 再次 Approve（正文可为空，状态为 APPROVED）并 Merge（2026-07-12）。从开 PR 到合并约半天量级，中间隔着一次明确的测试基础设施修正。</p>

      <h2 id="08">08. 两枚对照：Issue / PR / Review 各扮演什么</h2>
      <p><strong>Issue</strong>：维护者把“什么是错的、修完应怎样”写成公共规格。#3490 偏合约与一致性；#3632 偏静默语义错误与下游分类器影响。两者都由 Tony 开出——我是在<strong>认领已定义的问题</strong>，不是从零发明需求。</p>
      <p><strong>PR</strong>：用最小可审 diff 落地规格，并附测试。#3541 几乎按 Issue 处方执行；#3638 在 Issue 的 elif 之外，用对照阅读补上了下标层，并被维护者确认。</p>
      <p><strong>Review</strong>：两次都是 <code>CHANGES_REQUESTED</code> 后再 <code>APPROVED</code>。第一次教“测试如何证明生命周期”；第二次教“软依赖如何进 CI”。对话风格：具体代码块、可复制改法、合并后给贡献者名分（all-contributors）。</p>
      <p><strong>我的回复模式</strong>：承认要求 → 改 → 推 → 请再看。不争辩“我本地是绿的”。</p>

      <h2 id="09">09. 时间线（便于对照仓库）</h2>
      <p>2026-06-20 · #3490 打开（Tony）</p>
      <p>2026-06-22 · #3541 打开 → request changes → 我回复并改测 → LGTM → merge → all-contributors</p>
      <p>2026-07-11 · #3632 打开（Tony）；w3lld1 assign</p>
      <p>2026-07-12 · #3638 打开 → request changes（skipif）→ 我回复 → approve → merge</p>

      <h2 id="10">10. 若你要交第三枚</h2>
      <p>1. 优先 good first issue / 已写清 Expected 的 bug，先复现再动刀。</p>
      <p>2. PR 描述固定 Problem / Solution / Changes / Testing，并 <code>Fixes #编号</code>。</p>
      <p>3. 标题带仓库约定前缀（如 <code>[BUG]</code>）。</p>
      <p>4. 测例要能区分旧行为；有 soft dependency 就按项目方式 skip。</p>
      <p>5. Review 当规格补丁，不当人身评价；回复写清“我改了哪几点”。</p>

      <h2 id="11">11. 链接索引</h2>
      <p>Issue #3490：<a href="https://github.com/aeon-toolkit/aeon/issues/3490">issues/3490</a></p>
      <p>PR #3541：<a href="https://github.com/aeon-toolkit/aeon/pull/3541">pull/3541</a> · 关闭的前序 <a href="https://github.com/aeon-toolkit/aeon/pull/3525">#3525</a> · 贡献者 PR <a href="https://github.com/aeon-toolkit/aeon/pull/3554">#3554</a></p>
      <p>Issue #3632：<a href="https://github.com/aeon-toolkit/aeon/issues/3632">issues/3632</a></p>
      <p>PR #3638：<a href="https://github.com/aeon-toolkit/aeon/pull/3638">pull/3638</a></p>

      <h2 id="12">12. 结语</h2>
      <p>两枚 PR 教我的不是“我会提 PR”，而是：<strong>Issue 定义战场，PR 提交方案，Review 校准质量，Merge 只是结果状态。</strong></p>
      <p>感谢 TonyBagnall 在两次 request changes 里写下可执行的改法。也感谢 aeon 把 good first issue 写成真能让新人把第一脚踩实的规格。</p>
      <p>下一篇镜头回家：A8-6600K 上的 FnOS，以及还没做的备份。</p>
    `,
  },
  {
    slug: 'homelab-nas',
    title: 'A8-6600K 上的 FnOS：我的家庭 NAS 实装与未完成的备份课',
    date: '2026.07.11',
    dateFull: '2026年07月11日',
    excerpt:
      '真实硬件与软件栈：AMD A8-6600K、FnOS、Docker 十容器、Samba/NFS、远程入口与水星千兆交换。写清楚在跑什么，也写清楚 RAID0 且无备份的风险。',
    category: '硬件/Homelab',
    author: 'Binbim',
    location: '广西贵港 (柳州求学中)',
    content: `
      <p class="lead text-xl md:text-2xl text-zinc-200 font-bold tracking-tight mb-12 md:mb-16 leading-relaxed">
        这不是一份“理想机房购物清单”，而是一台还在喘气的旧 AMD 机器：系统盘告警、数据盘半满、服务很多——备份却还没做。
      </p>

      <h2 id="01">01. 硬件真相</h2>
      <p>主机不是新潮 N100 小盒子，而是一台继续服役的老将：</p>
      <p><strong>CPU</strong>：AMD A8-6600K（4 核）；<strong>内存</strong>：约 12GB 物理（系统侧常看到 ~7.7G 可用总量统计口径因预留/显存映射会有差异）+ <strong>8GB Swap</strong>；<strong>系统盘</strong>：128G 级 SSD/小盘，实际约 108G 分区，<strong>使用率一度到 93%，只剩约 7.8G</strong>——这是当前最响的告警；<strong>数据盘</strong>：约 2T 机械盘（界面约 1.9T，已用约 31% / 570G）；<strong>显卡</strong>：GTX 750（驱动侧有 nvidia-persistenced）。</p>
      <p>它不漂亮，但足够把“家庭服务器”从概念变成 24×7 的进程列表。</p>

      <h2 id="02">02. 系统：FnOS</h2>
      <p>面板与系统底座是 <strong>FnOS（飞牛）</strong>。内置链路大致包括：主服务与应用中心、Nginx 入口、文件/分享/回收站、Docker 管理、Samba（smbd）、NFS、下载中心、媒体相关组件、备份服务框架、网络与安全组件等。</p>
      <p>应用中心里还能看到例如：qBittorrent、媒体/DLNA 相关、书签、ddns-go、SSL 证书工具、以及隧道类进程（如 cloudflared）。这些和“自己用 systemd 拉起的第三方服务”叠在一起，构成完整的日常运维面。</p>

      <h2 id="03">03. 网络：房间里的水星千兆</h2>
      <p>有线侧很务实：房间里接了一台 <strong>水星（MERCURY）千兆傻瓜交换机</strong>，把 NAS 与其它设备拉进同一套二层交换。企业级不企业级不重要，千兆铜缆比“全靠 Wi-Fi 传盘”稳得多。</p>
      <p>内网访问走固定地址规划（家庭局域网段）；对外则同时存在多条“出口哲学”——有的服务只该活在内网，有的通过隧道/反代到达远端。后面单独写原则，不把端口表做成扫描手册。</p>

      <h2 id="04">04. 在跑什么：分层而不是炫多</h2>
      <h3>4.1 Docker 容器（约 10 个在跑）</h3>
      <p>代表画像：</p>
      <p><strong>Gitea</strong>——自建 Git，代码与笔记的私有原点；<strong>Uptime Kuma + 状态页</strong>——谁挂了先知道；<strong>AstrBot / NapCat / EasyBot</strong> 一类机器人与聊天接入；<strong>代理与绕过链路</strong>（如 WARP、Privoxy、FlareSolverr 等）——给特定拉取与自动化用；以及其它内部 API/工具容器（如 resin、grok2api 等）。</p>
      <p>容器的意义不是“堆镜像”，而是：系统盘再崩，compose/卷策略若做好，服务还能重生。眼下系统盘 93% 已用，反而在提醒我：镜像、日志、卷，必须开始做减法与迁移。</p>
      <h3>4.2 Systemd / 自部署服务</h3>
      <p>面板之外，还有一批自己盯的服务，例如：CLI Proxy 与配套面板、Hermes Web UI / 微信 gateway、网易相关 cookie/API 小服务、安全向实验平台、v2rayA + Xray 代理栈、1Panel、PostgreSQL 15（本机回环）、以及 <strong>frpc</strong>（FRP 客户端，把选定服务映射到远端 VPS）。Cloudreve Pro 曾在崩溃循环里——Homelab 的真实日常就是“总有一个在红”。</p>
      <h3>4.3 文件与发现</h3>
      <p>Samba / NFS 负责局域网文件；Avahi / WSDD 等负责设备发现。对家人或自己的电脑来说，NAS 首先是“盘”，其次才是“一堆端口”。</p>

      <h2 id="05">05. 远程与入口：能力与克制</h2>
      <p>我用过/正在用的出口组合包括：<strong>FRP 到 VPS</strong>、<strong>Cloudflare Tunnel</strong>、<strong>ZeroTier</strong>、以及本机代理栈。它们解决的是同一类问题：人在柳州宿舍或外面时，如何回到家里的计算与仓库。</p>
      <p>这里必须写丑话：远程能力越强，攻击面越大。博客里我<strong>不会</strong>列出完整公网映射表、VPS 地址或任何账号口令。原则比端口重要——</p>
      <p>能内网解决的不暴露；必须暴露的走隧道/鉴权/最小权限；面板与 SSH 绝不能“图方便全世界可撞库”；机器人与 API 密钥按泄漏默认轮换。</p>
      <p>若你读到这里想学架构：学分层与最小暴露，不要学把全家端口贴到公网。</p>

      <h2 id="06">06. 存储策略：我现在的不及格项</h2>
      <p>数据盘侧当前是 <strong>RAID0 思路/条带化取向的性能向配置，并且没有第二副本备份</strong>。这句话应该加粗再加粗：</p>
      <p><strong>RAID0 不是备份。任何一块盘挂掉，都可能让整组数据一起消失。没有异机/异地副本，等于把三年文件绑在同一根绳上。</strong></p>
      <p>系统盘 93% 已用是另一颗雷：更新、日志、Docker 层，随时可能把系统写满导致服务雪崩。</p>
      <p>下一步（写进公开计划，逼自己执行）：</p>
      <p>1. 立刻清理系统盘（日志、旧镜像、无用卷），把水位压回安全线。</p>
      <p>2. 重要目录（Gitea 仓库、关键配置、照片/证件扫描件）做<strong>定期冷备</strong>到移动硬盘或另一台机器。</p>
      <p>3. 评估从 RAID0 迁到至少“可坏一块盘”或“单盘 + 完整备份”的策略——性能可以让，数据不能让。</p>
      <p>4. 给 Uptime Kuma 加上磁盘与备份任务监控，不只是 HTTP 200。</p>

      <h2 id="07">07. 资源画像（写作时的快照）</h2>
      <p>CPU 负载大约 0.7–1.5 波动；内存高压但不至于完全死锁，Swap 有占用；数据盘还早，系统盘告急。GTX 750 更多是历史硬件残留与少数加速/显示相关，不是训练卡梦。</p>
      <p>Homelab 的诚实报表，应该同时包含“我跑通了什么”和“我还在赌什么”。</p>

      <h2 id="08">08. 和网络工程专业的关系</h2>
      <p>在这台机器上，交换、网段、隧道、代理、Samba、Docker 网桥、OVS 痕迹、防火墙与暴露面，全是会咬人的实物课。选网络工程不是为了告别写代码，而是为了让“家里这摊服务”从玄学变成可解释系统。</p>
      <p>下一篇写人：2026 年入学柳州城市职业学院网络工程——平行志愿里靠前被录，以及我如何把既定专业走成自己的主线。</p>
    `,
  },
  {
    slug: 'why-network-engineering',
    title: '平行志愿里的网络工程：2026，我在柳州城职的真实开局',
    date: '2026.07.12',
    dateFull: '2026年07月12日',
    excerpt:
      '不是神话般的“从小立志网工”。平行志愿靠前被录取、职高到大专、偏见与第二成绩单，以及若换专业我仍会自学网络与写代码。',
    category: '求学/成长',
    author: 'Binbim',
    location: '广西贵港 (柳州求学中)',
    content: `
      <p class="lead text-xl md:text-2xl text-zinc-200 font-bold tracking-tight mb-12 md:mb-16 leading-relaxed">
        先把叙事校准：我不是在高考作文里“毕生追求网络工程”，我是在平行志愿的真实位次里，被计算机网络工程录取——然后决定认真把它走成主线。
      </p>

      <h2 id="01">01. 坐标与时间</h2>
      <p>籍贯：<strong>广西贵港</strong>。求学地：<strong>柳州</strong>。学校全称：<strong>柳州城市职业学院</strong>。专业：<strong>计算机网络工程</strong>。入学：<strong>2026 年</strong>。</p>
      <p>GitHub：<strong>BB0813</strong>。公开身份常用 Binbim。</p>
      <p>职高三年已经在柳州度过；大专又是一个三年。地图上挪得不多，但角色要从“会折腾的学生”切到“有专业课表约束的学生”。</p>

      <h2 id="02">02. 录取：平行志愿，靠前且被录</h2>
      <p>真实表述是：</p>
      <p><strong>网络工程在我的平行志愿里位置靠前，并最终被录取。</strong></p>
      <p>这不是“调剂到一个完全陌生的专业”的苦情戏，也不是“全场只报这一个”的浪漫戏。它是志愿表、分数段、院校专业组与当时判断共同作用的结果。我愿意承认：<strong>路径有偶然，态度必须必然。</strong></p>
      <p>被录之后，我没有把专业当牢笼，也没有假装一切命中注定。我做的是：盘点自己已经会的、明确还缺的，把“网络工程”从录取通知书上的四个字，落成未来三年的训练大纲。</p>

      <h2 id="03">03. 若录的是别的专业</h2>
      <p>假设题我只答一句真话：</p>
      <p><strong>即便当时录到别的专业，我大概率仍会自学网络，也仍会写代码。</strong></p>
      <p>家里那台 FnOS、开源上的 PR、这个博客，都不依赖某张通知书才合法存在。专业提供的是系统课程、实验环境、同学与老师、以及对外解释自己的一条主通道——不是创造力的开关。</p>

      <h2 id="04">04. 我已经会什么，课表还要补什么</h2>
      <h3>4.1 已有</h3>
      <p>Web / 前端与站点工程；Python 与自动化；GitHub 协作与至少两枚已合并的 aeon PR（#3541 克隆合约、#3638 catch22/pycatch22）；Linux 与自建服务（Docker、代理、Git、监控）；家庭 NAS 的实操直觉（含踩坑）。</p>
      <h3>4.2 缺口</h3>
      <p>系统化的网络理论与实验报告能力；交换路由与排障的规范流程；安全与运维在“可交作业/可上岗”层面的完整度；把 Homelab 从“能跑”提升到“可恢复、有备份、有文档”。</p>
      <p>所以：我不是零基础来学电脑的；我是带着半套实战经验，来补齐网络主科的人。</p>

      <h2 id="05">05. 为什么“网络”仍然说得通</h2>
      <p>即便志愿过程很现实，专业方向与我的长期兴趣仍同向：</p>
      <p>应用框架会换，连接与系统问题会反复以新马甲出现；我在 NAS、隧道、代理、Samba 上已经提前交过学费；我希望自己的标签是 <strong>会写软件的网络工程学生</strong>，而不是只会改 Wi-Fi 密码，或只会对着框架调 UI。</p>
      <p>选择逻辑可以事后讲得很漂亮，但底色仍是：<strong>录取给我轨道，我负责把车开稳，并铺自己的第二条轨（开源与作品）。</strong></p>

      <h2 id="06">06. 偏见、学历与第二成绩单</h2>
      <p>职高 / 大专 / 地方院校——这些词在互联网上常被拿来排序。我的对策不是骂街，而是交验证据：</p>
      <p><strong>第一成绩单</strong>：课程、绩点、证书——按学校规则认真完成。</p>
      <p><strong>第二成绩单</strong>：GitHub（BB0813）、Merged PR、可访问的博客与可演示的 Homelab/项目。</p>
      <p>别人可以刻板印象，我可以把仓库与文章留在公开网络上。时间会稀释话术，不会稀释 commit 记录。</p>

      <h2 id="07">07. 三年计划（可执行，可打脸）</h2>
      <h3>大一：地基</h3>
      <p>网络基础课与实验全勤；Linux 日常化；每月至少一篇实验/排障笔记（可以发本站）；把 NAS 备份做成“已完成”而不是“计划中”。</p>
      <h3>大二：协议 + 工程</h3>
      <p>交换路由、安全、服务器方向吃透；Homelab 文档化（拓扑、恢复步骤）；开源贡献保持小而净的节奏。</p>
      <h3>大三：作品集收敛</h3>
      <p>2–3 个能讲清的作品：家庭/宿舍网络方案、带监控与备份的私有服务、一组有深度的贡献或项目；考证服务目标，不盲从。</p>

      <h2 id="08">08. 结语</h2>
      <p>2026，我是柳州城市职业学院计算机网络工程的新生，也是 GitHub 上的 BB0813。</p>
      <p>平行志愿决定了入口，决定不了出口。出口要靠课表、实验、备份策略、下一枚 PR，以及把故事写真实的习惯。</p>
      <p>下一篇写这个博客本身：为什么最终是 React + Vite 的极简骨架，以及你怎么往 <code>posts.ts</code> 里加下一篇。</p>
    `,
  },
  {
    slug: 'blog-rebuild',
    title: 'Binbim-Blog 骨架说明：如何用 posts.ts 发布长文',
    date: '2026.07.13',
    dateFull: '2026年07月13日',
    excerpt:
      '针对当前仓库的实作说明：路由、数据层、排版、GitHub Pages base，以及新增文章的唯一标准动作。',
    category: '技术教程',
    author: 'Binbim',
    location: '广西贵港 (柳州求学中)',
    content: `
      <p class="lead text-xl md:text-2xl text-zinc-200 font-bold tracking-tight mb-12 md:mb-16 leading-relaxed">
        这个仓库没有假装自己是完整 CMS。它是一个能部署、能写长文、能按 slug 打开的极简博客——而文章的唯一源，是 <code>src/data/posts.ts</code>。
      </p>

      <h2 id="01">01. 仓库是什么</h2>
      <p>项目名：<strong>Binbim-Blog</strong>。技术栈：<strong>React 18 + TypeScript + Vite + Tailwind + Motion + React Router</strong>。</p>
      <p>README 里可能还残留“大而全个人博客系统”的历史描述；以当前代码为准时，运行时只有：</p>
      <p>首页列表；文章详情；深色长文排版；GitHub Pages 子路径部署配置。</p>
      <p>作者 GitHub：<strong>BB0813</strong>。在线形态服务于个人写作，而不是多用户内容平台。</p>

      <h2 id="02">02. 路由</h2>
      <p><code>src/App.tsx</code> 注册两条路由：</p>
      <p><code>/</code> → <code>Home</code></p>
      <p><code>/post/:slug</code> → <code>Post</code></p>
      <p><code>basename</code> 取自 <code>import.meta.env.BASE_URL</code>（构建时由 Vite 的 <code>base</code> 注入）。当前 <code>vite.config.ts</code> 里是 <code>base: '/Binbim-Blog/'</code>，以匹配 GitHub Pages 项目站路径。</p>

      <h2 id="03">03. 文章数据层</h2>
      <p>文件：<code>src/data/posts.ts</code>。</p>
      <p>每篇文章一个对象，字段包括：</p>
      <p><code>slug</code>、<code>title</code>、<code>date</code>（列表用，如 2026.07.13）、<code>dateFull</code>（详情用）、<code>excerpt</code>、<code>category</code>、<code>author</code>、<code>location</code>、<code>content</code>（HTML 字符串）。</p>
      <p>辅助函数：</p>
      <p><code>getAllPosts()</code>：拷贝数组并按 <code>date</code> 降序，给首页；</p>
      <p><code>getPostBySlug(slug)</code>：详情页查找；找不到则渲染“文章未找到”。</p>
      <p>首页 <code>Home.tsx</code> 不再内嵌死数据；详情 <code>Post.tsx</code> 不再写死唯一一篇。</p>

      <h2 id="04">04. 新增一篇文章的标准动作</h2>
      <p>1. 打开 <code>src/data/posts.ts</code>。</p>
      <p>2. 在 <code>posts</code> 数组中追加一个对象（建议放在数组前部或任意位置，列表会按日期排序）。</p>
      <p>3. <code>slug</code> 用小写短横线，发布后尽量永不改动（改 slug 等于改 URL）。</p>
      <p>4. <code>content</code> 使用与现文一致的 HTML 小节：<code>h2</code> / <code>h3</code> / <code>p</code> / <code>strong</code> / <code>code</code> / 链接，以便吃到 <code>.prose-custom</code>。</p>
      <p>5. 本地执行 <code>npm run dev</code>，打开 <code>/post/你的-slug</code> 检查。</p>
      <p>6. <code>npm run build</code> 后按原 GitHub Actions / Pages 流程部署。</p>
      <p>不需要改路由表，不需要新建 React 页面文件——除非你要新栏目，而不是新文章。</p>

      <h2 id="05">05. 排版与视觉</h2>
      <p><code>src/index.css</code> 定义 <code>--accent</code>（当前为绿色强调）与 <code>.prose-custom</code>：大标题左侧竖线、段落间距、引用、行内代码等。首页与详情用 Motion 做轻量入场，不抢阅读。</p>
      <p>正文目前是 HTML 字符串 + <code>dangerouslySetInnerHTML</code>。这是刻意的简单：单人长文站优先“写得进去”，而不是先上完整 Markdown 流水线。等文章量与协作需求上来，再在构建期接入 gray-matter + marked/remark 不迟。</p>

      <h2 id="06">06. 工程脚本</h2>
      <p><code>npm run dev</code> 开发；<code>npm run build</code> 生产构建；<code>npm run type-check</code> / <code>lint</code> / <code>format</code> 质量；<code>npm run test</code> 串起 lint + 类型 + 格式检查。</p>
      <p>路径别名：<code>@/*</code> → <code>src/*</code>（见 <code>tsconfig.json</code> 与 Vite resolve.alias）。</p>

      <h2 id="07">07. 什么时候再加功能</h2>
      <p>按痛点加，不按幻想加：</p>
      <p>手写 HTML 痛了 → Markdown 构建管线；翻不到旧文 → 搜索/标签；出现真实讨论 → 评论；文章 &gt; 十几篇 → 归档页。</p>
      <p>顺序错误的代价我已经付过一次：先设计“大系统”，最后发现真正稀缺的是可持续的写作与真实内容。</p>

      <h2 id="08">08. 结语</h2>
      <p>骨架的意义是降低发布摩擦。aeon 的 PR、FnOS 上的服务列表、平行志愿后的三年计划——都应该能在 <code>posts.ts</code> 里找到位置。</p>
      <p>下一篇不会写在教程里，会写在数组的下一项。你若 fork，删掉我的故事，留下结构，填上你的坐标即可。</p>
    `,
  },
];

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getAllPosts(): Post[] {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date));
}
