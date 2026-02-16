"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { PageShell } from "@/components/page-shell";

type PostRecord = {
  id: number;
  userId: number;
  nickname: string;
  title: string | null;
  content: string;
  status: "visible" | "hidden" | "deleted";
  createdAt: string;
  commentCount: number;
};

type CommentRecord = {
  id: number;
  postId: number;
  userId: number;
  nickname: string;
  content: string;
  status: "visible" | "hidden" | "deleted";
  createdAt: string;
};

type ModerationLog = {
  id: number;
  operatorId: number;
  operatorName: string;
  operatorRole: string;
  targetType: "post" | "comment" | "user";
  targetId: number;
  action: "hide" | "delete" | "block" | "unblock";
  reason: string | null;
  createdAt: string;
};

type TargetType = "post" | "comment" | "user";
type ActionType = "hide" | "delete" | "block" | "unblock";

const ACTIONS_BY_TARGET: Record<TargetType, ActionType[]> = {
  post: ["hide", "delete"],
  comment: ["hide", "delete"],
  user: ["block", "unblock"],
};

export default function AdminModerationPage() {
  const [posts, setPosts] = useState<PostRecord[]>([]);
  const [comments, setComments] = useState<CommentRecord[]>([]);
  const [logs, setLogs] = useState<ModerationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);

  const [targetType, setTargetType] = useState<TargetType>("post");
  const [targetId, setTargetId] = useState("");
  const [action, setAction] = useState<ActionType>("hide");
  const [reason, setReason] = useState("");

  const actionOptions = useMemo(() => ACTIONS_BY_TARGET[targetType], [targetType]);

  useEffect(() => {
    if (!actionOptions.includes(action)) {
      setAction(actionOptions[0]);
    }
  }, [action, actionOptions]);

  useEffect(() => {
    if (selectedPostId) {
      void fetchComments(selectedPostId);
    } else {
      setComments([]);
    }
  }, [selectedPostId]);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [postsRes, logsRes] = await Promise.all([
        fetch("/api/discussion/posts?includeHidden=true"),
        fetch("/api/admin/moderation/logs?limit=200"),
      ]);

      const postsData = await postsRes.json();
      const logsData = await logsRes.json();

      if (!postsRes.ok || !postsData.success) {
        throw new Error(postsData?.error?.message ?? "加载帖子失败");
      }
      if (!logsRes.ok || !logsData.success) {
        throw new Error(logsData?.error?.message ?? "加载治理日志失败");
      }

      setPosts(postsData.posts || []);
      setLogs(logsData.logs || []);

      if (postsData.posts?.length > 0) {
        setSelectedPostId((current) => current ?? postsData.posts[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载治理数据失败");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshAll();
  }, [refreshAll]);

  async function fetchComments(postId: number) {
    setLoadingComments(true);
    setError("");
    try {
      const res = await fetch(`/api/discussion/comments?postId=${postId}&includeHidden=true`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data?.error?.message ?? "加载评论失败");
      }
      setComments(data.comments || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载评论失败");
    } finally {
      setLoadingComments(false);
    }
  }

  async function applyModeration(payload: {
    targetType: TargetType;
    targetId: number;
    action: ActionType;
    reason?: string;
  }) {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/admin/moderation/actions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data?.error?.message ?? "治理操作失败");
      }
      await refreshAll();
      if (selectedPostId) {
        await fetchComments(selectedPostId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "治理操作失败");
    } finally {
      setSubmitting(false);
    }
  }

  async function submitManualAction() {
    const numericTargetId = Number(targetId);
    if (!Number.isInteger(numericTargetId) || numericTargetId <= 0) {
      setError("请填写合法的目标 ID");
      return;
    }

    await applyModeration({
      targetType,
      targetId: numericTargetId,
      action,
      reason: reason.trim() || undefined,
    });
    setReason("");
  }

  return (
    <PageShell title="内容治理" description="执行帖子/评论/用户治理并查看操作日志">
      <div className="mt-6 space-y-4">
        <div className="bg-white rounded-lg border shadow-sm p-4 flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">目标类型</label>
            <select
              value={targetType}
              onChange={(event) => setTargetType(event.target.value as TargetType)}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            >
              <option value="post">post</option>
              <option value="comment">comment</option>
              <option value="user">user</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">目标 ID</label>
            <input
              type="number"
              min={1}
              value={targetId}
              onChange={(event) => setTargetId(event.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm w-28"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">动作</label>
            <select
              value={action}
              onChange={(event) => setAction(event.target.value as ActionType)}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            >
              {actionOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1 min-w-64">
            <label className="text-xs text-gray-500">原因（可选）</label>
            <input
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              maxLength={200}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="填写治理原因"
            />
          </div>
          <button type="button" className="button" disabled={submitting} onClick={() => void submitManualAction()}>
            {submitting ? "提交中..." : "执行治理动作"}
          </button>
          <button
            type="button"
            className="button bg-white text-gray-700 border hover:bg-gray-50"
            onClick={() => void refreshAll()}
          >
            刷新
          </button>
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <section className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <div className="p-4 border-b bg-gray-50/50">
              <h3 className="font-semibold text-gray-900">帖子快速治理</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {loading && <div className="p-4 text-sm text-gray-500">加载中...</div>}
              {!loading && posts.length === 0 && (
                <div className="p-4 text-sm text-gray-500">暂无帖子</div>
              )}
              {!loading &&
                posts.map((post) => (
                  <div
                    key={post.id}
                    className={`p-4 border-b last:border-b-0 ${
                      selectedPostId === post.id ? "bg-blue-50/60" : "bg-white"
                    }`}
                  >
                    <div className="flex justify-between gap-2 items-start">
                      <div className="cursor-pointer" onClick={() => setSelectedPostId(post.id)}>
                        <div className="text-sm font-semibold text-gray-900">
                          #{post.id} {post.title ?? "无标题"}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {post.nickname} · 状态 {post.status} · 评论 {post.commentCount}
                        </div>
                        <div className="text-xs text-gray-600 mt-2 line-clamp-2">{post.content}</div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          className="px-2 py-1 rounded text-xs border border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100"
                          onClick={() =>
                            void applyModeration({ targetType: "post", targetId: post.id, action: "hide" })
                          }
                          disabled={submitting}
                        >
                          隐藏
                        </button>
                        <button
                          type="button"
                          className="px-2 py-1 rounded text-xs border border-red-200 text-red-700 bg-red-50 hover:bg-red-100"
                          onClick={() =>
                            void applyModeration({ targetType: "post", targetId: post.id, action: "delete" })
                          }
                          disabled={submitting}
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </section>

          <section className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <div className="p-4 border-b bg-gray-50/50">
              <h3 className="font-semibold text-gray-900">
                评论快速治理{selectedPostId ? `（帖子 #${selectedPostId}）` : ""}
              </h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {!selectedPostId && <div className="p-4 text-sm text-gray-500">先选择左侧帖子</div>}
              {selectedPostId && loadingComments && (
                <div className="p-4 text-sm text-gray-500">加载评论中...</div>
              )}
              {selectedPostId && !loadingComments && comments.length === 0 && (
                <div className="p-4 text-sm text-gray-500">暂无评论</div>
              )}
              {selectedPostId &&
                !loadingComments &&
                comments.map((comment) => (
                  <div key={comment.id} className="p-4 border-b last:border-b-0 bg-white">
                    <div className="flex justify-between gap-2 items-start">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          #{comment.id} · {comment.nickname}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">状态 {comment.status}</div>
                        <div className="text-xs text-gray-700 mt-2 whitespace-pre-wrap">
                          {comment.content}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          className="px-2 py-1 rounded text-xs border border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100"
                          onClick={() =>
                            void applyModeration({
                              targetType: "comment",
                              targetId: comment.id,
                              action: "hide",
                            })
                          }
                          disabled={submitting}
                        >
                          隐藏
                        </button>
                        <button
                          type="button"
                          className="px-2 py-1 rounded text-xs border border-red-200 text-red-700 bg-red-50 hover:bg-red-100"
                          onClick={() =>
                            void applyModeration({
                              targetType: "comment",
                              targetId: comment.id,
                              action: "delete",
                            })
                          }
                          disabled={submitting}
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        </div>

        <section className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-gray-50/50">
            <h3 className="font-semibold text-gray-900">治理日志</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 font-medium border-b">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">操作者</th>
                  <th className="px-4 py-3">目标</th>
                  <th className="px-4 py-3">动作</th>
                  <th className="px-4 py-3">原因</th>
                  <th className="px-4 py-3">时间</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {!loading &&
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-500">#{log.id}</td>
                      <td className="px-4 py-3 text-gray-700">
                        {log.operatorName}
                        <span className="text-xs text-gray-500 ml-1">({log.operatorRole})</span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {log.targetType} #{log.targetId}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{log.action}</td>
                      <td className="px-4 py-3 text-gray-600">{log.reason ?? "-"}</td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                {!loading && logs.length === 0 && (
                  <tr>
                    <td className="px-4 py-8 text-center text-gray-500" colSpan={6}>
                      暂无治理日志
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
        </section>
      </div>
    </PageShell>
  );
}
