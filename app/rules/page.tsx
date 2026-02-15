import { PageShell } from "@/components/page-shell";
import Link from "next/link";
import { Book, Gavel, FileText, ArrowRight, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export default function RulesPage() {
  return (
    <PageShell title="议事规则详解" description="从基础原理到高阶应用，系统掌握罗伯特议事规则。">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <RuleCard
          title="基本原则"
          description="了解议事规则的四大核心原则：多数决、保护少数、一事一议、充分辩论。"
          icon={Gavel}
          href="/rules/principles"
          color="blue"
        />
        <RuleCard
          title="动议体系"
          description="掌握主动议、附属动议、偶发动议等各类动议的优先级与使用场景。"
          icon={Book}
          href="/rules/motions"
          color="indigo"
        />
        <RuleCard
          title="会议流程"
          description="学习标准会议议程，从会议开始到散会的每一个标准化步骤。"
          icon={FileText}
          href="/rules/process"
          color="emerald"
        />
      </div>

      <div className="mt-14 p-10 gradient-hero rounded-2xl border border-gray-100 text-center">
        <Sparkles className="h-8 w-8 text-amber-400 mx-auto mb-4 animate-pulseSoft" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">更多内容正在整理中</h3>
        <p className="text-gray-500 text-sm">详细规则文档与 PPT 将在近期上线，敬请期待。</p>
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
};

function RuleCard({ title, description, icon: Icon, href, color = "blue" }: RuleCardProps) {
  const c = cardColors[color] || cardColors.blue;
  return (
    <Link
      href={href || "#"}
      className={`group block p-7 bg-white rounded-2xl border-l-4 ${c.border} border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer`}
    >
      <div className={`h-12 w-12 ${c.bg} ${c.text} rounded-xl flex items-center justify-center mb-5`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-200">
        {title}
      </h3>
      <p className="text-sm text-gray-500 mb-5 leading-relaxed">{description}</p>
      <span className="inline-flex items-center text-sm font-semibold text-primary group-hover:gap-2 transition-all duration-200">
        查看详情 <ArrowRight className="h-4 w-4 ml-1" />
      </span>
    </Link>
  );
}
