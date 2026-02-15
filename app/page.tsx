import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Users,
  Award,
  Zap,
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
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* ===== Hero Section ===== */}
      <section className="relative overflow-hidden gradient-hero py-24 md:py-32">
        {/* Decorative blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl" />

        <div className="container max-w-5xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/60 bg-white/60 backdrop-blur-sm px-4 py-1.5 text-sm text-blue-700 font-medium mb-8 animate-fadeInUp">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulseSoft" />
            议起读平台 2.0 正式发布
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.15] animate-fadeInUp delay-100">
            掌握公共议事规则 <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              提升公民核心素养
            </span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed animate-fadeInUp delay-200">
            从理论学习到模拟议事，全方位掌握罗伯特议事规则。
            加入我们，在实践中学会表达、倾听与决策。
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10 animate-fadeInUp delay-300">
            <Link href="/course" className="button h-13 px-8 text-base shadow-lg shadow-blue-500/20 rounded-xl">
              开始学习 <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link href="/about" className="button-secondary h-13 px-8 text-base rounded-xl">
              了解更多
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Stats Section ===== */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "12+", label: "精品课程" },
              { value: "500+", label: "活跃学员" },
              { value: "50+", label: "模拟会议" },
              { value: "98%", label: "好评率" },
            ].map((stat, i) => (
              <div key={stat.label} className={`animate-fadeInUp delay-${(i + 1) * 100}`}>
                <div className="text-3xl md:text-4xl font-extrabold text-primary">{stat.value}</div>
                <div className="mt-1 text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Feature Grid ===== */}
      <section className="py-20 md:py-24 bg-white">
        <div className="container max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
              为什么选择议起读？
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-xl mx-auto">
              理论与实践相结合的系统化学习方案
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={BookOpen}
              title="系统课程"
              description="由浅入深的课程体系，从基础概念到高阶应用全覆盖。"
              color="blue"
            />
            <FeatureCard
              icon={Zap}
              title="互动课堂"
              description="实时投票、举手发言，还原真实的议事会议场景。"
              color="amber"
            />
            <FeatureCard
              icon={Users}
              title="社群共学"
              description="与志同道合的伙伴一起练习，在讨论中共同进步。"
              color="emerald"
            />
            <FeatureCard
              icon={Award}
              title="能力认证"
              description="完成课程与挑战，获得官方认证的结业证书。"
              color="violet"
            />
          </div>
        </div>
      </section>

      {/* ===== Quick Entry ===== */}
      <section className="py-16 md:py-20 bg-slate-50 border-y border-gray-100">
        <div className="container max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
              快速入口
            </h2>
            <p className="mt-3 text-gray-500">
              从首页直接进入学习、互动与管理相关页面
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {quickEntries.map((entry) => (
              <QuickEntryCard key={entry.href} entry={entry} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== Learning Path ===== */}
      <section className="py-20 md:py-24 gradient-hero">
        <div className="container max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
              你的学习路径
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              三步开启议事规则学习之旅
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "注册加入", desc: "创建账号并输入邀请码，立即解锁全部课程内容。" },
              { step: "02", title: "系统学习", desc: "跟随课程体系，从基础原则到高阶应用循序渐进。" },
              { step: "03", title: "模拟实战", desc: "参与互动课堂，在模拟会议中真实演练所学规则。" },
            ].map((item, i) => (
              <div key={item.step} className={`bg-white rounded-2xl p-8 shadow-soft border border-gray-100 text-center hover-card animate-fadeInUp delay-${(i + 1) * 100}`}>
                <div className="text-5xl font-extrabold text-primary/10 mb-4">{item.step}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA Section ===== */}
      <section className="py-20 md:py-24">
        <div className="container max-w-4xl">
          <div className="gradient-primary rounded-3xl p-12 md:p-16 text-center text-white relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
            <div className="relative z-10">
              <Star className="h-12 w-12 mx-auto mb-6 text-blue-200" />
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
                准备好开始了吗？
              </h2>
              <p className="text-blue-100 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
                注册账号并输入邀请码，即可解锁全部课程内容与互动功能。加入议起读，与数百名同学一同成长。
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register" className="inline-flex items-center justify-center h-13 px-8 rounded-xl bg-white text-primary font-semibold text-base hover:bg-gray-50 hover:shadow-lg transition-all duration-200 cursor-pointer">
                  立即注册 <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link href="/course" className="inline-flex items-center justify-center h-13 px-8 rounded-xl border-2 border-white/30 text-white font-semibold text-base hover:bg-white/10 transition-all duration-200 cursor-pointer">
                  浏览课程
                </Link>
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
};

const quickEntries: QuickEntry[] = [
  { title: "课程总览", href: "/course", icon: BookOpen },
  { title: "学习中心", href: "/rules", icon: BookOpen },
  { title: "阅读探究", href: "/reading", icon: LibraryBig },
  { title: "工具库", href: "/tools", icon: Wrench },
  { title: "资源中心", href: "/resources", icon: FolderOpen },
  { title: "互动课堂", href: "/interact", icon: Users },
  { title: "作业复盘", href: "/homework", icon: FileText },
  { title: "留言讨论", href: "/discussion", icon: MessageSquare },
  { title: "输入邀请码", href: "/invite", icon: KeyRound },
  { title: "管理后台", href: "/admin", icon: LayoutDashboard },
  { title: "关于课程", href: "/about", icon: Info },
  { title: "常见问题", href: "/faq", icon: HelpCircle },
];

function QuickEntryCard({ entry }: { entry: QuickEntry }) {
  const Icon = entry.icon;

  return (
    <Link
      href={entry.href}
      className="group rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 cursor-pointer"
    >
      <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-sm font-semibold text-gray-800 group-hover:text-primary transition-colors">
        {entry.title}
      </div>
    </Link>
  );
}

const colorMap: Record<string, { bg: string; icon: string; border: string }> = {
  blue: { bg: "bg-blue-50", icon: "text-blue-600", border: "hover:border-blue-200" },
  amber: { bg: "bg-amber-50", icon: "text-amber-600", border: "hover:border-amber-200" },
  emerald: { bg: "bg-emerald-50", icon: "text-emerald-600", border: "hover:border-emerald-200" },
  violet: { bg: "bg-violet-50", icon: "text-violet-600", border: "hover:border-violet-200" },
};

function FeatureCard({
  icon: Icon,
  title,
  description,
  color = "blue",
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: string;
}) {
  const c = colorMap[color] || colorMap.blue;
  return (
    <div className={`group flex flex-col items-center text-center p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer ${c.border}`}>
      <div className={`h-14 w-14 ${c.bg} ${c.icon} rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110`}>
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
