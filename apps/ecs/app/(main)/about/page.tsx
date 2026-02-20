"use client";

import { PageShell } from "@yiqidu/ui";
import { Mail, MapPin, ArrowRight, Heart, Lightbulb, Users } from "lucide-react";
import { useTheme } from "@yiqidu/ui";

export default function AboutPage() {
  const { theme } = useTheme();
  const isFestival = theme === "festival-civic";
  const isMint = theme === "mint-campaign";
  const isCharcoal = theme === "charcoal-grid";
  const isCopper = theme === "copper-lecture";

  return (
    <PageShell
      title={isFestival ? "关于活力课堂" : isMint ? "关于薄荷实践" : isCharcoal ? "关于栅格" : isCopper ? "关于讲堂" : "关于我们"}
      description={
        isFestival
          ? "面向教师与家长的活力课堂沟通培训"
          : isMint
            ? "面向教师与家长的薄荷实践沟通训练"
            : isCharcoal
              ? "面向教师与家长的结构化沟通训练"
              : isCopper
                ? "面向教师与家长的讲堂式沟通训练"
            : "面向教师与家长的课堂沟通与协作培训"
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
                {isFestival ? "「议起读·活力课堂」" : isMint ? "「议起读·薄荷实践」" : isCharcoal ? "「议起读·炭黑栅格」" : isCopper ? "「议起读·铜色讲堂」" : "「议起读」"}
              </strong>
              {isFestival
                ? "是一个面向教师与家长的课堂沟通培训平台。我们相信，在更有活力的课堂氛围中，表达、倾听与协作更容易形成习惯。"
                : isMint
                  ? "是一个面向教师与家长的课堂实践训练平台。我们强调清晰流程与即时反馈，让表达与协作在练习中沉淀。"
                  : isCharcoal
                    ? "是一个面向教师与家长的结构化沟通训练平台。通过边界清晰、节奏明确的训练，形成可迁移的课堂协作能力。"
                    : isCopper
                      ? "是一个面向教师与家长的讲堂式沟通培训平台。通过讲解、示例与复盘，提升规则化表达能力。"
                  : "是一个面向教师与家长的课堂沟通与协作培训平台。我们相信，清晰的讨论规则与协作习惯是高效课堂与家校沟通的基础。"}
            </p>
            <p>
              {isFestival
                ? "通过引入《罗伯特议事规则》并本土化适配，我们设计了更具活力的课堂训练。除了规则讲解，还包含情境演练、课堂流程设计与教师互学，让课堂讨论更有序。"
                : isMint
                  ? "通过引入《罗伯特议事规则》并本土化适配，我们开发了强调实践反馈的课程体系。从任务驱动、分组讨论到模拟会议，让学员在练习中形成表达、倾听与协作能力。"
                  : isCharcoal
                    ? "通过引入《罗伯特议事规则》并本土化适配，我们构建了分层明确的课程体系。从规则拆解、案例演练到会议复盘，帮助学员稳定建立表达、倾听与共识形成能力。"
                    : isCopper
                      ? "通过引入《罗伯特议事规则》并本土化适配，我们构建了“讲解 - 演练 - 复盘”闭环课程。学员在每节讲堂中理解规则原理，并完成情景练习，形成可迁移的方法。"
                  : "通过引入《罗伯特议事规则》并本土化适配，我们形成了面向教师与家长的课程体系，包含规则讲解、课堂情境演练、家校沟通模拟与复盘。"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            {[
              { icon: Heart, label: isFestival ? "活力尊重" : isMint ? "薄荷尊重" : isCharcoal ? "栅格尊重" : isCopper ? "讲堂尊重" : "尊重", desc: "倾听与包容" },
              { icon: Lightbulb, label: isFestival ? "活力理性" : isMint ? "薄荷理性" : isCharcoal ? "栅格理性" : isCopper ? "讲堂理性" : "理性", desc: "逻辑与规则" },
              { icon: Users, label: isFestival ? "活力协作" : isMint ? "薄荷协作" : isCharcoal ? "栅格协作" : isCopper ? "讲堂协作" : "协作", desc: "共识与落实" },
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
              {isFestival ? "加入活力课堂" : isMint ? "加入薄荷实践" : isCharcoal ? "加入炭黑栅格" : isCopper ? "加入铜色讲堂" : "加入课程学习"}
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
                  {isFestival ? "我是活力课堂学员" : isMint ? "我是薄荷实践学员" : isCharcoal ? "我是栅格学员" : isCopper ? "我是讲堂学员" : "我是家长 / 教师"}
                </h4>
                <p className={`text-sm mb-4 ${isFestival ? "text-rose-600" : isMint ? "text-teal-600" : isCharcoal ? "text-gray-600" : isCopper ? "text-orange-700" : "text-gray-500"}`}>
                  {isFestival ? "希望参与活力课堂训练？" : isMint ? "希望参与薄荷实践训练？" : isCharcoal ? "希望参与结构化课程学习？" : isCopper ? "希望参与讲堂式课程学习？" : "希望参与课程学习？"}
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
                  {isFestival ? "立即加入活力课堂" : isMint ? "立即加入薄荷实践" : isCharcoal ? "立即加入结构课程" : isCopper ? "立即加入铜色讲堂" : "立即注册账号"} <ArrowRight className="ml-1 h-4 w-4" />
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
                  {isFestival ? "我是活力课堂组织者" : isMint ? "我是薄荷实践组织者" : isCharcoal ? "我是结构化教育者" : isCopper ? "我是讲堂教育者" : "我是教育工作者"}
                </h4>
                <p className={`text-sm mb-4 ${isFestival ? "text-rose-600" : isMint ? "text-teal-600" : isCharcoal ? "text-gray-600" : isCopper ? "text-orange-700" : "text-gray-500"}`}>
                  {isFestival ? "有意引入活力课堂课程或成为讲师？" : isMint ? "有意引入薄荷实践课程或成为讲师？" : isCharcoal ? "有意引入结构化课程或成为讲师？" : isCopper ? "有意引入讲堂课程或成为讲师？" : "有意引入课程或成为讲师？"}
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
                  {isFestival ? "联系课堂合作" : isMint ? "联系实践合作" : isCharcoal ? "联系结构合作" : isCopper ? "联系讲堂合作" : "联系商务合作"} <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
