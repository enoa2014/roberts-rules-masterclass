import { PageShell } from "@/components/page-shell";

export default function AdminSettingsPage() {
    return (
        <PageShell title="系统设置" description="配置系统参数与全局通知">
            <div className="bg-white rounded-lg border shadow-sm mt-6 p-8 text-center text-gray-500">
                <p>系统设置功能暂未开放</p>
                <p className="text-sm mt-2">（计划在 MVP+1 阶段支持）</p>
            </div>
        </PageShell>
    );
}
