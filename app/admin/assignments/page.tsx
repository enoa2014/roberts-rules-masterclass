import { PageShell } from "@/components/page-shell";

export default function AdminAssignmentsPage() {
    const assignments = [
        { id: 101, title: "议事规则心得体会", student: "张三", submitted: "2024-05-10", status: "待批阅" },
        { id: 102, title: "模拟会议记录", student: "李四", submitted: "2024-05-11", status: "待批阅" },
        { id: 103, title: "动议练习", student: "王五", submitted: "2024-05-12", status: "已通过" },
    ];

    return (
        <PageShell title="作业批阅" description="查看学员提交的作业并进行打分">
            <div className="bg-white rounded-lg border shadow-sm mt-6 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b">
                        <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">作业标题</th>
                            <th className="px-6 py-4">提交学员</th>
                            <th className="px-6 py-4">提交时间</th>
                            <th className="px-6 py-4">状态</th>
                            <th className="px-6 py-4 text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {assignments.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-gray-500">#{item.id}</td>
                                <td className="px-6 py-4 font-medium text-gray-900">{item.title}</td>
                                <td className="px-6 py-4 text-gray-600">{item.student}</td>
                                <td className="px-6 py-4 text-gray-500">{item.submitted}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${item.status === '待批阅' ? 'bg-yellow-50 text-yellow-700 ring-yellow-600/20' :
                                            'bg-green-50 text-green-700 ring-green-600/20'
                                        }`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-primary hover:underline">批阅</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </PageShell>
    );
}
