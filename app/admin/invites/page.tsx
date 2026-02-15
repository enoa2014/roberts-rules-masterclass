"use client";

import { useState } from "react";
import { PageShell } from "@/components/page-shell";
import { Plus, Copy, Trash2 } from "lucide-react";

export default function AdminInvitesPage() {
    const [invites, setInvites] = useState([
        { code: "CLASS-A-2024", role: "student", uses: 12, max: 50, status: "active" },
        { code: "TEACHER-KEY", role: "teacher", uses: 2, max: 5, status: "active" },
    ]);

    return (
        <PageShell title="邀请码管理" description="生成与管理注册邀请码">
            <div className="mt-6 space-y-6">
                <div className="flex justify-end">
                    <button className="button">
                        <Plus className="mr-2 h-4 w-4" /> 生成新邀请码
                    </button>
                </div>

                <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium border-b">
                            <tr>
                                <th className="px-6 py-4">邀请码</th>
                                <th className="px-6 py-4">目标角色</th>
                                <th className="px-6 py-4">使用情况</th>
                                <th className="px-6 py-4">状态</th>
                                <th className="px-6 py-4 text-right">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {invites.map((invite) => (
                                <tr key={invite.code} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-mono font-medium text-gray-900">
                                        {invite.code}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                            {invite.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {invite.uses} / {invite.max}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                            {invite.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button className="text-gray-400 hover:text-gray-900 icon-btn">
                                            <Copy className="h-4 w-4" />
                                        </button>
                                        <button className="text-gray-400 hover:text-red-600 icon-btn">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </PageShell>
    );
}
