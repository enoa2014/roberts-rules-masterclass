import { PageShell } from "@/components/page-shell";
import { BookOpen, Video, Users, FileText, CheckCircle, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

export default function CoursePage() {
  return (
    <PageShell title="课程总览" description="循序渐进的议事规则学习路径，从入门到实战全覆盖。">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <CourseModule
          title="基础篇：初识议事规则"
          description="了解议事规则的核心价值与基本原则，掌握会议的基本流程。"
          level="入门"
          lessons={3}
          icon={BookOpen}
          color="blue"
        />
        <CourseModule
          title="进阶篇：动议与辩论"
          description="深入学习主动议、修正案及辩论技巧，提升会议效率。"
          level="进阶"
          lessons={5}
          icon={Video}
          color="indigo"
        />
        <CourseModule
          title="实践篇：模拟会议"
          description="通过角色扮演与模拟场景，真实演练所学规则。"
          level="实战"
          lessons={4}
          icon={Users}
          color="emerald"
        />
      </div>

      <div className="mt-16 gradient-primary rounded-3xl p-10 md:p-14 text-center text-white relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <h3 className="text-2xl md:text-3xl font-extrabold mb-4">准备好开始了吗？</h3>
          <p className="text-blue-100 mb-8 max-w-md mx-auto">注册并输入邀请码，解锁全部课程内容与互动功能。</p>
          <Link href="/register" className="inline-flex items-center justify-center h-12 px-8 rounded-xl bg-white text-primary font-semibold hover:bg-gray-50 transition-all duration-200 cursor-pointer">
            立即注册 <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </PageShell>
  );
}

const colorStyles: Record<string, { bg: string; text: string; badge: string }> = {
  blue: { bg: "group-hover:bg-blue-600", text: "group-hover:text-blue-600", badge: "bg-blue-50 text-blue-700" },
  indigo: { bg: "group-hover:bg-indigo-600", text: "group-hover:text-indigo-600", badge: "bg-indigo-50 text-indigo-700" },
  emerald: { bg: "group-hover:bg-emerald-600", text: "group-hover:text-emerald-600", badge: "bg-emerald-50 text-emerald-700" },
};

type CourseModuleProps = {
  title: string;
  description: string;
  level: string;
  lessons: number;
  icon: LucideIcon;
  color?: "blue" | "indigo" | "emerald";
};

function CourseModule({ title, description, level, lessons, icon: Icon, color = "blue" }: CourseModuleProps) {
  const c = colorStyles[color] || colorStyles.blue;
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-7 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
      <div className="flex items-center justify-between mb-5">
        <div className={`h-12 w-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-500 ${c.bg} group-hover:text-white transition-all duration-300`}>
          <Icon className="h-6 w-6" />
        </div>
        <span className={`text-xs font-medium px-3 py-1 rounded-full ${c.badge}`}>
          {level}
        </span>
      </div>

      <h3 className={`text-lg font-bold text-gray-900 mb-2 ${c.text} transition-colors duration-300`}>
        {title}
      </h3>
      <p className="text-sm text-gray-500 mb-6 min-h-[44px] leading-relaxed">
        {description}
      </p>

      <div className="flex items-center text-xs text-gray-400 gap-5 border-t border-gray-50 pt-5">
        <div className="flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5" />
          <span>{lessons} 节课程</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle className="h-3.5 w-3.5" />
          <span>颁发证书</span>
        </div>
      </div>
    </div>
  );
}
