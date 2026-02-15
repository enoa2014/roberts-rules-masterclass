import Link from "next/link";
import { ArrowRight, BookOpen, Users, Award, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem-1px)]">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center text-center py-20 px-4 bg-gradient-to-b from-blue-50 to-white">
        <div className="container max-w-4xl space-y-8">
          <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-800">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2"></span>
            议起读平台 2.0 正式发布
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900">
            掌握公共议事规则 <br className="hidden sm:block" />
            <span className="text-primary">提升公民核心素养</span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            从理论学习到模拟以此，全方位掌握罗伯特议事规则。
            加入我们，在实践中学会表达、倾听与决策。
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/course" className="button h-12 px-8 text-base shadow-lg shadow-blue-500/20">
              开始学习 <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link href="/about" className="button bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 h-12 px-8 text-base">
              了解更多
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">为什么选择议起读？</h2>
            <p className="mt-4 text-lg text-gray-600">理论与实践相结合的系统化学习方案</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={BookOpen}
              title="系统课程"
              description="由浅入深的课程体系，从基础概念到高阶应用全覆盖。"
            />
            <FeatureCard
              icon={Zap}
              title="互动课堂"
              description="实时投票、举手发言，还原真实的议事会议场景。"
            />
            <FeatureCard
              icon={Users}
              title="社群共学"
              description="与志同道合的伙伴一起练习，在讨论中共同进步。"
            />
            <FeatureCard
              icon={Award}
              title="能力认证"
              description="完成课程与挑战，获得官方认证的结业证书。"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100">
      <div className="h-12 w-12 bg-blue-100 text-primary rounded-xl flex items-center justify-center mb-6">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
