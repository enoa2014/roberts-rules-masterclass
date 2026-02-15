import { PageShell } from "@/components/page-shell";
import { ChevronDown } from "lucide-react";

export default function FAQPage() {
  const faqs = [
    {
      q: "如何获得课程学习资格？",
      a: "目前主要通过线下培训班发放邀请码。如果您已报名线下课，请向您的班主任索取邀请码。注册账号后输入邀请码即可解锁全部线上内容。"
    },
    {
      q: "没有邀请码可以注册吗？",
      a: "可以注册账号（Visitor 身份），但只能访问公开的课程简介和部分资源。核心课程、作业提交和互动功能需要 Student 资格（通过邀请码激活）。"
    },
    {
      q: "忘记密码怎么办？",
      a: "目前 MVP 版本暂未开通自助找回密码功能。请联系您的班主任或管理员重置密码。"
    },
    {
      q: "支持哪些设备访问？",
      a: "平台支持电脑（推荐使用 Chrome/Edge 浏览器）和手机访问。课堂互动功能建议在手机微信内使用，以便随时举手和投票。"
    }
  ];

  return (
    <PageShell title="常见问题" description="这里有您可能关心的问题解答">
      <div className="mt-8 max-w-3xl mx-auto space-y-4">
        {faqs.map((item, index) => (
          <div key={index} className="border rounded-lg overflow-hidden bg-white">
            <details className="group">
              <summary className="flex cursor-pointer items-center justify-between p-6 font-medium text-gray-900 hover:bg-gray-50 list-none [&::-webkit-details-marker]:hidden">
                {item.q}
                <ChevronDown className="h-5 w-5 text-gray-500 transition-transform group-open:rotate-180" />
              </summary>
              <div className="border-t px-6 py-4 text-gray-600 bg-gray-50/50 leading-relaxed">
                {item.a}
              </div>
            </details>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
