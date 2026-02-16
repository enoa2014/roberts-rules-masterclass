import { PageShell } from "@/components/page-shell";
import { Timer, Vote, Calculator } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export default function ToolsPage() {
  return (
    <PageShell title="工具库" description="辅助会议高效进行的实用工具。">
      <div className="grid gap-6 md:grid-cols-3">
        <ToolCard
          title="计时器"
          description="辩论发言倒计时工具，支持自定义时长与提醒。"
          icon={Timer}
          status="可用"
        />
        <ToolCard
          title="计票器"
          description="快速计算多数票、三分之二票等通过门槛。"
          icon={Calculator}
          status="开发中"
        />
        <ToolCard
          title="模拟投票"
          description="简单的举手表决计数器。"
          icon={Vote}
          status="开发中"
        />
      </div>
    </PageShell>
  );
}

type ToolCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  status: "可用" | "开发中";
};

function ToolCard({ title, description, icon: Icon, status }: ToolCardProps) {
  const isAvailable = status === "可用";
  return (
    <div className={`p-7 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer ${!isAvailable ? "opacity-80" : ""}`}>
      <div className="flex justify-between items-start mb-5">
        <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
          <Icon className="h-6 w-6" />
        </div>
        <span
          className={`text-xs font-medium px-3 py-1 rounded-full ${isAvailable
              ? "bg-emerald-50 text-emerald-700"
              : "bg-gray-100 text-gray-500"
            }`}
        >
          {isAvailable && <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulseSoft" />}
          {status}
        </span>
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}
