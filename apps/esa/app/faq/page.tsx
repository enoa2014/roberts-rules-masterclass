"use client";

import { PageShell } from "@yiqidu/ui/page-shell";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useTheme } from "@yiqidu/ui/theme-provider";

export default function FAQPage() {
  const { theme } = useTheme();
  const isFestival = theme === "festival-civic";
  const isMint = theme === "mint-campaign";
  const isCharcoal = theme === "charcoal-grid";
  const isCopper = theme === "copper-lecture";

  const faqs = [
    {
      q: "如何获得课程学习资格？",
      a: "目前主要通过线下培训班发放邀请码。如果您已报名线下课，请向您的班主任索取邀请码。注册账号后输入邀请码即可解锁全部线上内容。",
    },
    {
      q: "没有邀请码可以注册吗？",
      a: "可以注册账号（Visitor 身份），但只能访问公开的课程简介和部分资源。核心课程、作业提交和互动功能需要 Student 资格（通过邀请码激活）。",
    },
    {
      q: "忘记密码怎么办？",
      a: "目前 MVP 版本暂未开通自助找回密码功能。请联系您的班主任或管理员重置密码。",
    },
    {
      q: "支持哪些设备访问？",
      a: "平台支持电脑（推荐使用 Chrome / Edge 浏览器）和手机访问。课堂互动功能建议在手机微信内使用，以便随时举手和投票。",
    },
  ];

  return (
    <PageShell
      title={isFestival ? "节庆常见问题" : isMint ? "行动常见问题" : isCharcoal ? "栅格常见问题" : isCopper ? "讲堂常见问题" : "常见问题"}
      description={isFestival ? "这里有节庆学习中最常见的问题解答" : isMint ? "这里有行动学习中最常见的问题解答" : isCharcoal ? "这里有结构化学习中最常见的问题解答" : isCopper ? "这里有讲堂学习中最常见的问题解答" : "这里有您可能关心的问题解答"}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((item, index) => (
          <div
            key={index}
            className={`
              rounded-2xl overflow-hidden border shadow-sm hover:shadow-md transition-shadow duration-200
              ${isFestival
                ? "fc-card border-rose-100"
                : isMint
                  ? "mc-card border-teal-100"
                  : isCharcoal
                    ? "cg-card border-gray-700"
                    : isCopper
                      ? "cl-card border-orange-200"
                  : "bg-white border-gray-100"}
            `}
          >
            <details className="group">
              <summary
                className={`
                  flex cursor-pointer items-center gap-4 p-6 font-semibold list-none [&::-webkit-details-marker]:hidden transition-colors duration-200
                  ${isFestival
                    ? "text-rose-900 hover:bg-rose-50/80"
                    : isMint
                      ? "text-teal-900 hover:bg-teal-50/80"
                      : isCharcoal
                        ? "text-gray-900 hover:bg-gray-100/80"
                        : isCopper
                          ? "text-orange-900 hover:bg-orange-50/80"
                      : "text-gray-900 hover:bg-gray-50/80"}
                `}
              >
                <span
                  className={`
                    flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-sm font-bold
                    ${isFestival
                      ? "bg-rose-100 text-rose-700"
                      : isMint
                        ? "bg-teal-100 text-teal-700"
                        : isCharcoal
                          ? "bg-gray-200 text-gray-800"
                          : isCopper
                            ? "bg-orange-100 text-orange-800"
                        : "bg-blue-50 text-primary"}
                  `}
                >
                  {index + 1}
                </span>
                <span className="flex-1">{item.q}</span>
                <ChevronDown className="h-5 w-5 text-gray-400 transition-transform duration-300 group-open:rotate-180 flex-shrink-0" />
              </summary>
              <div
                className={`
                  border-t px-6 py-5 ml-12 mr-6
                  ${isFestival
                    ? "border-rose-50"
                    : isMint
                      ? "border-teal-50"
                      : isCharcoal
                        ? "border-gray-200"
                        : isCopper
                          ? "border-orange-100"
                      : "border-gray-50"}
                `}
              >
                <div
                  className={`
                    relative pl-4 border-l-2
                    ${isFestival
                      ? "border-rose-200"
                      : isMint
                        ? "border-teal-200"
                        : isCharcoal
                          ? "border-gray-400"
                          : isCopper
                            ? "border-orange-300"
                        : "border-blue-200"}
                  `}
                >
                  <p className={`leading-relaxed text-sm ${isFestival ? "text-rose-700" : isMint ? "text-teal-700" : isCharcoal ? "text-gray-700" : isCopper ? "text-orange-800" : "text-gray-600"}`}>{item.a}</p>
                </div>
              </div>
            </details>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <div
          className={`
            inline-flex flex-col items-center p-8 rounded-2xl border
            ${isFestival
              ? "bg-rose-50 border-rose-100"
              : isMint
                ? "bg-teal-50 border-teal-100"
                : isCharcoal
                  ? "bg-gray-100 border-gray-300"
                  : isCopper
                    ? "bg-orange-50 border-orange-200"
                : "bg-gray-50 border-gray-100"}
          `}
        >
          <HelpCircle className={`h-8 w-8 mb-3 ${isFestival ? "text-rose-300" : isMint ? "text-teal-300" : isCharcoal ? "text-gray-500" : isCopper ? "text-orange-400" : "text-gray-300"}`} />
          <p className={`text-sm ${isFestival ? "text-rose-600" : isMint ? "text-teal-600" : isCharcoal ? "text-gray-700" : isCopper ? "text-orange-700" : "text-gray-500"}`}>还有其他问题？</p>
          <a
            href="mailto:contact@yiqidu.com"
            className={`text-sm font-semibold mt-1 transition-colors cursor-pointer ${isFestival ? "text-rose-600 hover:text-rose-500" : isMint ? "text-teal-600 hover:text-teal-500" : isCharcoal ? "text-emerald-700 hover:text-emerald-600" : isCopper ? "text-orange-800 hover:text-orange-700" : "text-primary hover:text-primary/80"}`}
          >
            联系我们 →
          </a>
        </div>
      </div>
    </PageShell>
  );
}
