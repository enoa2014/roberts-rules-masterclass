import { PageShell } from "@/components/page-shell";
import { FileDown, FileText, Video } from "lucide-react";

export default function ResourcesPage() {
  return (
    <PageShell title="资源中心" description="下载课程 PPT、讲义与参考资料。">
      <div className="space-y-4 mt-8">
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

function ResourceItem({ title, type, size, date }: any) {
  const Icon = type === 'PPT' ? Video : type === 'Image' ? FileText : FileDown;

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 bg-blue-50 text-primary rounded-lg flex items-center justify-center">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h4 className="font-medium text-gray-900">{title}</h4>
          <div className="flex gap-4 text-xs text-gray-500 mt-1">
            <span>{size}</span>
            <span>{date}</span>
          </div>
        </div>
      </div>
      <button className="button bg-white text-gray-700 border border-gray-200 hover:bg-gray-100 h-9 px-4 text-sm shadow-none">
        下载
      </button>
    </div>
  );
}
