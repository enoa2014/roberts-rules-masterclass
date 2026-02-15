import { PageShell } from "@/components/page-shell";
import Link from "next/link";
import { Book, Gavel, FileText } from "lucide-react";

export default function RulesPage() {
  return (
    <PageShell title="议事规则详解" description="从基础原则到高阶应用，系统掌握罗伯特议事规则。">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
        <RuleCard
          title="基本原则"
          description="了解议事规则的四大核心原则：多数决、保护少数、一事一议、充分辩论。"
          icon={Gavel}
          href="/rules/principles"
        />
        <RuleCard
          title="动议体系"
          description="掌握主动议、附属动议、偶发动议等各类动议的优先级与使用场景。"
          icon={Book}
          href="/rules/motions"
        />
        <RuleCard
          title="会议流程"
          description="学习标准会议议程，从会议开始到散会的每一个标准化步骤。"
          icon={FileText}
          href="/rules/process"
        />
      </div>

      <div className="mt-12 p-8 bg-gray-50 rounded-2xl border border-gray-100 text-center">
        <h3 className="text-lg font-bold text-gray-900 mb-2">更多内容正在整理中</h3>
        <p className="text-gray-500">详细规则文档与 PPT 将在近期上线。</p>
      </div>
    </PageShell>
  );
}


function RuleCard({ title, description, icon: Icon, href }: any) {
  return (
    <Link href={href || '#'} className="block p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="h-10 w-10 bg-blue-50 text-primary rounded-lg flex items-center justify-center mb-4">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <span className="text-sm font-medium text-primary hover:underline">
        查看详情 &rarr;
      </span>
    </Link>
  );
}
