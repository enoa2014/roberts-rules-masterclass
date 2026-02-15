import { PageShell } from "@/components/page-shell";
import { Timer, Vote, Calculator } from "lucide-react";

export default function ToolsPage() {
  return (
    <PageShell title="工具库" description="辅助会议高效进行的实用工具。">
      <div className="grid gap-6 md:grid-cols-3 mt-8">
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

function ToolCard({ title, description, icon: Icon, status }: any) {
  return (
    <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm opacity-100">
      <div className="flex justify-between items-start mb-4">
        <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
          <Icon className="h-5 w-5" />
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${status === '可用' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
          }`}>
          {status}
        </span>
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
