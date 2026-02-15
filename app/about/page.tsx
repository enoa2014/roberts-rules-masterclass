import { PageShell } from "@/components/page-shell";
import { Mail, MapPin } from "lucide-react";

export default function AboutPage() {
  return (
    <PageShell title="关于我们" description="致力于推动公共议事规则的普及与实践">
      <div className="grid md:grid-cols-2 gap-12 mt-8">
        <div className="space-y-6 text-gray-600 leading-relaxed">
          <p>
            "议起读"是一个专注于青少年公共议事能力培养的教育平台。我们相信，
            规则意识与契约精神是现代公民的核心素养。
          </p>
          <p>
            通过引入《罗伯特议事规则》并进行本土化适配，我们开发了一套适合
            中国青少年的课程体系。不仅仅是教规则，更是通过模拟会议、
            社群共学等方式，让孩子们在实践中学会表达观点、尊重异见、
            达成共识。
          </p>
          <div className="pt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">联系方式</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <span>contact@yiqidu.com</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <span>北京市海淀区中关村大街</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-gray-100 rounded-2xl p-8 flex flex-col justify-center">
          <h3 className="text-xl font-bold text-gray-900 mb-6">加入我们在行动</h3>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h4 className="font-bold text-gray-900 mb-2">我是家长/学生</h4>
              <p className="text-sm text-gray-500 mb-4">希望参与课程学习？</p>
              <a href="/register" className="text-primary text-sm font-medium hover:underline">
                立即注册账号 &rarr;
              </a>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h4 className="font-bold text-gray-900 mb-2">我是教育工作者</h4>
              <p className="text-sm text-gray-500 mb-4">有意引入课程或成为讲师？</p>
              <a href="mailto:partner@yiqidu.com" className="text-primary text-sm font-medium hover:underline">
                联系商务合作 &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
