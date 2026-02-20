import { PageShell } from "@yiqidu/ui/page-shell";
import { FileDown, FileText, Video, Download } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export default function ResourcesPage() {
  return (
    <PageShell title="资源中心" description="下载课程 PPT、讲义与参考资料。">
      <div className="space-y-3">
        <ResourceItem
          title="议事规则基础班-第一次课.pdf"
          type="PPT"
          size="5.2 MB"
          date="2024-05-01"
        />
        <ResourceItem
          title="主动议处理流程图.png"
          type="Image"
          size="1.8 MB"
          date="2024-05-02"
        />
        <ResourceItem
          title="模拟会议剧本样本.docx"
          type="Doc"
          size="0.5 MB"
          date="2024-05-05"
        />
      </div>
    </PageShell>
  );
}

const typeConfig: Record<string, { icon: LucideIcon; bg: string; text: string }> = {
  PPT: { icon: Video, bg: "bg-orange-50", text: "text-orange-600" },
  Image: { icon: FileText, bg: "bg-blue-50", text: "text-blue-600" },
  Doc: { icon: FileDown, bg: "bg-emerald-50", text: "text-emerald-600" },
};

type ResourceItemProps = {
  title: string;
  type: "PPT" | "Image" | "Doc";
  size: string;
  date: string;
};

function ResourceItem({ title, type, size, date }: ResourceItemProps) {
  const config = typeConfig[type] || typeConfig.Doc;
  const Icon = config.icon;

  return (
    <div className="group flex items-center justify-between p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-200 cursor-pointer">
      <div className="flex items-center gap-4">
        <div className={`h-11 w-11 ${config.bg} ${config.text} rounded-xl flex items-center justify-center flex-shrink-0`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 text-sm group-hover:text-primary transition-colors duration-200">
            {title}
          </h4>
          <div className="flex gap-3 text-xs text-gray-400 mt-1">
            <span className="badge bg-gray-50 text-gray-500 px-2 py-0.5">{type}</span>
            <span>{size}</span>
            <span>{date}</span>
          </div>
        </div>
      </div>
      <button className="button-secondary h-9 px-4 text-xs gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Download className="h-3.5 w-3.5" />
        下载
      </button>
    </div>
  );
}
