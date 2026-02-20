"use client";

import { useEffect, useState } from "react";
import { Copy, Plus, Trash2 } from "lucide-react";

import { PageShell } from "@yiqidu/ui";

type InviteRecord = {
  id: number;
  code: string;
  targetRole: "student" | "teacher";
  maxUses: number;
  usedCount: number;
  expiresAt: string | null;
  status: "active" | "expired" | "exhausted";
  createdAt: string;
};

export default function AdminInvitesPage() {
  const [invites, setInvites] = useState<InviteRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [targetRole, setTargetRole] = useState<"student" | "teacher">("student");
  const [maxUses, setMaxUses] = useState(30);
  const [expiresAt, setExpiresAt] = useState("");

  useEffect(() => {
    void fetchInvites();
  }, []);

  async function fetchInvites() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/invites");
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data?.error?.message ?? "加载邀请码失败");
      }
      setInvites(data.invites);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载邀请码失败");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateInvite() {
    setCreating(true);
    setError("");
    try {
      const res = await fetch("/api/admin/invites", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          targetRole,
          maxUses,
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data?.error?.message ?? "创建邀请码失败");
      }
      setInvites((prev) => [data.invite, ...prev]);
      setExpiresAt("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "创建邀请码失败");
    } finally {
      setCreating(false);
    }
  }

  async function handleRevokeInvite(id: number) {
    if (!confirm("确定要作废这个邀请码吗？")) {
      return;
    }

    setError("");
    try {
      const res = await fetch(`/api/admin/invites/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data?.error?.message ?? "作废邀请码失败");
      }
      await fetchInvites();
    } catch (err) {
      setError(err instanceof Error ? err.message : "作废邀请码失败");
    }
  }

  return (
    <PageShell title="邀请码管理" description="生成与管理注册邀请码">
      <div className="mt-6 space-y-6">
        <div className="bg-white rounded-lg border shadow-sm p-4 flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="target-role" className="text-xs text-gray-500">
              目标角色
            </label>
            <select
              id="target-role"
              value={targetRole}
              onChange={(event) => setTargetRole(event.target.value as "student" | "teacher")}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            >
              <option value="student">student</option>
              <option value="teacher">teacher</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="max-uses" className="text-xs text-gray-500">
              最大使用次数（0=不限）
            </label>
            <input
              id="max-uses"
              type="number"
              min={0}
              value={maxUses}
              onChange={(event) => setMaxUses(Number(event.target.value))}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="expires-at" className="text-xs text-gray-500">
              过期时间（可选）
            </label>
            <input
              id="expires-at"
              type="datetime-local"
              value={expiresAt}
              onChange={(event) => setExpiresAt(event.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <button type="button" className="button" disabled={creating} onClick={handleCreateInvite}>
            <Plus className="mr-2 h-4 w-4" />
            {creating ? "创建中..." : "生成新邀请码"}
          </button>
          <button
            type="button"
            onClick={() => void fetchInvites()}
            className="button bg-white text-gray-700 border hover:bg-gray-50"
          >
            刷新
          </button>
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b">
              <tr>
                <th className="px-6 py-4">邀请码</th>
                <th className="px-6 py-4">目标角色</th>
                <th className="px-6 py-4">使用情况</th>
                <th className="px-6 py-4">过期时间</th>
                <th className="px-6 py-4">状态</th>
                <th className="px-6 py-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {!loading &&
                invites.map((invite) => (
                  <tr key={invite.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono font-medium text-gray-900">{invite.code}</td>
                    <td className="px-6 py-4 text-gray-600">{invite.targetRole}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {invite.usedCount} / {invite.maxUses === 0 ? "∞" : invite.maxUses}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {invite.expiresAt ? new Date(invite.expiresAt).toLocaleString() : "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                          invite.status === "active"
                            ? "bg-green-50 text-green-700 ring-green-600/20"
                            : "bg-gray-100 text-gray-700 ring-gray-500/20"
                        }`}
                      >
                        {invite.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-900 icon-btn"
                        onClick={() => navigator.clipboard.writeText(invite.code)}
                        title="复制邀请码"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-red-600 icon-btn"
                        onClick={() => void handleRevokeInvite(invite.id)}
                        title="作废邀请码"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}

              {!loading && invites.length === 0 && (
                <tr>
                  <td className="px-6 py-8 text-center text-gray-500" colSpan={6}>
                    暂无邀请码
                  </td>
                </tr>
              )}

              {loading && (
                <tr>
                  <td className="px-6 py-8 text-center text-gray-500" colSpan={6}>
                    加载中...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PageShell>
  );
}
