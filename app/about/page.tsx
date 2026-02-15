import { PageShell } from "@/components/page-shell";
import { Mail, MapPin, ArrowRight, Heart, Lightbulb, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <PageShell title="关于我们" description="致力于推动公共议事规则的普及与实践">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Story */}
        <div className="space-y-6">
          <div className="space-y-5 text-gray-600 leading-relaxed">
            <p>
              <strong className="text-gray-900">「议起读」</strong>是一个专注于青少年公共议事能力培养的教育平台。我们相信，
              规则意识与契约精神是现代公民的核心素养。
            </p>
            <p>
              通过引入《罗伯特议事规则》并进行本土化适配，我们开发了一套适合
              中国青少年的课程体系。不仅仅是教规则，更是通过模拟会议、
              社群共学等方式，让孩子们在实践中学会表达观点、尊重异见、
              达成共识。
            </p>
          </div>

          {/* Values */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            {[
              { icon: Heart, label: "尊重", desc: "倾听与包容" },
              { icon: Lightbulb, label: "理性", desc: "逻辑与规则" },
              { icon: Users, label: "协作", desc: "共识与行动" },
            ].map((v) => (
              <div key={v.label} className="text-center p-4 rounded-xl bg-gray-50 border border-gray-100">
                <v.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="font-bold text-gray-900 text-sm">{v.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{v.desc}</div>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="pt-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">联系方式</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-600">
                <div className="h-9 w-9 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Mail className="h-4.5 w-4.5 text-primary" />
                </div>
                <span className="text-sm">contact@yiqidu.com</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                <div className="h-9 w-9 bg-blue-50 rounded-lg flex items-center justify-center">
                  <MapPin className="h-4.5 w-4.5 text-primary" />
                </div>
                <span className="text-sm">北京市海淀区中关村大街</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column - CTA Cards */}
        <div className="space-y-5">
          <div className="gradient-hero rounded-2xl p-8 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">加入我们的行动</h3>
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
                <h4 className="font-bold text-gray-900 mb-2">我是家长 / 学生</h4>
                <p className="text-sm text-gray-500 mb-4">希望参与课程学习？</p>
                <a href="/register" className="inline-flex items-center text-primary text-sm font-semibold hover:text-primary/80 transition-colors">
                  立即注册账号 <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
                <h4 className="font-bold text-gray-900 mb-2">我是教育工作者</h4>
                <p className="text-sm text-gray-500 mb-4">有意引入课程或成为讲师？</p>
                <a href="mailto:partner@yiqidu.com" className="inline-flex items-center text-primary text-sm font-semibold hover:text-primary/80 transition-colors">
                  联系商务合作 <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
