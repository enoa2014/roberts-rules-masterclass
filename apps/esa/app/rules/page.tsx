"use client";

import { PageShell } from "@yiqidu/ui/page-shell";
import Link from "next/link";
import { Book, Gavel, FileText, ArrowRight, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTheme } from "@yiqidu/ui/theme-provider";

export default function RulesPage() {
  const { theme } = useTheme();
  const isFestival = theme === "festival-civic";
  const isMint = theme === "mint-campaign";

  return (
    <PageShell
      title={isFestival ? "节庆议事规则详解" : isMint ? "行动议事规则详解" : "议事规则详解"}
      description={isFestival ? "从基础原理到高阶应用，在节庆式学习中掌握罗伯特议事规则。" : isMint ? "从基础原理到高阶应用，在行动式学习中掌握罗伯特议事规则。" : "从基础原理到高阶应用，系统掌握罗伯特议事规则。"}
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <RuleCard
          title="基本原则"
          description="了解议事规则的四大核心原则：多数决、保护少数、一事一议、充分辩论。"
          icon={Gavel}
          href="/rules/principles"
          color="blue"
          isFestival={isFestival}
          isMint={isMint}
        />
        <RuleCard
          title="动议体系"
          description="掌握主动议、附属动议、偶发动议等各类动议的优先级与使用场景。"
          icon={Book}
          href="/rules/motions"
          color="indigo"
          isFestival={isFestival}
          isMint={isMint}
        />
        <RuleCard
          title="会议流程"
          description="学习标准会议议程，从会议开始到散会的每一个标准化步骤。"
          icon={FileText}
          href="/rules/process"
          color="emerald"
          isFestival={isFestival}
          isMint={isMint}
        />
      </div>

      <div
        className={`
          mt-14 p-10 rounded-2xl border text-center
          ${isFestival
            ? "fc-hero fc-pattern border-rose-200"
            : isMint
              ? "mc-hero mc-pattern border-teal-200"
              : "gradient-hero border-gray-100"}
        `}
      >
        <Sparkles className={`h-8 w-8 mx-auto mb-4 ${isFestival ? "text-rose-400" : isMint ? "text-teal-500" : "text-amber-400"} ${isFestival ? "fc-animate-pulse" : isMint ? "mc-animate-pulse" : "animate-pulseSoft"}`} />
        <h3 className={`text-xl font-bold mb-2 ${isFestival ? "text-rose-800" : isMint ? "text-teal-800" : "text-gray-900"}`}>更多内容正在整理中</h3>
        <p className={`text-sm ${isFestival ? "text-rose-600" : isMint ? "text-teal-600" : "text-gray-500"}`}>详细规则文档与 PPT 将在近期上线，敬请期待。</p>
      </div>
    </PageShell>
  );
}

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
  isFestival: boolean;
  isMint: boolean;
};

function RuleCard({ title, description, icon: Icon, href, color = "blue", isFestival, isMint }: RuleCardProps) {
  const c = cardColors[color] || cardColors.blue;
  return (
    <Link
      href={href || "#"}
      className={`
        group block p-7 rounded-2xl border-l-4 ${c.border} border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer
        ${isFestival
          ? "fc-card border-rose-100"
          : isMint
            ? "mc-card border-teal-100"
            : "bg-white border-gray-100"}
      `}
    >
      <div className={`h-12 w-12 ${c.bg} ${c.text} rounded-xl flex items-center justify-center mb-5`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className={`text-lg font-bold mb-2 transition-colors duration-200 ${isFestival ? "text-rose-800 group-hover:text-rose-600" : isMint ? "text-teal-800 group-hover:text-teal-600" : "text-gray-900 group-hover:text-primary"}`}>
        {title}
      </h3>
      <p className={`text-sm mb-5 leading-relaxed ${isFestival ? "text-rose-700" : isMint ? "text-teal-700" : "text-gray-500"}`}>{description}</p>
      <span className={`inline-flex items-center text-sm font-semibold group-hover:gap-2 transition-all duration-200 ${isFestival ? "text-rose-600" : isMint ? "text-teal-600" : "text-primary"}`}>
        查看详情 <ArrowRight className="h-4 w-4 ml-1" />
      </span>
    </Link>
  );
}
