"use client";

import { PageShell } from "@yiqidu/ui";
import { ChevronDown, HelpCircle } from "lucide-react";

export type FaqThemeConfig = {
  rootClass?: string;
  pageTitle: string;
  pageDescription: string;
  cardClass: string;
  summaryClass: string;
  indexBadgeClass: string;
  answerBorderClass: string;
  answerAccentClass: string;
  answerTextClass: string;
  calloutClass: string;
  calloutIconClass: string;
  calloutTextClass: string;
  calloutLinkClass: string;
};

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

export default function FaqView({ config }: { config: FaqThemeConfig }) {
  return (
    <div className={config.rootClass || ""}>
      <PageShell title={config.pageTitle} description={config.pageDescription}>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((item, index) => (
            <div
              key={index}
              className={`
                rounded-2xl overflow-hidden border shadow-sm hover:shadow-md transition-shadow duration-200
                ${config.cardClass}
              `}
            >
              <details className="group">
                <summary
                  className={`
                    flex cursor-pointer items-center gap-4 p-6 font-semibold list-none [&::-webkit-details-marker]:hidden transition-colors duration-200
                    ${config.summaryClass}
                  `}
                >
                  <span
                    className={`
                      flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-sm font-bold
                      ${config.indexBadgeClass}
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
                    ${config.answerBorderClass}
                  `}
                >
                  <div
                    className={`
                      relative pl-4 border-l-2
                      ${config.answerAccentClass}
                    `}
                  >
                    <p className={`leading-relaxed text-sm ${config.answerTextClass}`}>{item.a}</p>
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
              ${config.calloutClass}
            `}
          >
            <HelpCircle className={`h-8 w-8 mb-3 ${config.calloutIconClass}`} />
            <p className={`text-sm ${config.calloutTextClass}`}>还有其他问题？</p>
            <a
              href="mailto:contact@yiqidu.com"
              className={`text-sm font-semibold mt-1 transition-colors cursor-pointer ${config.calloutLinkClass}`}
            >
              联系我们 →
            </a>
          </div>
        </div>
      </PageShell>
    </div>
  );
}
