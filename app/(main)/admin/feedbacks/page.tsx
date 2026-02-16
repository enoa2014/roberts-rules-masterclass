"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { PageShell } from "@/components/page-shell";

type FeedbackRecord = {
  id: number;
  userId: number;
  nickname: string;
  role: string;
  classSessionId: number | null;
  classSessionTitle: string | null;
  rating: number | null;
  content: string | null;
  createdAt: string;
};

export default function AdminFeedbacksPage() {
  const [feedbacks, setFeedbacks] = useState<FeedbackRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [classSessionIdInput, setClassSessionIdInput] = useState("");

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set("limit", "500");
    if (classSessionIdInput.trim()) {
      params.set("classSessionId", classSessionIdInput.trim());
    }
    return params.toString();
  }, [classSessionIdInput]);

  const fetchFeedbacks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/feedbacks?${queryString}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data?.error?.message ?? "加载反馈失败");
      }
      setFeedbacks(data.feedbacks || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载反馈失败");
    } finally {
      setLoading(false);
    }
  }, [queryString]);

  useEffect(() => {
    void fetchFeedbacks();
  }, [fetchFeedbacks]);

  function exportCsvUrl() {
    const params = new URLSearchParams();
    params.set("format", "csv");
    params.set("limit", "2000");
    if (classSessionIdInput.trim()) {
      params.set("classSessionId", classSessionIdInput.trim());
    }
    return `/api/feedbacks?${params.toString()}`;
  }

  return (
    <PageShell title="反馈管理" description="查看课堂反馈并导出为 CSV">
      <div className="mt-6 space-y-4">
        <div className="bg-white rounded-lg border shadow-sm p-4 flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="classSessionId" className="text-xs text-gray-500">
              课堂 ID（可选）
            </label>
            <input
              id="classSessionId"
              type="number"
              min={1}
              placeholder="例如 12"
              value={classSessionIdInput}
              onChange={(event) => setClassSessionIdInput(event.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm w-40"
            />
          </div>

          <button
            type="button"
            onClick={() => void fetchFeedbacks()}
            className="button h-10"
          >
            查询反馈
          </button>
          <a
            href={exportCsvUrl()}
            className="button h-10 bg-white text-gray-700 border hover:bg-gray-50"
            target="_blank"
            rel="noreferrer"
          >
            导出 CSV
          </a>
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
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">学员</th>
                <th className="px-4 py-3">课堂</th>
                <th className="px-4 py-3">评分</th>
                <th className="px-4 py-3">反馈内容</th>
                <th className="px-4 py-3">提交时间</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {!loading &&
                feedbacks.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500">#{item.id}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{item.nickname}</div>
                      <div className="text-xs text-gray-500">UID: {item.userId} · {item.role}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {item.classSessionId ? (
                        <div>
                          <div className="font-medium">#{item.classSessionId}</div>
                          <div className="text-xs text-gray-500">{item.classSessionTitle ?? "-"}</div>
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{item.rating ?? "-"}</td>
                    <td className="px-4 py-3 text-gray-700 whitespace-pre-wrap">
                      {item.content ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}

              {!loading && feedbacks.length === 0 && (
                <tr>
                  <td className="px-4 py-8 text-center text-gray-500" colSpan={6}>
                    暂无反馈数据
                  </td>
                </tr>
              )}

              {loading && (
                <tr>
                  <td className="px-4 py-8 text-center text-gray-500" colSpan={6}>
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
