import { PageShell } from "@yiqidu/ui";
import Link from "next/link";
import { getServerSession } from "next-auth";
import type { LucideIcon } from "lucide-react";
import { Users, FileText, Settings, Shield, MessageSquareWarning, MessagesSquare } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { sqlite } from "@/lib/db";

type AdminCardStatKey = "users" | "invites" | "assignments" | "feedbacks" | "moderation";

type AdminCardConfig = {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  statKey?: AdminCardStatKey;
  adminOnly?: boolean;
  testId: string;
};

type AdminStats = {
  users: number;
  invites: number;
  assignments: number;
  feedbacks: number;
  moderation: number;
};

function readCount(sql: string, ...params: Array<string | number>) {
  const row = sqlite.prepare(sql).get(...params) as { count?: number } | undefined;
  return Number(row?.count ?? 0);
}

function loadAdminStats(): AdminStats {
  return {
    users: readCount("SELECT COUNT(*) as count FROM users"),
    invites: readCount(
      `SELECT COUNT(*) as count
       FROM invite_codes
       WHERE (expires_at IS NULL OR datetime(expires_at) > datetime('now'))
         AND (max_uses = 0 OR used_count < max_uses)`,
    ),
    assignments: readCount("SELECT COUNT(*) as count FROM assignments WHERE status = 'submitted'"),
    feedbacks: readCount("SELECT COUNT(*) as count FROM feedbacks"),
    moderation: readCount("SELECT COUNT(*) as count FROM moderation_logs"),
  };
}

function formatCardStat(statKey: AdminCardStatKey, stats: AdminStats) {
  switch (statKey) {
    case "users":
      return `${stats.users} 人`;
    case "invites":
      return `${stats.invites} 个有效`;
    case "assignments":
      return `${stats.assignments} 份待批`;
    case "feedbacks":
      return `${stats.feedbacks} 条反馈`;
    case "moderation":
      return `${stats.moderation} 条记录`;
    default:
      return "";
  }
}

const cards: AdminCardConfig[] = [
  {
    title: "学员管理",
    description: "查看学员列表，管理角色与权限。",
    icon: Users,
    href: "/admin/users",
    statKey: "users",
    adminOnly: true,
    testId: "admin-card-users",
  },
  {
    title: "邀请码管理",
    description: "生成与作废邀请码，查看使用记录。",
    icon: Shield,
    href: "/admin/invites",
    statKey: "invites",
    adminOnly: true,
    testId: "admin-card-invites",
  },
  {
    title: "作业批阅",
    description: "查看学员提交的作业并进行打分。",
    icon: FileText,
    href: "/admin/assignments",
    statKey: "assignments",
    testId: "admin-card-assignments",
  },
  {
    title: "反馈管理",
    description: "查看课堂反馈并导出 CSV。",
    icon: MessagesSquare,
    href: "/admin/feedbacks",
    statKey: "feedbacks",
    testId: "admin-card-feedbacks",
  },
  {
    title: "内容治理",
    description: "治理帖子/评论/用户并查看治理日志。",
    icon: MessageSquareWarning,
    href: "/admin/moderation",
    statKey: "moderation",
    testId: "admin-card-moderation",
  },
  {
    title: "系统设置",
    description: "配置系统参数与全局通知。",
    icon: Settings,
    href: "/admin/settings",
    adminOnly: true,
    testId: "admin-card-settings",
  },
];

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role ?? "registered";
  const isAdmin = role === "admin";
  const stats = loadAdminStats();
  const visibleCards = cards.filter((card) => !card.adminOnly || isAdmin);

  return (
    <PageShell title="管理后台" description="系统概览与核心管理功能">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
        {visibleCards.map((card) => (
          <AdminCard
            key={card.href}
            title={card.title}
            description={card.description}
            icon={card.icon}
            href={card.href}
            stat={card.statKey ? formatCardStat(card.statKey, stats) : undefined}
            testId={card.testId}
          />
        ))}
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
  testId: string;
};

function AdminCard({ title, description, icon: Icon, href, stat, testId }: AdminCardProps) {
  return (
    <Link
      href={href}
      data-testid={testId}
      className="block p-6 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="h-10 w-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
          <Icon className="h-5 w-5" />
        </div>
        {stat && (
          <span
            data-testid={`${testId}-stat`}
            className="text-xs font-medium px-2 py-1 rounded-full bg-blue-50 text-blue-700"
          >
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
