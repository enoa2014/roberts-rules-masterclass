import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Users,
  Award,
  Star,
  LibraryBig,
  Wrench,
  FolderOpen,
  MessageSquare,
  FileText,
  KeyRound,
  Info,
  HelpCircle,
  LayoutDashboard,
  Vote,
  Scale,
  Gavel,
  Crown,
  Target,
  TrendingUp,
  Sparkles,
  Globe,
  Shield,
  UserPlus,
  Palette,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export default function ClassicHomeView() {
  return (
    <div className="flex flex-col pt-20">
      {/* ===== 英雄区 ===== */}
      <section className="relative overflow-hidden py-20 md:py-28 gradient-hero">
        <div className="absolute inset-0 parliament-pattern"></div>
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }}></div>

        <div className="container max-w-6xl text-center relative z-10">
          <h1 className="tracking-tight leading-[1.1] mb-6 text-hero text-gray-900 animate-fadeInUp delay-100">
            掌握议事规则 <br className="hidden sm:block" />
            <span className="text-gradient-political relative">
              提升课堂沟通素养
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-amber-500 rounded-full opacity-30"></div>
            </span>
          </h1>

          <p className="max-w-3xl mx-auto leading-relaxed mb-10 text-body text-gray-600 animate-fadeInUp delay-200">
            从理论学习到模拟演练，全方位掌握罗伯特议事规则。
            <br className="hidden md:block" />
            面向教师与家长的系统培训，支持更清晰的表达与协作。
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12 animate-fadeInUp delay-300">
            <Link href="/course" className="group inline-flex items-center gap-3 btn btn-primary">
              <BookOpen className="h-5 w-5" />
              <span>开始学习</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/about" className="group inline-flex items-center gap-3 btn btn-ghost">
              <Info className="h-5 w-5" />
              <span>了解更多</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-7 animate-fadeInUp delay-400">
            {CLASSIC_STATS.map((stat, i) => (
              <div key={stat.label} className={`text-center animate-scaleIn delay-${(i + 5) * 100}`}>
                <div className="flex items-center justify-center mb-3">
                  <div className={`p-3 shadow-lg bg-white ${stat.color} rounded-2xl`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-1 text-gray-900">{stat.value}</div>
                <div className="font-mono text-sm uppercase tracking-wide text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 特色功能区 ===== */}
      <section className="py-24 md:py-32 relative bg-white">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white"></div>
        <div className="container max-w-7xl relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-mono font-semibold mb-6 bg-blue-50 border border-blue-200 text-blue-700 animate-fadeInUp">
              <Sparkles className="h-4 w-4" />
              <span className="uppercase tracking-wide">核心优势</span>
            </div>
            <h2 className="mb-6 text-display text-gray-900 animate-fadeInUp delay-100">为什么选择议起读？</h2>
            <p className="max-w-2xl mx-auto text-body text-gray-600 animate-fadeInUp delay-200">
              理论与实践相结合的系统化学习方案，帮助教师与家长形成可落地的课堂沟通方法
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {CLASSIC_FEATURES.map((feature, i) => (
              <FeatureCard key={feature.title} feature={feature} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== 快速导航区 ===== */}
      <section className="py-20 md:py-24 relative bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="absolute inset-0 parliament-pattern opacity-30"></div>
        <div className="container max-w-7xl relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-mono font-semibold mb-6 bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 animate-fadeInUp">
              <Target className="h-4 w-4" />
              <span className="uppercase tracking-wide">快速导航</span>
            </div>
            <h2 className="mb-4 text-display text-gray-900 animate-fadeInUp delay-100">快速入口</h2>
            <p className="text-body text-gray-600 animate-fadeInUp delay-200">从首页直接进入学习、互动与管理相关页面</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {quickEntries.map((entry, index) => (
              <QuickEntryCard key={entry.href} entry={entry} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== 学习路径区 ===== */}
      <section className="py-24 md:py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
        <div className="container max-w-6xl relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-mono font-semibold mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 text-blue-700 animate-fadeInUp">
              <TrendingUp className="h-4 w-4" />
              <span className="uppercase tracking-wide">学习路径</span>
            </div>
            <h2 className="mb-6 text-display text-gray-900 animate-fadeInUp delay-100">你的学习路径</h2>
            <p className="max-w-2xl mx-auto text-body text-gray-600 animate-fadeInUp delay-200">
              三步开启议事规则学习之旅，从新手到熟练的完整成长路径
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-1/3 right-1/3 h-px bg-gradient-to-r from-blue-200 via-purple-200 to-amber-200 transform -translate-y-1/2 z-0"></div>
            {CLASSIC_STEPS.map((item, i) => (
              <div key={item.step} className={`relative z-10 animate-fadeInUp delay-${(i + 1) * 100}`}>
                <div className="p-8 text-center group card hover-lift">
                  <div className="relative mb-6">
                    <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 ${item.bg}`}>
                      <item.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center">
                      <span className="font-mono text-xs font-bold text-gray-600">{item.step}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-4 text-gray-900">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA 区域 ===== */}
      <section className="py-24 md:py-32 relative overflow-hidden gradient-political">
        <div className="absolute inset-0 parliament-pattern opacity-10"></div>

        <div className="container max-w-5xl relative z-10">
          <div className="text-center text-white">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-mono font-semibold mb-8 bg-white/10 backdrop-blur-sm border border-white/20 animate-fadeInUp">
              <Star className="h-4 w-4 text-amber-300" />
              <span className="uppercase tracking-wide">立即开始</span>
            </div>

            <h2 className="mb-6 text-display animate-fadeInUp delay-100">准备好开始了吗？</h2>

            <p className="max-w-2xl mx-auto mb-12 leading-relaxed text-body text-blue-100 animate-fadeInUp delay-200">
              注册账号并输入邀请码，即可解锁全部课程内容与互动功能。
              <br className="hidden md:block" />
              加入议起读，与更多教师与家长共同成长，形成可落地的课堂协作方法。
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fadeInUp delay-300">
              <Link href="/register" className="group inline-flex items-center gap-3 btn btn-accent shadow-accent">
                <UserPlus className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span>立即注册</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/course" className="group inline-flex items-center gap-3 btn btn-ghost border-white/30 text-white hover:bg-white/10">
                <Globe className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span>浏览课程</span>
              </Link>
            </div>

            <div className="mt-16 pt-8 border-t border-white/20 animate-fadeInUp delay-400">
              <p className="font-mono text-sm text-blue-200 mb-4 uppercase tracking-wide">已有 500+ 学员加入我们</p>
              <div className="flex justify-center items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current text-amber-300" />
                ))}
                <span className="ml-2 font-semibold text-blue-100">4.9/5.0 学员评分</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

type QuickEntry = {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
};

type HomeFeature = {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
};

const CLASSIC_STATS = [
  { icon: Users, value: "500+", label: "活跃学员", color: "text-blue-600" },
  { icon: BookOpen, value: "12+", label: "精品课程", color: "text-purple-600" },
  { icon: Vote, value: "50+", label: "模拟会议", color: "text-amber-600" },
  { icon: Award, value: "98%", label: "好评率", color: "text-green-600" },
];

const CLASSIC_FEATURES: HomeFeature[] = [
  {
    icon: Scale,
    title: "系统课程",
    description: "由浅入深的课程体系，从基础概念到高阶应用全覆盖，建立完整的课堂规则框架。",
    gradient: "from-blue-500 to-blue-600",
  },
  {
    icon: Zap,
    title: "互动课堂",
    description: "实时投票、举手发言，还原课堂讨论场景，在实践中掌握规则精髓。",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: Users,
    title: "社群共学",
    description: "与同行教师与家长一起练习，在讨论中共同进步，形成学习共同体。",
    gradient: "from-emerald-500 to-green-500",
  },
  {
    icon: Crown,
    title: "能力认证",
    description: "完成课程与挑战，获得官方认证的结业证书，证明你的课堂沟通能力水平。",
    gradient: "from-violet-500 to-purple-500",
  },
];

const CLASSIC_STEPS = [
  {
    step: "01",
    title: "注册加入",
    desc: "创建账号并输入邀请码，立即解锁全部课程内容，开始你的学习之旅。",
    icon: Shield,
    bg: "bg-gradient-to-br from-blue-500 to-blue-600",
  },
  {
    step: "02",
    title: "系统学习",
    desc: "跟随课程体系，从基础原则到高阶应用循序渐进，建立完整知识体系。",
    icon: BookOpen,
    bg: "bg-gradient-to-br from-purple-500 to-purple-600",
  },
  {
    step: "03",
    title: "模拟实战",
    desc: "参与互动课堂，在模拟会议中真实演练所学规则，提升实践能力。",
    icon: Gavel,
    bg: "bg-gradient-to-br from-amber-500 to-orange-500",
  },
];

const quickEntries: QuickEntry[] = [
  { title: "课程总览", href: "/course", icon: BookOpen, description: "浏览所有课程" },
  { title: "学习中心", href: "/rules", icon: Scale, description: "议事规则学习" },
  { title: "阅读探究", href: "/reading", icon: LibraryBig, description: "深度阅读材料" },
  { title: "工具库", href: "/tools", icon: Wrench, description: "实用工具集合" },
  { title: "资源中心", href: "/resources", icon: FolderOpen, description: "学习资源下载" },
  { title: "互动课堂", href: "/interact", icon: Users, description: "实时互动学习" },
  { title: "作业复盘", href: "/homework", icon: FileText, description: "作业与反思" },
  { title: "留言讨论", href: "/discussion", icon: MessageSquare, description: "社区讨论" },
  { title: "输入邀请码", href: "/invite", icon: KeyRound, description: "激活学习权限" },
  { title: "风格实验室", href: "/style-lab", icon: Palette, description: "20种首页提案" },
  { title: "管理后台", href: "/admin", icon: LayoutDashboard, description: "系统管理" },
  { title: "关于课程", href: "/about", icon: Info, description: "了解更多信息" },
  { title: "常见问题", href: "/faq", icon: HelpCircle, description: "FAQ 帮助" },
];

function QuickEntryCard({ entry, index }: { entry: QuickEntry; index: number }) {
  const Icon = entry.icon;

  return (
    <Link
      href={entry.href}
      className={`group cursor-pointer card p-6 hover-lift animate-scaleIn delay-${(index % 6 + 1) * 50}`}
    >
      <div className="flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 bg-gradient-to-br from-blue-500 to-blue-600 text-white group-hover:shadow-political group-hover:scale-110">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="font-semibold mb-2 transition-colors text-gray-900 group-hover:text-blue-600">
          {entry.title}
        </h3>
        {entry.description && (
          <p className="font-mono text-xs uppercase tracking-wide text-gray-500">
            {entry.description}
          </p>
        )}
      </div>
    </Link>
  );
}

function FeatureCard({ feature, index }: { feature: HomeFeature; index: number }) {
  const Icon = feature.icon;

  return (
    <div className={`p-8 group card hover-lift animate-fadeInUp delay-${(index + 3) * 100}`}>
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 bg-gradient-to-br ${feature.gradient} text-white group-hover:shadow-xl group-hover:scale-110`}>
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-xl font-bold mb-4 transition-colors text-gray-900 group-hover:text-blue-600">
        {feature.title}
      </h3>
      <p className="text-sm leading-relaxed text-gray-600">{feature.description}</p>
    </div>
  );
}
