"use client";

import { PageShell } from "@yiqidu/ui";
import Link from "next/link";
import { Book, Gavel, FileText, ArrowRight, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type RulesThemeConfig = {
  rootClass?: string;
  pageTitle: string;
  pageDescription: string;
  contentClass?: string;
  gridClass?: string;
  introBadgeLabel?: string;
  introBadgeClass?: string;
  introBadgeIcon?: LucideIcon;
  introBadgeIconClass?: string;
  cardIndexLabels?: string[];
  cardIndexClass?: string;
  cardDividerClass?: string;
  cardHeaderClass?: string;
  cardHeaderDividerClass?: string;
  cardMetaLabels?: string[];
  cardMetaClass?: string;
  cardFooterClass?: string;
  cardLinkIconClass?: string;
  cardColorMap?: Record<string, { border: string; bg: string; text: string }>;
  cardClass: string;
  cardIconClass?: string;
  cardTitleClass: string;
  cardDescClass: string;
  cardLinkClass: string;
  heroContainerClass: string;
  heroIconClass: string;
  heroTitleClass: string;
  heroTextClass: string;
};

const cardColors: Record<string, { border: string; bg: string; text: string }> = {
  blue: { border: "border-l-blue-500", bg: "bg-blue-50", text: "text-blue-600" },
  indigo: { border: "border-l-indigo-500", bg: "bg-indigo-50", text: "text-indigo-600" },
  emerald: { border: "border-l-emerald-500", bg: "bg-emerald-50", text: "text-emerald-600" },
};

type RuleCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color?: "blue" | "indigo" | "emerald";
  theme: RulesThemeConfig;
  indexLabel?: string;
  metaLabel?: string;
};

function RuleCard({
  title,
  description,
  icon: Icon,
  href,
  color = "blue",
  theme,
  indexLabel,
  metaLabel,
}: RuleCardProps) {
  const colorMap = theme.cardColorMap ? { ...cardColors, ...theme.cardColorMap } : cardColors;
  const c = colorMap[color] || cardColors.blue;
  return (
    <Link
      href={href || "#"}
      className={`
        group block p-7 rounded-2xl border-l-4 ${c.border} border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer
        ${theme.cardClass}
      `}
    >
      <div className={theme.cardHeaderClass || ""}>
        <div
          className={`h-12 w-12 ${c.bg} ${c.text} rounded-xl flex items-center justify-center mb-5 ${theme.cardIconClass || ""}`}
        >
          <Icon className="h-6 w-6" />
        </div>
        {indexLabel && (
          <div className={theme.cardIndexClass || "text-xs uppercase tracking-wider text-gray-500 mb-3"}>
            {indexLabel}
          </div>
        )}
      </div>
      {theme.cardHeaderDividerClass && <div className={theme.cardHeaderDividerClass} />}
      <h3 className={`text-lg font-bold mb-2 transition-colors duration-200 ${theme.cardTitleClass}`}>
        {title}
      </h3>
      {metaLabel && (
        <div className={theme.cardMetaClass || "text-xs text-gray-500 uppercase tracking-wider mb-3"}>
          {metaLabel}
        </div>
      )}
      <p className={`text-sm mb-5 leading-relaxed ${theme.cardDescClass}`}>{description}</p>
      {theme.cardDividerClass && <div className={theme.cardDividerClass} />}
      <div className={theme.cardFooterClass || ""}>
        <span
          className={`inline-flex items-center text-sm font-semibold group-hover:gap-2 transition-all duration-200 ${theme.cardLinkClass}`}
        >
          查看详情 <ArrowRight className={`h-4 w-4 ml-1 ${theme.cardLinkIconClass || ""}`} />
        </span>
      </div>
    </Link>
  );
}

export default function RulesView({ config }: { config: RulesThemeConfig }) {
  const IntroIcon = config.introBadgeIcon;
  return (
    <div className={config.rootClass || ""}>
      <PageShell title={config.pageTitle} description={config.pageDescription}>
        <div className={config.contentClass || ""}>
          {config.introBadgeLabel && (
            <div
              className={
                config.introBadgeClass ||
                "inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-xs font-mono font-semibold text-gray-600 mb-8"
              }
            >
              {IntroIcon && (
                <IntroIcon className={config.introBadgeIconClass || "h-4 w-4"} />
              )}
              <span className="uppercase tracking-wider">{config.introBadgeLabel}</span>
            </div>
          )}
          <div className={config.gridClass || "grid gap-6 md:grid-cols-2 lg:grid-cols-3"}>
            {[
              {
                title: "基本原则",
                description: "了解议事规则的四大核心原则：多数决、保护少数、一事一议、充分辩论。",
                icon: Gavel,
                href: "/rules/principles",
                color: "blue" as const,
              },
              {
                title: "动议体系",
                description: "掌握主动议、附属动议、偶发动议等各类动议的优先级与使用场景。",
                icon: Book,
                href: "/rules/motions",
                color: "indigo" as const,
              },
              {
                title: "会议流程",
                description: "学习标准会议议程，从会议开始到散会的每一个标准化步骤。",
                icon: FileText,
                href: "/rules/process",
                color: "emerald" as const,
              },
            ].map((card, idx) => (
              <RuleCard
                key={card.href}
                title={card.title}
                description={card.description}
                icon={card.icon}
                href={card.href}
                color={card.color}
                theme={config}
                indexLabel={config.cardIndexLabels?.[idx]}
                metaLabel={config.cardMetaLabels?.[idx]}
              />
            ))}
          </div>

          <div
            className={`
              mt-14 p-10 rounded-2xl border text-center
              ${config.heroContainerClass}
            `}
          >
            <Sparkles className={`h-8 w-8 mx-auto mb-4 ${config.heroIconClass}`} />
            <h3 className={`text-xl font-bold mb-2 ${config.heroTitleClass}`}>更多内容正在整理中</h3>
            <p className={`text-sm ${config.heroTextClass}`}>详细规则文档与 PPT 将在近期上线，敬请期待。</p>
          </div>
        </div>
      </PageShell>
    </div>
  );
}
