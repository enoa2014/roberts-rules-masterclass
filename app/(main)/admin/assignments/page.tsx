"use client";

import { useEffect, useState } from "react";

import { PageShell } from "@/components/page-shell";

type AssignmentRecord = {
  id: number;
  userId: number;
  nickname: string;
  lessonId: string;
  content: string | null;
  filePath: string | null;
  status: "submitted" | "reviewed";
  reviewedBy: number | null;
  createdAt: string;
};

export default function AdminAssignmentsPage() {
  const [assignments, setAssignments] = useState<AssignmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewingId, setReviewingId] = useState<number | null>(null);

  useEffect(() => {
    void fetchAssignments();
  }, []);

  async function fetchAssignments() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/assignments?all=true");
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data?.error?.message ?? "加载作业失败");
      }
      setAssignments(data.assignments);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载作业失败");
    } finally {
      setLoading(false);
    }
  }

  async function reviewAssignment(id: number) {
    setReviewingId(id);
    setError("");
    try {
      const res = await fetch(`/api/assignments/${id}/review`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ status: "reviewed" }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data?.error?.message ?? "批阅失败");
      }
      setAssignments((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: "reviewed" } : item)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "批阅失败");
    } finally {
      setReviewingId(null);
    }
  }

  return (
    <PageShell title="作业批阅" description="查看学员提交的作业并进行标记">
      <div className="bg-white rounded-lg border shadow-sm mt-6 overflow-hidden">
        <div className="p-4 border-b bg-gray-50/50 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">作业列表</h3>
          <button
            type="button"
            onClick={() => void fetchAssignments()}
            className="button h-8 text-xs bg-white text-gray-700 border hover:bg-gray-50"
          >
            刷新
          </button>
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
              <th className="px-6 py-4">章节</th>
              <th className="px-6 py-4">提交学员</th>
              <th className="px-6 py-4">提交内容</th>
              <th className="px-6 py-4">提交时间</th>
              <th className="px-6 py-4">状态</th>
              <th className="px-6 py-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {!loading &&
              assignments.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-500">#{item.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{item.lessonId}</td>
                  <td className="px-6 py-4 text-gray-600">{item.nickname}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {item.content ?? (item.filePath ? "附件提交" : "-")}
                    {item.filePath && (
                      <div className="mt-1">
                        <a
                          href={`/api/assignments/${item.id}/file`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-primary hover:underline"
                        >
                          下载附件
                        </a>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(item.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                        item.status === "submitted"
                          ? "bg-yellow-50 text-yellow-700 ring-yellow-600/20"
                          : "bg-green-50 text-green-700 ring-green-600/20"
                      }`}
                    >
                      {item.status === "submitted" ? "待批阅" : "已批阅"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {item.status === "submitted" ? (
                      <button
                        type="button"
                        onClick={() => void reviewAssignment(item.id)}
                        disabled={reviewingId === item.id}
                        className="text-primary hover:underline disabled:text-gray-400"
                      >
                        {reviewingId === item.id ? "处理中..." : "标记已批阅"}
                      </button>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}

            {!loading && assignments.length === 0 && (
              <tr>
                <td className="px-6 py-8 text-center text-gray-500" colSpan={7}>
                  暂无作业数据
                </td>
              </tr>
            )}

            {loading && (
              <tr>
                <td className="px-6 py-8 text-center text-gray-500" colSpan={7}>
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
