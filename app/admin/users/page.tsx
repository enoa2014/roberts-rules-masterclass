import { PageShell } from "@/components/page-shell";

export default function AdminUsersPage() {
    const users = [
        { id: 1, username: "admin", role: "admin", phone: "13800000000", joined: "2024-05-01" },
        { id: 2, username: "teacher_wang", role: "teacher", phone: "13900000000", joined: "2024-05-02" },
        { id: 3, username: "student_xiaoming", role: "student", phone: "13700000000", joined: "2024-05-05" },
    ];

    return (
        <PageShell title="学员管理" description="管理所有注册用户及其角色">
            <div className="bg-white rounded-lg border shadow-sm mt-6 overflow-hidden">
                <div className="p-4 border-b bg-gray-50/50 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">用户列表</h3>
                    <button className="button h-8 text-xs bg-white text-gray-700 border hover:bg-gray-50">
                        导出数据
                    </button>
                </div>

                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b">
                        <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">用户名</th>
                            <th className="px-6 py-4">角色</th>
                            <th className="px-6 py-4">手机号</th>
                            <th className="px-6 py-4">注册时间</th>
                            <th className="px-6 py-4 text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-gray-500">#{user.id}</td>
                                <td className="px-6 py-4 font-medium text-gray-900">{user.username}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${user.role === 'admin' ? 'bg-purple-50 text-purple-700 ring-purple-700/10' :
                                            user.role === 'teacher' ? 'bg-blue-50 text-blue-700 ring-blue-700/10' :
                                                'bg-green-50 text-green-700 ring-green-600/20'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500">{user.phone}</td>
                                <td className="px-6 py-4 text-gray-500">{user.joined}</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-primary hover:underline">编辑</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </PageShell>
    );
}
