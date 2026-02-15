import { PageShell } from "@/components/page-shell";
import { BookOpen, Video, FileText, CheckCircle } from "lucide-react";

export default function CoursePage() {
  return (
    <PageShell title="课程总览" description="循序渐进的议事规则学习路径">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-8">
        <CourseModule
          title="基础篇：初识议事规则"
          description="了解议事规则的核心价值与基本原则，掌握会议的基本流程。"
          level="入门"
          lessons={3}
          icon={BookOpen}
        />
        <CourseModule
          title="进阶篇：动议与辩论"
          description="深入学习主对动议、修正案及辩论技巧，提升会议效率。"
          level="进阶"
          lessons={5}
          icon={Video}
        />
        <CourseModule
          title="实践篇：模拟会议"
          description="通过角色扮演与模拟场景，真实演练所学规则。"
          level="实战"
          lessons={4}
          icon={Users}
        />
      </div>

      <div className="mt-16 bg-blue-50 rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">准备好开始了吗？</h3>
        <p className="text-gray-600 mb-8">注册并输入邀请码，解锁全部课程内容。</p>
        <a href="/register" className="button">立即注册</a>
      </div>
    </PageShell>
  );
}

import { Users } from "lucide-react";

function CourseModule({ title, description, level, lessons, icon: Icon }: any) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border bg-white p-6 hover:shadow-lg transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 group-hover:bg-primary group-hover:text-white transition-colors">
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
          {level}
        </span>
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-sm text-gray-500 mb-6 min-h-[40px]">
        {description}
      </p>

      <div className="flex items-center text-xs text-gray-400 gap-4 border-t pt-4">
        <div className="flex items-center gap-1">
          <FileText className="h-3 w-3" />
          <span>{lessons} 节课程</span>
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          <span>颁发证书</span>
        </div>
      </div>
    </div>
  );
}
