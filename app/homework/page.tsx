"use client";

import { useEffect, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { Loader2, Plus, FileText, CheckCircle, Clock } from "lucide-react";

type Assignment = {
  id: number;
  lessonId: string;
  content: string | null;
  filePath: string | null;
  status: "submitted" | "reviewed";
  createdAt: string;
};

export default function HomeworkPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [lessonId, setLessonId] = useState("rules-1");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await fetch("/api/assignments");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setAssignments(data.assignments);
        }
      }
    } catch (error) {
      console.error("Failed to fetch assignments", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedContent = content.trim();

    if (!trimmedContent && !file) {
      alert("请至少填写作业内容或上传一个附件");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("lessonId", lessonId);
      if (trimmedContent) {
        formData.append("content", trimmedContent);
      }
      if (file) {
        formData.append("file", file);
      }

      const res = await fetch("/api/assignments", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setShowForm(false);
        setContent("");
        setFile(null);
        fetchAssignments(); // Refresh list
      } else {
        const data = await res.json().catch(() => null);
        alert(data?.error?.message ?? "提交失败，请重试");
      }
    } catch (error) {
      console.error("Submit error", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageShell title="作业与复盘" description="提交课程作业，查看教师反馈">
      <div className="mt-6 flex justify-between items-center">
        <h3 className="font-bold text-lg">我的作业</h3>
        <button
          onClick={() => setShowForm(true)}
          className="button"
        >
          <Plus className="mr-2 h-4 w-4" /> 提交作业
        </button>
      </div>

      {showForm && (
        <div className="mt-6 p-6 bg-white rounded-xl border shadow-sm">
          <h4 className="font-bold mb-4">新作业提交</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">课程章节</label>
              <select
                value={lessonId}
                onChange={(e) => setLessonId(e.target.value)}
                className="w-full p-2 border rounded-lg bg-gray-50"
              >
                <option value="rules-1">第一讲：议事规则基础</option>
                <option value="rules-2">第二讲：动议体系详解</option>
                <option value="rules-3">第三讲：主持与辩论</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">作业内容</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-3 border rounded-lg h-32"
                placeholder="在此输入作业内容或复盘心得..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">附件（可选）</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">支持 pdf/doc/docx/jpg/png，最大 10MB</p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFile(null);
                }}
                className="button bg-white text-gray-700 border hover:bg-gray-50"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="button"
              >
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                提交
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4 mt-6">
          {assignments.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed">
              暂无作业记录
            </div>
          ) : (
            assignments.map((assignment) => (
              <div key={assignment.id} className="bg-white p-6 rounded-xl border shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-blue-50 text-primary rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">
                        {assignment.lessonId === 'rules-1' ? '第一讲：议事规则基础' :
                          assignment.lessonId === 'rules-2' ? '第二讲：动议体系详解' :
                            assignment.lessonId}
                      </h4>
                      <p className="text-xs text-gray-500">
                        提交时间: {new Date(assignment.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${assignment.status === 'reviewed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                    {assignment.status === 'reviewed' ? (
                      <><CheckCircle className="h-3 w-3" /> 已批阅</>
                    ) : (
                      <><Clock className="h-3 w-3" /> 待批阅</>
                    )}
                  </span>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg text-gray-700 text-sm mb-4">
                  {assignment.content || "（仅提交了附件）"}
                </div>

                {assignment.filePath && (
                  <div className="mb-4">
                    <a
                      href={`/api/assignments/${assignment.id}/file`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      下载附件
                    </a>
                  </div>
                )}

                {assignment.status === 'reviewed' && (
                  <div className="border-t pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-sm text-gray-900">教师反馈</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      暂无文字反馈
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </PageShell>
  );
}
