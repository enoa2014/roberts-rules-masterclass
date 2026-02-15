import { PageShell } from "@/components/page-shell";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Users, FileText, Settings, Shield, MessageSquareWarning, MessagesSquare } from "lucide-react";

export default function AdminPage() {
  return (
    <PageShell title="管理后台" description="系统概览与核心管理功能">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
        <AdminCard
          title="学员管理"
          description="查看学员列表，管理角色与权限。"
          icon={Users}
          href="/admin/users"
          stat="12 人"
        />
        <AdminCard
          title="邀请码管理"
          description="生成与作废邀请码，查看使用记录。"
          icon={Shield}
          href="/admin/invites"
          stat="5 个有效"
        />
        <AdminCard
          title="作业批阅"
          description="查看学员提交的作业并进行打分。"
          icon={FileText}
          href="/admin/assignments"
          stat="3 份待批"
        />
        <AdminCard
          title="反馈管理"
          description="查看课堂反馈并导出 CSV。"
          icon={MessagesSquare}
          href="/admin/feedbacks"
        />
        <AdminCard
          title="内容治理"
          description="治理帖子/评论/用户并查看治理日志。"
          icon={MessageSquareWarning}
          href="/admin/moderation"
        />
        <AdminCard
          title="系统设置"
          description="配置系统参数与全局通知。"
          icon={Settings}
          href="/admin/settings"
        />
      </div>
    </PageShell>
  );
}

type AdminCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  stat?: string;
};

function AdminCard({ title, description, icon: Icon, href, stat }: AdminCardProps) {
  return (
    <Link href={href} className="block p-6 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className="h-10 w-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
          <Icon className="h-5 w-5" />
        </div>
        {stat && (
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-50 text-blue-700">
            {stat}
          </span>
        )}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-sm text-gray-600">
        {description}
      </p>
    </Link>
  );
}
