"use client";

import { useCallback, useEffect, useState } from "react";

import { PageShell } from "@/components/page-shell";

type UserRecord = {
  id: number;
  username: string | null;
  nickname: string | null;
  phone: string | null;
  role: "registered" | "student" | "teacher" | "admin" | "blocked";
  createdAt: string;
};

const roleOptions: UserRecord["role"][] = [
  "registered",
  "student",
  "teacher",
  "admin",
  "blocked",
];
type RoleFilter = "all" | UserRecord["role"];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingUserId, setSavingUserId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");

  const fetchUsers = useCallback(async (filter: RoleFilter) => {
    setLoading(true);
    setError("");
    try {
      const query = filter === "all" ? "" : `?role=${encodeURIComponent(filter)}`;
      const res = await fetch(`/api/admin/users${query}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data?.error?.message ?? "加载用户失败");
      }
      setUsers(data.users);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载用户失败");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchUsers(roleFilter);
  }, [fetchUsers, roleFilter]);

  async function updateRole(userId: number, role: UserRecord["role"]) {
    setSavingUserId(userId);
    setError("");
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data?.error?.message ?? "更新角色失败");
      }
      setUsers((prev) => {
        if (roleFilter !== "all" && data.user.role !== roleFilter) {
          return prev.filter((item) => item.id !== userId);
        }
        return prev.map((item) => (item.id === userId ? { ...item, role: data.user.role } : item));
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "更新角色失败");
    } finally {
      setSavingUserId(null);
    }
  }

  return (
    <PageShell title="学员管理" description="管理所有注册用户及其角色">
      <div className="bg-white rounded-lg border shadow-sm mt-6 overflow-hidden">
        <div className="p-4 border-b bg-gray-50/50 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">用户列表</h3>
          <div className="flex items-center gap-2">
            <label htmlFor="admin-users-role-filter" className="text-xs text-gray-600">
              角色筛选
            </label>
            <select
              id="admin-users-role-filter"
              data-testid="admin-users-role-filter"
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value as RoleFilter)}
              className="h-8 rounded-md border border-gray-300 bg-white px-2 text-xs text-gray-700"
            >
              <option value="all">全部</option>
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => void fetchUsers(roleFilter)}
              className="button h-8 text-xs bg-white text-gray-700 border hover:bg-gray-50"
            >
              刷新
            </button>
          </div>
        </div>

        {error && (
          <div className="mx-4 mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 font-medium border-b">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">用户名</th>
              <th className="px-6 py-4">昵称</th>
              <th className="px-6 py-4">角色</th>
              <th className="px-6 py-4">手机号</th>
              <th className="px-6 py-4">注册时间</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {!loading &&
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-500">#{user.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{user.username ?? "-"}</td>
                  <td className="px-6 py-4 text-gray-600">{user.nickname ?? "-"}</td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(event) =>
                        void updateRole(user.id, event.target.value as UserRecord["role"])
                      }
                      disabled={savingUserId === user.id}
                      className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs"
                    >
                      {roleOptions.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{user.phone ?? "-"}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(user.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}

            {!loading && users.length === 0 && (
              <tr>
                <td className="px-6 py-8 text-center text-gray-500" colSpan={6}>
                  暂无用户数据
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
    </PageShell>
  );
}
