"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { Loader2, Plus, Play, Square, Users, X } from "lucide-react";

type Session = {
  id: number;
  code: string;
  name: string;
  status: "pending" | "active" | "ended";
  created_at: string;
};

export default function InteractPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  // Create Modal State
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  async function fetchSessions() {
    try {
      const res = await fetch("/api/interact/sessions");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setSessions(data.sessions.map((s: any) => ({
            ...s,
            name: s.title,
            code: `CLASS-${String(s.id).padStart(3, '0')}`,
            created_at: new Date(s.createdAt).toLocaleDateString()
          })));
        }
      }
    } catch (error) {
      console.error("Failed to fetch sessions", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateSession(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/interact/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
      });

      if (res.ok) {
        const newSession = await res.json();
        setIsCreating(false);
        setNewTitle("");
        fetchSessions(); // Refresh list
        router.push(`/interact/${newSession.id}`); // Optional: Auto-enter
      }
    } catch (error) {
      console.error("Failed to create session", error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageShell title="课堂互动" description="加入课堂，参与实时互动与表决">
      <div className="mt-6 flex justify-between items-center">
        <h3 className="font-bold text-lg">我的课堂</h3>
        <button
          onClick={() => setIsCreating(true)}
          className="button"
        >
          <Plus className="mr-2 h-4 w-4" /> 创建课堂
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4 mt-6 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => (
            <div key={session.id} className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${session.status === 'active' ? 'bg-green-100 text-green-700' :
                  session.status === 'pending' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                  {session.status.toUpperCase()}
                </span>
                <span className="text-gray-400 text-sm">#{session.code}</span>
              </div>
              <h4 className="font-bold text-lg mb-2">{session.name}</h4>
              <p className="text-gray-500 text-sm mb-6">创建时间: {session.created_at}</p>

              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/interact/${session.id}`)}
                  className="button flex-1"
                >
                  <Users className="mr-2 h-4 w-4" /> 进入课堂
                </button>
                {/* 
                  MVP Note: Start/Stop controls are better placed inside the session detail page
                  to ensure context. Simplified here to just entry.
                */}
              </div>
            </div>
          ))}

          {sessions.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-dashed">
              暂无课堂，点击右上角创建
            </div>
          )}
        </div>
      )}

      {/* Create Session Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold">创建新课堂</h3>
              <button
                onClick={() => setIsCreating(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSession} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  课堂主题
                </label>
                <input
                  autoFocus
                  className="input w-full"
                  placeholder="请输入课程主题"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  disabled={submitting}
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="button bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                  disabled={submitting}
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="button"
                  disabled={submitting || !newTitle.trim()}
                >
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  确认创建
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageShell>
  );
}
