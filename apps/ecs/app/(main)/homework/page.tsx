"use client";

import { useEffect, useState } from "react";
import { PageShell } from "@yiqidu/ui";
import { Loader2, Plus, FileText, CheckCircle, Clock, Upload, X } from "lucide-react";

type Assignment = {
  id: number;
  lessonId: string;
  content: string | null;
  filePath: string | null;
  status: "submitted" | "reviewed";
  createdAt: string;
};

const lessonMap: Record<string, string> = {
  "rules-1": "第一讲：议事规则基础",
  "rules-2": "第二讲：动议体系详解",
  "rules-3": "第三讲：主持与辩论",
};

export default function HomeworkPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
        fetchAssignments();
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
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg text-gray-900">我的作业</h3>
        <button
          onClick={() => setShowForm(true)}
          className="button"
        >
          <Plus className="mr-2 h-4 w-4" /> 提交作业
        </button>
      </div>

      {/* New Assignment Form */}
      {showForm && (
        <div className="mb-8 p-7 bg-white rounded-2xl border border-gray-100 shadow-soft animate-fadeInUp">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-bold text-lg text-gray-900">新作业提交</h4>
            <button
              onClick={() => { setShowForm(false); setFile(null); }}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label mb-1.5 block">课程章节</label>
              <select
                value={lessonId}
                onChange={(e) => setLessonId(e.target.value)}
                className="input cursor-pointer"
              >
                {Object.entries(lessonMap).map(([id, label]) => (
                  <option key={id} value={id}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label mb-1.5 block">作业内容</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="input h-32 py-3 resize-none"
                placeholder="在此输入作业内容或复盘心得..."
              />
            </div>
            <div>
              <label className="label mb-1.5 block">附件 <span className="text-gray-400 font-normal">(可选)</span></label>
              <div className="flex items-center gap-3">
                <label className="button-secondary h-10 px-4 text-sm gap-2 cursor-pointer">
                  <Upload className="h-4 w-4" />
                  选择文件
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    className="hidden"
                  />
                </label>
                {file && <span className="text-sm text-gray-600">{file.name}</span>}
              </div>
              <p className="text-xs text-gray-400 mt-1.5">支持 pdf / doc / docx / jpg / png，最大 10MB</p>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => { setShowForm(false); setFile(null); }}
                className="button-secondary"
              >
                取消
              </button>
              <button type="submit" disabled={submitting} className="button">
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                提交作业
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Assignment List */}
      {loading ? (
        <div className="flex justify-center p-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4">
          {assignments.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
              <FileText className="h-12 w-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 font-medium">暂无作业记录</p>
              <p className="text-gray-300 text-sm mt-1">点击上方“提交作业”开始</p>
            </div>
          ) : (
            assignments.map((assignment) => (
              <div key={assignment.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 bg-blue-50 text-primary rounded-xl flex items-center justify-center flex-shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">
                        {lessonMap[assignment.lessonId] || assignment.lessonId}
                      </h4>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(assignment.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`badge ${assignment.status === "reviewed"
                        ? "badge-success"
                        : "badge-warning"
                      }`}
                  >
                    {assignment.status === "reviewed" ? (
                      <><CheckCircle className="h-3 w-3" /> 已批阅</>
                    ) : (
                      <><Clock className="h-3 w-3" /> 待批阅</>
                    )}
                  </span>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl text-gray-600 text-sm leading-relaxed mb-4">
                  {assignment.content || "（仅提交了附件）"}
                </div>

                {assignment.filePath && (
                  <div className="mb-4">
                    <a
                      href={`/api/assignments/${assignment.id}/file`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-primary font-medium hover:text-primary/80 transition-colors cursor-pointer"
                    >
                      下载附件 →
                    </a>
                  </div>
                )}

                {assignment.status === "reviewed" && (
                  <div className="border-t border-gray-50 pt-4">
                    <span className="font-bold text-sm text-gray-900">教师反馈</span>
                    <p className="text-sm text-gray-500 mt-1">暂无文字反馈</p>
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
