"use client";

import { PageShell } from "@/components/page-shell";
import { Mail, MapPin, ArrowRight, Heart, Lightbulb, Users } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export default function AboutPage() {
  const { theme } = useTheme();
  const isFestival = theme === "festival-civic";
  const isMint = theme === "mint-campaign";
  const isCharcoal = theme === "charcoal-grid";
  const isCopper = theme === "copper-lecture";

  return (
    <PageShell
      title={isFestival ? "关于节庆" : isMint ? "关于行动" : isCharcoal ? "关于栅格" : isCopper ? "关于讲堂" : "关于我们"}
      description={
        isFestival
          ? "致力于推动公民议事节庆的普及与实践"
          : isMint
            ? "致力于推动清新行动式公民议事学习"
            : isCharcoal
              ? "致力于推动结构化、可执行的公民议事学习"
              : isCopper
                ? "致力于推动讲堂化、可沉淀的公民议事学习"
            : "致力推动公共议事规则的普及与实践"
      }
    >
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div
            className={`
            space-y-5 leading-relaxed
            ${isFestival ? "text-rose-700" : isMint ? "text-teal-700" : isCharcoal ? "text-gray-700" : isCopper ? "text-orange-800" : "text-gray-600"}
          `}
          >
            <p>
              <strong className={isFestival ? "text-rose-800" : isMint ? "text-teal-800" : isCharcoal ? "text-gray-900" : isCopper ? "text-orange-900" : "text-gray-900"}>
                {isFestival ? "「议起读节庆」" : isMint ? "「议起读行动」" : isCharcoal ? "「议起读栅格」" : isCopper ? "「议起读讲堂」" : "「议起读」"}
              </strong>
              {isFestival
                ? "是一个专注于青少年公民议事能力培养的节庆教育平台。我们相信，在充满活力的节庆氛围中，规则意识与契约精神能更好地在青少年心中生根发芽。"
                : isMint
                  ? "是一个专注于青少年公民议事能力培养的行动学习平台。我们相信，在清新、专注且富有行动感的学习体验中，规则意识与协作精神更容易形成长期习惯。"
                  : isCharcoal
                    ? "是一个专注于青少年公民议事能力培养的结构化学习平台。我们相信，通过边界清晰、节奏明确的训练流程，规则意识与协作能力更容易形成可迁移的能力。"
                    : isCopper
                      ? "是一个专注于青少年公民议事能力培养的讲堂式学习平台。我们相信，通过有节奏的讲解、示例与复盘，规则意识与公共表达能力更容易沉淀为稳定素养。"
                  : "是一个专注于青少年公共议事能力培养的教育平台。我们相信，规则意识与契约精神是现代公民的核心素养。"}
            </p>
            <p>
              {isFestival
                ? "通过引入《罗伯特议事规则》并进行本土化适配，我们开发了一套充满节庆色彩的课程体系。不仅仅是教规则，更是通过节庆般的模拟会议、社群共学等方式，让孩子们在欢乐的实践中学会表达观点、尊重异见、达成共识。"
                : isMint
                  ? "通过引入《罗伯特议事规则》并进行本土化适配，我们开发了一套更强调行动反馈的课程体系。从任务驱动、分组讨论到模拟会议，让学习者在每一次练习中快速形成表达、倾听与协作能力。"
                  : isCharcoal
                    ? "通过引入《罗伯特议事规则》并进行本土化适配，我们构建了分层明确的课程体系。从规则拆解、案例演练到会议复盘，帮助学习者稳定建立表达、倾听与共识达成能力。"
                    : isCopper
                      ? "通过引入《罗伯特议事规则》并进行本土化适配，我们构建了“讲解 - 演练 - 复盘”闭环课程体系。学习者在每节讲堂中先理解规则原理，再完成情景练习，最终形成可迁移的方法论。"
                  : "通过引入《罗伯特议事规则》并进行本土化适配，我们开发了一套适合中国青少年的课程体系。不仅仅是教规则，更是通过模拟会议、社群共学等方式，让孩子们在实践中学会表达观点、尊重异见、达成共识。"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            {[
              { icon: Heart, label: isFestival ? "节庆尊重" : isMint ? "行动尊重" : isCharcoal ? "结构尊重" : isCopper ? "讲堂尊重" : "尊重", desc: "倾听与包容" },
              { icon: Lightbulb, label: isFestival ? "节庆理性" : isMint ? "行动理性" : isCharcoal ? "结构理性" : isCopper ? "讲堂理性" : "理性", desc: "逻辑与规则" },
              { icon: Users, label: isFestival ? "节庆协作" : isMint ? "行动协作" : isCharcoal ? "结构协作" : isCopper ? "讲堂协作" : "协作", desc: "共识与行动" },
            ].map((v, i) => (
              <div
                key={v.label}
                className={`
                text-center p-4 rounded-xl border transition-all duration-300
                ${isFestival
                  ? "fc-card fc-animate-bounce"
                  : isMint
                    ? `mc-card mc-animate-bounce mc-delay-${(i + 1) * 100}`
                    : isCharcoal
                      ? `cg-card cg-animate-snap cg-delay-${(i + 1) * 100}`
                      : isCopper
                        ? `cl-card cl-animate-bounce cl-delay-${(i + 1) * 100}`
                    : "bg-gray-50 border-gray-100 hover:shadow-md"}
              `}
              >
                <v.icon className={`h-6 w-6 mx-auto mb-2 ${isFestival ? "text-rose-600" : isMint ? "text-teal-600" : isCharcoal ? "text-gray-800" : isCopper ? "text-orange-800" : "text-primary"}`} />
                <div className={`font-bold text-sm ${isFestival ? "text-rose-800" : isMint ? "text-teal-800" : isCharcoal ? "text-gray-900" : isCopper ? "text-orange-900" : "text-gray-900"}`}>
                  {v.label}
                </div>
                <div className={`text-xs mt-0.5 ${isFestival ? "text-rose-600" : isMint ? "text-teal-600" : isCharcoal ? "text-gray-600" : isCopper ? "text-orange-700" : "text-gray-500"}`}>
                  {v.desc}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <h3 className={`text-lg font-bold mb-4 ${isFestival ? "text-rose-800" : isMint ? "text-teal-800" : isCharcoal ? "text-gray-900" : isCopper ? "text-orange-900" : "text-gray-900"}`}>
              联系方式
            </h3>
            <ul className="space-y-3">
              <li className={`flex items-center gap-3 ${isFestival ? "text-rose-700" : isMint ? "text-teal-700" : isCharcoal ? "text-gray-700" : isCopper ? "text-orange-800" : "text-gray-600"}`}>
                <div
                  className={`
                  h-9 w-9 rounded-lg flex items-center justify-center
                  ${isFestival
                    ? "bg-gradient-to-br from-rose-500 to-rose-600"
                    : isMint
                      ? "bg-gradient-to-br from-teal-500 to-teal-600"
                      : isCharcoal
                        ? "bg-gradient-to-br from-gray-800 to-gray-700"
                        : isCopper
                          ? "bg-gradient-to-br from-orange-800 to-amber-700"
                      : "bg-blue-50"}
                `}
                >
                  <Mail className={`h-4.5 w-4.5 ${isFestival || isMint || isCharcoal || isCopper ? "text-white" : "text-primary"}`} />
                </div>
                <span className="text-sm">contact@yiqidu.com</span>
              </li>
              <li className={`flex items-center gap-3 ${isFestival ? "text-rose-700" : isMint ? "text-teal-700" : isCharcoal ? "text-gray-700" : isCopper ? "text-orange-800" : "text-gray-600"}`}>
                <div
                  className={`
                  h-9 w-9 rounded-lg flex items-center justify-center
                  ${isFestival
                    ? "bg-gradient-to-br from-blue-500 to-blue-600"
                    : isMint
                      ? "bg-gradient-to-br from-orange-500 to-orange-600"
                      : isCharcoal
                        ? "bg-gradient-to-br from-emerald-600 to-emerald-500"
                        : isCopper
                          ? "bg-gradient-to-br from-blue-700 to-blue-600"
                      : "bg-blue-50"}
                `}
                >
                  <MapPin className={`h-4.5 w-4.5 ${isFestival || isMint || isCharcoal || isCopper ? "text-white" : "text-primary"}`} />
                </div>
                <span className="text-sm">北京市海淀区中关村大街</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-5">
          <div
            className={`
            rounded-2xl p-8 border
            ${isFestival
              ? "fc-hero fc-pattern border-rose-200"
              : isMint
                ? "mc-hero mc-pattern border-teal-200"
                : isCharcoal
                  ? "cg-page-hero cg-pattern border-gray-700"
                  : isCopper
                    ? "cl-page-hero cl-pattern border-orange-200"
                : "gradient-hero border-gray-100"}
          `}
          >
            <h3 className={`text-xl font-bold mb-6 ${isFestival ? "text-rose-800" : isMint ? "text-teal-800" : isCharcoal ? "text-gray-900" : isCopper ? "text-orange-900" : "text-gray-900"}`}>
              {isFestival ? "加入节庆行动" : isMint ? "加入薄荷行动" : isCharcoal ? "加入结构行动" : isCopper ? "加入铜色讲堂" : "加入我们的行动"}
            </h3>
            <div className="space-y-4">
              <div
                className={`
                p-6 rounded-xl shadow-sm border transition-all duration-300 cursor-pointer
                ${isFestival
                  ? "fc-card fc-animate-bounce hover:shadow-lg"
                  : isMint
                    ? "mc-card mc-animate-bounce hover:shadow-lg"
                    : isCharcoal
                      ? "cg-card cg-animate-snap hover:shadow-lg"
                      : isCopper
                        ? "cl-card cl-animate-bounce hover:shadow-lg"
                    : "bg-white border-gray-50 hover:shadow-md hover:-translate-y-0.5"}
              `}
              >
                <h4 className={`font-bold mb-2 ${isFestival ? "text-rose-800" : isMint ? "text-teal-800" : isCharcoal ? "text-gray-900" : isCopper ? "text-orange-900" : "text-gray-900"}`}>
                  {isFestival ? "我是节庆参与者" : isMint ? "我是行动参与者" : isCharcoal ? "我是结构参与者" : isCopper ? "我是讲堂学习者" : "我是家长 / 学生"}
                </h4>
                <p className={`text-sm mb-4 ${isFestival ? "text-rose-600" : isMint ? "text-teal-600" : isCharcoal ? "text-gray-600" : isCopper ? "text-orange-700" : "text-gray-500"}`}>
                  {isFestival ? "希望参与节庆课程学习？" : isMint ? "希望参与行动课程学习？" : isCharcoal ? "希望参与结构化课程学习？" : isCopper ? "希望参与讲堂式课程学习？" : "希望参与课程学习？"}
                </p>
                <a
                  href="/register"
                  className={`
                  inline-flex items-center text-sm font-semibold transition-colors
                  ${isFestival
                    ? "text-rose-600 hover:text-rose-500"
                    : isMint
                      ? "text-teal-600 hover:text-teal-500"
                      : isCharcoal
                        ? "text-emerald-700 hover:text-emerald-600"
                        : isCopper
                          ? "text-orange-800 hover:text-orange-700"
                      : "text-primary hover:text-primary/80"}
                `}
                >
                  {isFestival ? "立即加入节庆" : isMint ? "立即加入行动" : isCharcoal ? "立即加入结构行动" : isCopper ? "立即加入讲堂" : "立即注册账号"} <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>

              <div
                className={`
                p-6 rounded-xl shadow-sm border transition-all duration-300 cursor-pointer
                ${isFestival
                  ? "fc-card fc-animate-bounce fc-delay-100 hover:shadow-lg"
                  : isMint
                    ? "mc-card mc-animate-bounce mc-delay-100 hover:shadow-lg"
                    : isCharcoal
                      ? "cg-card cg-animate-snap cg-delay-100 hover:shadow-lg"
                      : isCopper
                        ? "cl-card cl-animate-bounce cl-delay-100 hover:shadow-lg"
                    : "bg-white border-gray-50 hover:shadow-md hover:-translate-y-0.5"}
              `}
              >
                <h4 className={`font-bold mb-2 ${isFestival ? "text-rose-800" : isMint ? "text-teal-800" : isCharcoal ? "text-gray-900" : isCopper ? "text-orange-900" : "text-gray-900"}`}>
                  {isFestival ? "我是节庆教育者" : isMint ? "我是行动教育者" : isCharcoal ? "我是结构化教育者" : isCopper ? "我是讲堂教育者" : "我是教育工作者"}
                </h4>
                <p className={`text-sm mb-4 ${isFestival ? "text-rose-600" : isMint ? "text-teal-600" : isCharcoal ? "text-gray-600" : isCopper ? "text-orange-700" : "text-gray-500"}`}>
                  {isFestival ? "有意引入节庆课程或成为节庆讲师？" : isMint ? "有意引入行动课程或成为行动讲师？" : isCharcoal ? "有意引入结构化课程或成为讲师？" : isCopper ? "有意引入讲堂课程或成为讲堂导师？" : "有意引入课程或成为讲师？"}
                </p>
                <a
                  href="mailto:partner@yiqidu.com"
                  className={`
                  inline-flex items-center text-sm font-semibold transition-colors
                  ${isFestival
                    ? "text-rose-600 hover:text-rose-500"
                    : isMint
                      ? "text-teal-600 hover:text-teal-500"
                      : isCharcoal
                        ? "text-emerald-700 hover:text-emerald-600"
                        : isCopper
                          ? "text-orange-800 hover:text-orange-700"
                      : "text-primary hover:text-primary/80"}
                `}
                >
                  {isFestival ? "联系节庆合作" : isMint ? "联系行动合作" : isCharcoal ? "联系结构合作" : isCopper ? "联系讲堂合作" : "联系商务合作"} <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
